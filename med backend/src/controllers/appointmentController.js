const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const User = require('../models/User');
const Notification = require('../models/Notification');
const Prescription = require('../models/Prescription');

// @desc    Get all appointments (Admin)
// @route   GET /api/admin/appointments
// @access  Private/Admin
exports.getAllAppointments = async (req, res) => {
  try {
    const { status, page = 1, limit = 20, startDate, endDate } = req.query;
    const query = {};
    
    if (status) query.status = status;
    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }
    
    const appointments = await Appointment.find(query)
      .populate('patient', 'name email phone')
      .populate('doctor')
      .populate('doctor.userId', 'name')
      .populate('hospital')
      .sort('-createdAt')
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Appointment.countDocuments(query);
    
    res.json({
      appointments,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get appointment by ID
// @route   GET /api/appointments/:id
// @access  Private
exports.getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('patient', 'name email phone dateOfBirth gender')
      .populate('doctor')
      .populate('doctor.userId', 'name')
      .populate('hospital')
      .populate('prescription');
    
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    
    // Check authorization
    const isPatient = appointment.patient._id.toString() === req.user.id;
    const isDoctor = appointment.doctor.userId._id.toString() === req.user.id;
    const isAdmin = req.user.role === 'admin';
    
    if (!isPatient && !isDoctor && !isAdmin) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    res.json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update appointment
// @route   PUT /api/appointments/:id
// @access  Private
exports.updateAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    
    // Authorization check
    const isDoctor = appointment.doctor.toString() === req.user.doctorId;
    const isAdmin = req.user.role === 'admin';
    
    if (!isDoctor && !isAdmin) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    const { date, timeSlot, notes, status } = req.body;
    
    if (date) appointment.date = date;
    if (timeSlot) appointment.timeSlot = timeSlot;
    if (notes) appointment.notes = notes;
    if (status) appointment.status = status;
    
    await appointment.save();
    
    // Send notification for status change
    if (status && status !== appointment.status) {
      await Notification.create({
        user: appointment.patient,
        title: 'Appointment Updated',
        message: `Your appointment has been ${status}`,
        type: 'appointment'
      });
    }
    
    res.json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Reschedule appointment
// @route   PUT /api/appointments/:id/reschedule
// @access  Private/Patient
exports.rescheduleAppointment = async (req, res) => {
  try {
    const { newDate, newTimeSlot, reason } = req.body;
    
    const appointment = await Appointment.findById(req.params.id);
    
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    
    if (appointment.patient.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    if (appointment.status === 'completed') {
      return res.status(400).json({ message: 'Cannot reschedule completed appointment' });
    }
    
    const oldDate = appointment.date;
    const oldTimeSlot = appointment.timeSlot;
    
    appointment.date = newDate;
    appointment.timeSlot = newTimeSlot;
    appointment.status = 'rescheduled';
    appointment.notes = reason || `Rescheduled from ${oldDate} ${oldTimeSlot?.startTime}`;
    
    await appointment.save();
    
    // Notify doctor
    await Notification.create({
      user: appointment.doctor,
      title: 'Appointment Rescheduled',
      message: `Patient has rescheduled appointment to ${newDate}`,
      type: 'appointment'
    });
    
    res.json({ message: 'Appointment rescheduled successfully', appointment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get available slots for doctor
// @route   GET /api/appointments/available-slots/:doctorId
// @access  Public
exports.getAvailableSlots = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const { date } = req.query;
    
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    
    const dayName = new Date(date).toLocaleDateString('en-US', { weekday: 'long' });
    const dayAvailability = doctor.availability.find(a => a.day === dayName);
    
    if (!dayAvailability) {
      return res.json({ slots: [], message: 'Doctor not available on this day' });
    }
    
    // Get booked appointments for this date
    const bookedAppointments = await Appointment.find({
      doctor: doctorId,
      date: {
        $gte: new Date(date).setHours(0, 0, 0),
        $lte: new Date(date).setHours(23, 59, 59)
      },
      status: { $nin: ['cancelled'] }
    });
    
    const bookedSlots = bookedAppointments.map(a => a.timeSlot.startTime);
    
    const availableSlots = dayAvailability.slots.filter(
      slot => !bookedSlots.includes(slot.startTime) && slot.isAvailable
    );
    
    res.json({ slots: availableSlots });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get appointment statistics
// @route   GET /api/appointments/statistics
// @access  Private/Admin
exports.getAppointmentStatistics = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const stats = {
      today: await Appointment.countDocuments({
        date: { $gte: today, $lt: tomorrow }
      }),
      weekly: await Appointment.countDocuments({
        date: { $gte: new Date(today.setDate(today.getDate() - 7)) }
      }),
      monthly: await Appointment.countDocuments({
        date: { $gte: new Date(today.getFullYear(), today.getMonth(), 1) }
      }),
      byStatus: await Appointment.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ]),
      byType: await Appointment.aggregate([
        { $group: { _id: '$type', count: { $sum: 1 } } }
      ])
    };
    
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Complete appointment and create prescription
// @route   POST /api/appointments/:id/complete
// @access  Private/Doctor
exports.completeAppointment = async (req, res) => {
  try {
    const { diagnosis, medications, tests, advice, followUpDate } = req.body;
    
    const appointment = await Appointment.findById(req.params.id);
    
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    
    if (appointment.status === 'completed') {
      return res.status(400).json({ message: 'Appointment already completed' });
    }
    
    // Create prescription
    const prescription = await Prescription.create({
      appointment: appointment._id,
      patient: appointment.patient,
      doctor: appointment.doctor,
      medications,
      diagnosis,
      tests,
      advice,
      followUpDate
    });
    
    appointment.prescription = prescription._id;
    appointment.status = 'completed';
    appointment.notes = req.body.notes || appointment.notes;
    await appointment.save();
    
    // Notify patient
    await Notification.create({
      user: appointment.patient,
      title: 'Appointment Completed',
      message: 'Your appointment has been completed. Prescription is available.',
      type: 'prescription',
      actionUrl: `/patient/prescriptions/${prescription._id}`
    });
    
    res.json({ message: 'Appointment completed', prescription });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Cancel appointment by patient or doctor
// @route   DELETE /api/appointments/:id
// @access  Private
exports.deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    
    // Check authorization
    const isPatient = appointment.patient.toString() === req.user.id;
    const isDoctor = appointment.doctor.toString() === req.user.doctorId;
    const isAdmin = req.user.role === 'admin';
    
    if (!isPatient && !isDoctor && !isAdmin) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    appointment.status = 'cancelled';
    await appointment.save();
    
    // Notify the other party
    const notifyUser = isPatient ? appointment.doctor : appointment.patient;
    await Notification.create({
      user: notifyUser,
      title: 'Appointment Cancelled',
      message: `Appointment has been cancelled by ${isPatient ? 'patient' : 'doctor'}`,
      type: 'appointment'
    });
    
    res.json({ message: 'Appointment cancelled successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const Appointment = require('../models/Appointment');
const Prescription = require('../models/Prescription');
const Doctor = require('../models/Doctor');
const User = require('../models/User');
const Notification = require('../models/Notification');

// @desc    Update doctor profile
// @route   PUT /api/doctor/profile
// @access  Private/Doctor
exports.updateProfile = async (req, res) => {
  try {
    const doctor = await Doctor.findOneAndUpdate(
      { userId: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );
    
    if (req.body.name || req.body.phone) {
      await User.findByIdAndUpdate(req.user.id, {
        name: req.body.name,
        phone: req.body.phone
      });
    }
    
    res.json(doctor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get doctor appointments
// @route   GET /api/doctor/appointments
// @access  Private/Doctor
exports.getAppointments = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ userId: req.user.id });
    const { status, page = 1, limit = 10 } = req.query;
    
    const query = { doctor: doctor._id };
    if (status) query.status = status;
    
    const appointments = await Appointment.find(query)
      .populate('patient', 'name email phone')
      .populate('hospital')
      .sort({ date: -1 })
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

// @desc    Accept/reject appointment
// @route   PUT /api/doctor/appointments/:id/status
// @access  Private/Doctor
exports.updateAppointmentStatus = async (req, res) => {
  try {
    const { status, notes } = req.body;
    const doctor = await Doctor.findOne({ userId: req.user.id });
    
    const appointment = await Appointment.findOne({
      _id: req.params.id,
      doctor: doctor._id
    });
    
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    
    appointment.status = status;
    if (notes) appointment.notes = notes;
    await appointment.save();
    
    // Notify patient
    await Notification.create({
      user: appointment.patient,
      title: `Appointment ${status}`,
      message: `Your appointment has been ${status}`,
      type: 'appointment'
    });
    
    res.json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Generate prescription
// @route   POST /api/doctor/prescriptions
// @access  Private/Doctor
exports.generatePrescription = async (req, res) => {
  try {
    const { appointmentId, medications, diagnosis, tests, advice, followUpDate } = req.body;
    const doctor = await Doctor.findOne({ userId: req.user.id });
    
    const appointment = await Appointment.findOne({
      _id: appointmentId,
      doctor: doctor._id
    });
    
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    
    const prescription = await Prescription.create({
      appointment: appointmentId,
      patient: appointment.patient,
      doctor: doctor._id,
      medications,
      diagnosis,
      tests,
      advice,
      followUpDate
    });
    
    appointment.prescription = prescription._id;
    appointment.status = 'completed';
    await appointment.save();
    
    // Notify patient
    await Notification.create({
      user: appointment.patient,
      title: 'Prescription Ready',
      message: 'Your prescription has been generated',
      type: 'prescription',
      actionUrl: `/patient/prescriptions/${prescription._id}`
    });
    
    res.status(201).json(prescription);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get doctor dashboard analytics
// @route   GET /api/doctor/analytics
// @access  Private/Doctor
exports.getAnalytics = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ userId: req.user.id });
    
    const totalAppointments = await Appointment.countDocuments({ doctor: doctor._id });
    const completedAppointments = await Appointment.countDocuments({ 
      doctor: doctor._id, 
      status: 'completed' 
    });
    const pendingAppointments = await Appointment.countDocuments({ 
      doctor: doctor._id, 
      status: 'pending' 
    });
    
    const monthlyAppointments = await Appointment.aggregate([
      { $match: { doctor: doctor._id } },
      { $group: {
        _id: { $month: "$createdAt" },
        count: { $sum: 1 }
      }},
      { $sort: { "_id": 1 } }
    ]);
    
    const recentAppointments = await Appointment.find({ doctor: doctor._id })
      .populate('patient', 'name')
      .sort('-createdAt')
      .limit(5);
    
    res.json({
      totalAppointments,
      completedAppointments,
      pendingAppointments,
      completionRate: (completedAppointments / totalAppointments * 100).toFixed(1),
      monthlyAppointments,
      recentAppointments
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update availability
// @route   PUT /api/doctor/availability
// @access  Private/Doctor
exports.updateAvailability = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ userId: req.user.id });
    doctor.availability = req.body.availability;
    await doctor.save();
    
    res.json({ message: 'Availability updated', availability: doctor.availability });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
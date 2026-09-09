const User = require('../models/User');
const Doctor = require('../models/Doctor');
const Hospital = require('../models/Hospital');
const Appointment = require('../models/Appointment');
const Prediction = require('../models/Prediction');
const Notification = require('../models/Notification');

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
exports.getUsers = async (req, res) => {
  try {
    const { role, isActive, page = 1, limit = 20 } = req.query;
    const query = {};
    
    if (role) query.role = role;
    if (isActive !== undefined) query.isActive = isActive === 'true';
    
    const users = await User.find(query)
      .select('-password')
      .sort('-createdAt')
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await User.countDocuments(query);
    
    res.json({
      users,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user by ID
// @route   GET /api/admin/users/:userId
// @access  Private/Admin
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // If user is doctor, get doctor profile
    let doctorProfile = null;
    if (user.role === 'doctor') {
      doctorProfile = await Doctor.findOne({ userId: user._id })
        .populate('hospital');
    }
    
    res.json({
      user,
      doctorProfile
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user
// @route   PUT /api/admin/users/:userId
// @access  Private/Admin
exports.updateUser = async (req, res) => {
  try {
    const { name, email, phone, role, isActive, isVerified } = req.body;
    
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    if (name) user.name = name;
    if (email) user.email = email;
    if (phone) user.phone = phone;
    if (role) user.role = role;
    if (isActive !== undefined) user.isActive = isActive;
    if (isVerified !== undefined) user.isVerified = isVerified;
    
    await user.save();
    
    res.json({
      message: 'User updated successfully',
      user: user.toObject({ getters: true, versionKey: false, transform: (doc, ret) => {
        delete ret.password;
        return ret;
      }})
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:userId
// @access  Private/Admin
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    if (user.role === 'admin') {
      return res.status(400).json({ message: 'Cannot delete admin users' });
    }
    
    // Delete associated doctor profile if exists
    if (user.role === 'doctor') {
      await Doctor.findOneAndDelete({ userId: user._id });
    }
    
    await user.deleteOne();
    
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get pending doctors for approval
// @route   GET /api/admin/doctors/pending
// @access  Private/Admin
exports.getPendingDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find({ isApproved: false })
      .populate('userId', 'name email phone')
      .populate('hospital');
    
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Approve doctor
// @route   PUT /api/admin/doctors/:doctorId/approve
// @access  Private/Admin
exports.approveDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.doctorId);
    
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    
    doctor.isApproved = true;
    await doctor.save();
    
    // Notify doctor
    await Notification.create({
      user: doctor.userId,
      title: 'Account Approved',
      message: 'Your doctor account has been approved. You can now start accepting appointments.',
      type: 'system'
    });
    
    res.json({ message: 'Doctor approved successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Block/unblock user
// @route   PUT /api/admin/users/:userId/block
// @access  Private/Admin
exports.toggleUserBlock = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    if (user.role === 'admin') {
      return res.status(400).json({ message: 'Cannot block admin users' });
    }
    
    user.isActive = !user.isActive;
    await user.save();
    
    res.json({ 
      message: `User ${user.isActive ? 'unblocked' : 'blocked'} successfully`,
      isActive: user.isActive 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get admin dashboard analytics
// @route   GET /api/admin/analytics
// @access  Private/Admin
exports.getAnalytics = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalPatients = await User.countDocuments({ role: 'patient' });
    const totalDoctors = await User.countDocuments({ role: 'doctor' });
    const pendingDoctors = await Doctor.countDocuments({ isApproved: false });
    
    const totalAppointments = await Appointment.countDocuments();
    const completedAppointments = await Appointment.countDocuments({ status: 'completed' });
    const pendingAppointments = await Appointment.countDocuments({ status: 'pending' });
    
    const totalPredictions = await Prediction.countDocuments();
    
    const recentPredictions = await Prediction.find()
      .populate('user', 'name')
      .sort('-createdAt')
      .limit(10);
    
    const monthlyTrends = await Appointment.aggregate([
      {
        $group: {
          _id: { 
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id.year": -1, "_id.month": -1 } },
      { $limit: 6 }
    ]);
    
    const diseaseStats = await Prediction.aggregate([
      { $unwind: "$predictedDiseases" },
      { $group: {
        _id: "$predictedDiseases.disease",
        count: { $sum: 1 },
        avgConfidence: { $avg: "$predictedDiseases.confidence" }
      }},
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);
    
    res.json({
      users: {
        total: totalUsers,
        patients: totalPatients,
        doctors: totalDoctors,
        pendingDoctors
      },
      appointments: {
        total: totalAppointments,
        completed: completedAppointments,
        pending: pendingAppointments,
        completionRate: totalAppointments ? (completedAppointments / totalAppointments * 100).toFixed(1) : 0
      },
      predictions: {
        total: totalPredictions
      },
      monthlyTrends,
      diseaseStats,
      recentPredictions
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create hospital
// @route   POST /api/admin/hospitals
// @access  Private/Admin
exports.createHospital = async (req, res) => {
  try {
    const hospital = await Hospital.create(req.body);
    res.status(201).json(hospital);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all hospitals
// @route   GET /api/admin/hospitals
// @access  Private/Admin
exports.getHospitals = async (req, res) => {
  try {
    const hospitals = await Hospital.find();
    res.json(hospitals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
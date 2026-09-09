const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Doctor = require('../models/Doctor');
const crypto = require('crypto');
const { sendEmail } = require('../config/email');
const { normalizeEmail } = require('../utils/email');

const generateToken = (id, role, name) => {
  return jwt.sign({ id, role, name }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const { name, email, password, role, phone, dateOfBirth, gender } = req.body;
    const emailNorm = normalizeEmail(email);

    const userExists = await User.findOne({ email: emailNorm });
    if (userExists) {
      console.log('Registration failed: User already exists for email', emailNorm);
      return res.status(400).json({ message: 'User already exists' });
    }

    const rawRole = String(role || 'patient').toLowerCase();
    const userRole = ['patient', 'doctor', 'admin'].includes(rawRole) ? rawRole : 'patient';

    const user = await User.create({
      name,
      email: emailNorm,
      password,
      role: userRole,
      phone,
      dateOfBirth,
      gender
    });

    if (userRole === 'doctor') {
      await Doctor.create({
        userId: user._id,
        specialization: req.body.specialization || 'General',
        consultationFee: req.body.consultationFee || 500
      });
    }

    const token = generateToken(user._id, user.role, user.name);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { password } = req.body;
    const emailNorm = normalizeEmail(req.body.email);

    const user = await User.findOne({ email: emailNorm });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (!user.isActive) {
      return res.status(401).json({ message: 'Account is blocked. Contact admin.' });
    }

    const isPasswordMatch = await user.comparePassword(password);
    if (!isPasswordMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    user.lastLogin = Date.now();
    await user.save();

    const token = generateToken(user._id, user.role, user.name);

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
exports.forgotPassword = async (req, res) => {
  try {
    const emailNorm = normalizeEmail(req.body.email);
    const user = await User.findOne({ email: emailNorm });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save();

    // LOG TOKEN TO CONSOLE (VS CODE TERMINAL)
    console.log('\n' + '='.repeat(80));
    console.log('🔑 PASSWORD RESET TOKEN - COPY THIS');
    console.log('='.repeat(80));
    console.log(`📧 Email: ${emailNorm}`);
    console.log(`🔐 Reset Token: ${resetToken}`);
    console.log(`⏰ Expires: 10 minutes from now`);
    console.log('='.repeat(80));
    console.log(`\n📝 Use this token in Postman:`);
    console.log(`PUT http://localhost:5000/api/auth/reset-password/${resetToken}`);
    console.log(`Content-Type: application/json`);
    console.log(`Body: { "password": "YourNewPassword123" }\n`);
    console.log('='.repeat(80) + '\n');

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    
    try {
      await sendEmail({
        to: user.email,
        subject: 'Password Reset Request',
        html: `<h2>Reset Your Password</h2>
               <p>Click <a href="${resetUrl}">here</a> to reset your password.</p>
               <p>Or use this token: <strong>${resetToken}</strong></p>
               <p>This link/token expires in 10 minutes.</p>`
      });
      console.log(`✅ Email sent successfully to ${user.email}\n`);
    } catch (emailError) {
      console.log(`❌ Email error: ${emailError.message}`);
      console.log(`⚠️  But you can still use the token from console!\n`);
    }

    res.json({ 
      message: 'Password reset email sent. Check console for token if email fails.',
      resetToken: process.env.NODE_ENV === 'development' ? resetToken : undefined // Only show in development
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Reset password
// @route   POST /api/auth/reset-password/:token
// @access  Public
exports.resetPassword = async (req, res) => {
  try {
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
    
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    console.log(`✅ Password reset successful for ${user.email}`);
    
    res.json({ message: 'Password reset successful' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    let doctorProfile = null;
    
    if (user.role === 'doctor') {
      doctorProfile = await Doctor.findOne({ userId: user._id }).populate('hospital');
    }
    
    res.json({ user, doctorProfile });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

// Import the fixed User model
const User = require('./src/models/User');

const createAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/medical_diagnosis');
    console.log('✅ Connected to MongoDB');

    // Check if admin exists
    const existingAdmin = await User.findOne({ email: 'admin@medisense.com' });
    
    if (existingAdmin) {
      console.log('⚠️ Admin already exists!');
      console.log('Email: admin@medisense.com');
      await mongoose.connection.close();
      process.exit(0);
    }

    // Create new admin
    const admin = new User({
      name: 'Super Admin',
      email: 'admin@medisense.com',
      password: 'Admin@123456',
      role: 'admin',
      phone: '9876543210',
      isActive: true,
      isVerified: true
    });

    await admin.save();
    
    console.log('✅ Admin created successfully!');
    console.log('📧 Email: admin@medisense.com');
    console.log('🔑 Password: Admin@123456');
    
    await mongoose.connection.close();
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    await mongoose.connection.close();
    process.exit(1);
  }
};

createAdmin();
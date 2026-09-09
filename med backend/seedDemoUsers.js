const User = require('./src/models/User');
const Doctor = require('./src/models/Doctor');
const { normalizeEmail } = require('./src/utils/email');

const DEMOS = [
  {
    name: 'Demo Patient',
    email: 'patient@example.com',
    password: 'password123',
    role: 'patient',
    phone: '9876543210',
    isActive: true,
    isVerified: true,
  },
  {
    name: 'Demo Doctor',
    email: 'doctor@example.com',
    password: 'password123',
    role: 'doctor',
    phone: '9876543211',
    isActive: true,
    isVerified: true,
  },
  {
    name: 'Demo Admin',
    email: 'admin@example.com',
    password: 'password123',
    role: 'admin',
    phone: '9876543212',
    isActive: true,
    isVerified: true,
  },
];

async function ensureDemoUsers() {
  for (const row of DEMOS) {
    const email = normalizeEmail(row.email);
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({ ...row, email });
      console.log(`📌 Seeded demo account: ${email}`);
    }
    if (row.role === 'doctor') {
      const existing = await Doctor.findOne({ userId: user._id });
      if (!existing) {
        await Doctor.create({
          userId: user._id,
          specialization: 'General Medicine',
          consultationFee: 500,
          isApproved: true,
        });
        console.log(`📌 Seeded doctor profile for ${email}`);
      }
    }
  }
}

module.exports = { ensureDemoUsers, DEMOS };

if (require.main === module) {
  require('dotenv').config();
  const mongoose = require('mongoose');
  (async () => {
    try {
      await mongoose.connect(process.env.MONGODB_URI);
      await ensureDemoUsers();
      console.log('✅ Demo users ready.');
    } finally {
      await mongoose.disconnect();
    }
  })().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}

const mongoose = require('mongoose');

const hospitalSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  registrationNumber: {
    type: String,
    required: true,
    unique: true
  },
  googlePlaceId: {
    type: String
  },
  website: {
    type: String
  },
  type: {
    type: String,
    enum: ['Private', 'Government', 'Teaching', 'Multi-speciality'],
    default: 'Multi-speciality'
  },
  address: {
    street: String,
    city: String,
    state: String,
    pincode: String,
    country: String,
    latitude: Number,
    longitude: Number
  },
  contact: {
    phone: String,
    email: String,
    emergency: String
  },
  facilities: [String],
  departments: [String],
  specialists: [String], // Array of specialist roles present e.g. ['Cardiologist', 'Endocrinologist']
  rating: {
    type: Number,
    default: 4.5
  },
  userRatingsTotal: {
    type: Number,
    default: 120
  },
  isEmergencyAvailable: {
    type: Boolean,
    default: true
  },
  is24Hours: {
    type: Boolean,
    default: true
  },
  telemedicineAvailable: {
    type: Boolean,
    default: false
  },
  insuranceAccepted: [String],
  workingHours: {
    type: String,
    default: '24 Hours Open'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  images: [String]
}, {
  timestamps: true
});

module.exports = mongoose.model('Hospital', hospitalSchema);
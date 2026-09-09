const mongoose = require('mongoose');

const medicalHistorySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['prediction', 'consultation', 'prescription', 'lab_report', 'vaccination', 'other'],
    default: 'other'
  },
  date: {
    type: Date,
    default: Date.now
  },
  summary: String,
  details: {
    disease: String,
    specialist: String,
    doctorName: String,
    hospitalName: String,
    symptoms: [String],
    medicines: [String],
    riskLevel: String,
    reportFile: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('MedicalHistory', medicalHistorySchema);

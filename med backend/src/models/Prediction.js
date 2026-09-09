const mongoose = require('mongoose');

const predictionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  symptoms: [{
    symptom: String,
    severity: {
      type: Number,
      min: 1,
      max: 10
    },
    duration: String
  }],
  predictedDiseases: [{
    disease: String,
    confidence: {
      type: Number,
      min: 0,
      max: 100
    },
    severity: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Critical']
    },
    description: String,
    precautions: [String],
    medications: [String]
  }],
  topPrediction: {
    disease: String,
    confidence: Number
  },
  recommendedDoctors: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor'
  }],
  riskLevel: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Critical']
  },
  consultationNeeded: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Prediction', predictionSchema);
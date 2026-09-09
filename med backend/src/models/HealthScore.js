const mongoose = require('mongoose');

const healthScoreSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  score: {
    type: Number,
    min: 0,
    max: 100,
    required: true
  },
  riskLevel: {
    type: String,
    enum: ['Low', 'Moderate', 'High', 'Critical'],
    default: 'Low'
  },
  metrics: {
    bmi: Number,
    waterIntakeLiters: Number,
    sleepHours: Number,
    weeklyExerciseMinutes: Number,
    systolicBP: Number,
    diastolicBP: Number
  },
  recommendations: [String],
  dietSuggestions: [String],
  exerciseSuggestions: [String]
}, {
  timestamps: true
});

module.exports = mongoose.model('HealthScore', healthScoreSchema);

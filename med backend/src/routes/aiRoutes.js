const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  predictDisease,
  getSymptoms,
  getPredictionHistory,
  chatbot,
  getDiseaseInfo
} = require('../controllers/aiController');

router.post('/predict', protect, predictDisease);
router.get('/symptoms', getSymptoms);
router.get('/history', protect, getPredictionHistory);
router.post('/chat', protect, chatbot);
router.get('/disease/:name', getDiseaseInfo);

module.exports = router;
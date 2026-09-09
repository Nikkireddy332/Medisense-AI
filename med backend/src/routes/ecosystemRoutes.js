const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  getFavorites,
  addFavorite,
  removeFavorite,
  getMedicalTimeline,
  addMedicalHistoryItem,
  getHealthScore,
  updateHealthMetrics,
  getEcosystemAnalytics
} = require('../controllers/ecosystemController');

// Favorites
router.get('/favorites', protect, getFavorites);
router.post('/favorites', protect, addFavorite);
router.delete('/favorites/:itemType/:itemId', protect, removeFavorite);

// Medical Timeline
router.get('/history', protect, getMedicalTimeline);
router.post('/history', protect, addMedicalHistoryItem);

// AI Health Score
router.get('/health-score', protect, getHealthScore);
router.post('/health-score', protect, updateHealthMetrics);

// Admin Analytics
router.get('/analytics', protect, authorize('admin'), getEcosystemAnalytics);

module.exports = router;

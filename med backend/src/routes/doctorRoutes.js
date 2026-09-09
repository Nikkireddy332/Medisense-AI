const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  updateProfile,
  getAppointments,
  updateAppointmentStatus,
  generatePrescription,
  getAnalytics,
  updateAvailability
} = require('../controllers/doctorController');

router.use(protect);
router.use(authorize('doctor'));

router.put('/profile', updateProfile);
router.get('/appointments', getAppointments);
router.put('/appointments/:id/status', updateAppointmentStatus);
router.post('/prescriptions', generatePrescription);
router.get('/analytics', getAnalytics);
router.put('/availability', updateAvailability);

module.exports = router;
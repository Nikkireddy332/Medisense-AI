const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  getUsers,
  getUserById,
  getPendingDoctors,
  approveDoctor,
  toggleUserBlock,
  getAnalytics,
  createHospital,
  getHospitals,
  updateUser,
  deleteUser
} = require('../controllers/adminController');

router.use(protect);
router.use(authorize('admin'));

// User management
router.get('/users', getUsers);
router.get('/users/:userId', getUserById);
router.put('/users/:userId', updateUser);
router.put('/users/:userId/block', toggleUserBlock);
router.delete('/users/:userId', deleteUser);

// Doctor management
router.get('/doctors/pending', getPendingDoctors);
router.put('/doctors/:doctorId/approve', approveDoctor);

// Hospital management
router.post('/hospitals', createHospital);
router.get('/hospitals', getHospitals);

// Analytics
router.get('/analytics', getAnalytics);

module.exports = router;
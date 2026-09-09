const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const patientController = require('../controllers/patientController');

// Check if controller exists and has required methods
if (!patientController) {
  console.error('Patient controller not found!');
  throw new Error('Patient controller not found');
}

console.log('Available patient controller methods:', Object.keys(patientController));

// Destructure with fallbacks to prevent undefined
const bookAppointment = patientController.bookAppointment || (() => { throw new Error('bookAppointment not implemented'); });
const getAppointments = patientController.getAppointments || (() => { throw new Error('getAppointments not implemented'); });
const uploadReport = patientController.uploadReport || (() => { throw new Error('uploadReport not implemented'); });
const getMedicalHistory = patientController.getMedicalHistory || (() => { throw new Error('getMedicalHistory not implemented'); });
const downloadPrescription = patientController.downloadPrescription || (() => { throw new Error('downloadPrescription not implemented'); });
const cancelAppointment = patientController.cancelAppointment || (() => { throw new Error('cancelAppointment not implemented'); });
const getDashboard = patientController.getDashboard || (() => { throw new Error('getDashboard not implemented'); });
const savePrediction = patientController.savePrediction || (() => { throw new Error('savePrediction not implemented'); });

// Apply middleware to all routes
router.use(protect);
router.use(authorize('patient'));

// Define routes - using the functions we destructured
router.post('/appointments', bookAppointment);
router.get('/appointments', getAppointments);
router.put('/appointments/:id/cancel', cancelAppointment);
router.post('/reports', uploadReport);
router.get('/medical-history', getMedicalHistory);
router.get('/prescriptions/:id/download', downloadPrescription);
router.get('/dashboard', getDashboard);
router.post('/predict', savePrediction);
module.exports = router;
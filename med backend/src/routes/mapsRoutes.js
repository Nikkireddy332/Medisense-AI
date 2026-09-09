const express = require('express');
const router = express.Router();
const {
  getNearbyHospitals,
  getHospitalPhoto,
  getNearbyLabs,
  getNearbyPharmacies,
  getEmergencyServices
} = require('../controllers/mapsController');

router.get('/hospitals', getNearbyHospitals);
router.get('/photo', getHospitalPhoto);
router.get('/labs', getNearbyLabs);
router.get('/pharmacies', getNearbyPharmacies);
router.get('/emergency', getEmergencyServices);

module.exports = router;

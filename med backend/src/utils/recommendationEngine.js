const Doctor = require('../models/Doctor');
const User = require('../models/User');
const Hospital = require('../models/Hospital');

const recommendDoctors = async (disease, userLocation) => {
  try {
    // Find doctors who treat this disease
    const doctors = await Doctor.find({
      isApproved: true,
      diseasesTreated: { $regex: disease, $options: 'i' }
    }).populate('userId').populate('hospital');
    
    if (doctors.length === 0) {
      // Fallback: return top-rated doctors
      return await Doctor.find({ isApproved: true })
        .sort({ rating: -1 })
        .limit(5)
        .populate('userId')
        .populate('hospital');
    }
    
    // Score and sort doctors
    const scoredDoctors = doctors.map(doctor => {
      let score = 0;
      
      // Rating score (max 50 points)
      score += (doctor.rating / 5) * 50;
      
      // Experience score (max 30 points)
      score += Math.min(doctor.experience / 20, 1) * 30;
      
      // Location proximity if available
      if (userLocation && doctor.hospital?.address) {
        // Simplified proximity scoring
        score += 20;
      }
      
      return { doctor, score };
    });
    
    scoredDoctors.sort((a, b) => b.score - a.score);
    
    return scoredDoctors.slice(0, 5).map(item => item.doctor);
  } catch (error) {
    console.error('Recommendation error:', error);
    return [];
  }
};

module.exports = { recommendDoctors };
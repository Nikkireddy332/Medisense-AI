const Prediction = require('../models/Prediction');
const Doctor = require('../models/Doctor');
const { diseaseDataset, predictDisease, calculateSeverity } = require('../utils/diseaseDataset');
const { recommendDoctors } = require('../utils/recommendationEngine');
const { resolveSpecialist } = require('../utils/diseaseSpecialistMap');

// Symptom list for reference
const symptomList = [
  'fever', 'cough', 'fatigue', 'headache', 'sore_throat', 'runny_nose',
  'chest_pain', 'shortness_of_breath', 'nausea', 'vomiting', 'diarrhea',
  'abdominal_pain', 'joint_pain', 'muscle_aches', 'skin_rash', 'dizziness',
  'loss_of_appetite', 'weight_loss', 'night_sweats', 'palpitations'
];

// @desc    Predict disease from symptoms
// @route   POST /api/ai/predict
// @access  Private
exports.predictDisease = async (req, res) => {
  try {
    const { symptoms, userLocation } = req.body;
    
    if (!symptoms || symptoms.length === 0) {
      return res.status(400).json({ message: 'Please provide symptoms' });
    }

    // Get predictions from AI model
    const predictions = predictDisease(symptoms);
    
    // Calculate risk level
    const riskLevel = calculateSeverity(predictions[0].confidence, predictions[0].disease);
    
    // Smart AI Specialist resolution
    const topDisease = predictions[0].disease;
    const specialistInfo = resolveSpecialist(topDisease, symptoms);

    // Get recommended doctors based on top disease and location
    const recommendedDoctors = await recommendDoctors(topDisease, userLocation);
    
    // Save prediction to database
    const prediction = await Prediction.create({
      user: req.user.id,
      symptoms: symptoms.map(s => ({ 
        symptom: typeof s === 'string' ? s : (s.name || s.symptom), 
        severity: s.severity || 5,
        duration: s.duration || 'unknown'
      })),
      predictedDiseases: predictions,
      topPrediction: {
        disease: topDisease,
        confidence: predictions[0].confidence
      },
      recommendedDoctors: recommendedDoctors.map(d => d._id),
      riskLevel,
      consultationNeeded: riskLevel === 'High' || riskLevel === 'Critical'
    });
    
    res.json({
      success: true,
      prediction: {
        id: prediction._id,
        topDisease: predictions[0],
        allPredictions: predictions,
        riskLevel,
        consultationNeeded: riskLevel === 'High' || riskLevel === 'Critical',
        recommendedDoctors,
        precautions: predictions[0].precautions,
        description: predictions[0].description,

        // Smart AI Ecosystem Specialist Mapping
        mappedSpecialist: specialistInfo.specialist,
        specialistRationale: specialistInfo.rationale,
        urgency: specialistInfo.urgency
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get available symptoms
// @route   GET /api/ai/symptoms
// @access  Public
exports.getSymptoms = async (req, res) => {
  res.json({ symptoms: symptomList });
};

// @desc    Get prediction history
// @route   GET /api/ai/history
// @access  Private
exports.getPredictionHistory = async (req, res) => {
  try {
    const predictions = await Prediction.find({ user: req.user.id })
      .sort('-createdAt')
      .populate('recommendedDoctors', 'userId specialization');
    
    res.json(predictions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    AI Chatbot assistant
// @route   POST /api/ai/chat
// @access  Private
exports.chatbot = async (req, res) => {
  try {
    const { message } = req.body;
    
    let response = "";
    const lowerMsg = message.toLowerCase();
    
    if (lowerMsg.includes('fever') || lowerMsg.includes('temperature')) {
      response = "Fever can be caused by various conditions. If it's above 102°F or persists for more than 3 days, please consult a General Physician. Stay hydrated and rest.";
    } else if (lowerMsg.includes('heart') || lowerMsg.includes('chest pain')) {
      response = "Chest discomfort or heart symptoms require immediate medical evaluation by a Cardiologist. If pain radiates to your arm or jaw, call emergency 911 / 108 immediately.";
    } else if (lowerMsg.includes('diabetes') || lowerMsg.includes('sugar')) {
      response = "For diabetes or blood sugar management, our AI recommends consulting an Endocrinologist. Check your HbA1c levels and maintain a low-glycemic index diet.";
    } else if (lowerMsg.includes('headache') || lowerMsg.includes('migraine')) {
      response = "Persistent headaches or migraines should be evaluated by a Neurologist. Ensure proper hydration, sleep, and avoid prolonged screen time.";
    } else if (lowerMsg.includes('cough') || lowerMsg.includes('breath')) {
      response = "Respiratory symptoms like cough or shortness of breath suggest consulting a Pulmonologist. Stay hydrated and avoid pollutants.";
    } else if (lowerMsg.includes('emergency') || lowerMsg.includes('ambulance')) {
      response = "For emergency assistance, click the red 'Emergency Mode' button on your dashboard to instantly find the nearest ER/Trauma centers and call 24/7 ambulances.";
    } else if (lowerMsg.includes('lab') || lowerMsg.includes('test')) {
      response = "You can search for nearby accredited Diagnostic Laboratories (MRI, CT, Blood tests) under the 'Nearby Labs' section in the MediSense menu.";
    } else if (lowerMsg.includes('pharmacy') || lowerMsg.includes('medicine')) {
      response = "To find 24/7 open pharmacies with medicine availability and home delivery near your location, check the 'Nearby Pharmacies' page.";
    } else if (lowerMsg.includes('yoga') || lowerMsg.includes('exercise')) {
      response = "Regular physical activity improves cardiovascular health and boosts immune response! Aim for 150 minutes of moderate exercise or morning yoga weekly.";
    } else if (lowerMsg.includes('diet') || lowerMsg.includes('nutrition')) {
      response = "Focus on nutrient-dense foods: colorful vegetables, fruits, lean protein, whole grains, and healthy fats. Stay well-hydrated with at least 2.5 liters of water daily.";
    } else if (lowerMsg.includes('hello') || lowerMsg.includes('hi ') || lowerMsg.includes('hey')) {
      response = "Hello! I am your MediSense AI Healthcare Assistant. How can I help you find specialists, check symptoms, or locate nearby medical centers today?";
    } else {
      response = "I understand you have a health query. I can assist with disease symptom checking, specialist mapping (e.g. Cardiologists, Endocrinologists), finding nearby hospitals, diagnostic labs, pharmacies, or calculating your AI Health Score.";
    }
    
    res.json({
      response,
      suggestions: ["Check symptoms", "Find Cardiologists near me", "Emergency care", "Nearby 24/7 Pharmacies", "AI Health Score"]
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get disease information
// @route   GET /api/ai/disease/:name
// @access  Public
exports.getDiseaseInfo = async (req, res) => {
  try {
    const diseaseName = req.params.name.toLowerCase();
    const disease = diseaseDataset.find(d => d.name.toLowerCase() === diseaseName);
    
    if (!disease) {
      return res.status(404).json({ message: 'Disease not found' });
    }
    
    res.json(disease);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
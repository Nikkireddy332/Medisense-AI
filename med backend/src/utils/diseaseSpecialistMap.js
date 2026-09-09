/**
 * Smart AI Disease to Specialist Mapping Dictionary
 * Maps medical conditions, diseases, and symptom groups to required specialists.
 */

const diseaseSpecialistMap = {
  // Cardiovascular
  'Heart Disease': 'Cardiologist',
  'Hypertension': 'Cardiologist',
  'Coronary Artery Disease': 'Cardiologist',
  'Heart Attack Risk': 'Cardiologist',
  'Arrhythmia': 'Cardiologist',
  'Cardiovascular Disease': 'Cardiologist',
  
  // Endocrine & Metabolic
  'Diabetes': 'Endocrinologist',
  'Diabetes Mellitus Type 1': 'Endocrinologist',
  'Diabetes Mellitus Type 2': 'Endocrinologist',
  'Thyroid Disorder': 'Endocrinologist',
  'Hypothyroidism': 'Endocrinologist',
  'Hyperthyroidism': 'Endocrinologist',
  'Obesity / Metabolic Syndrome': 'Endocrinologist',

  // Neurology
  'Brain Disorder': 'Neurologist',
  'Migraine': 'Neurologist',
  'Epilepsy': 'Neurologist',
  'Stroke Risk': 'Neurologist',
  'Parkinson\'s Disease': 'Neurologist',
  'Alzheimer\'s Disease': 'Neurologist',
  'Nerve Pain / Neuropathy': 'Neurologist',

  // Nephrology
  'Kidney Disease': 'Nephrologist',
  'Chronic Kidney Failure': 'Nephrologist',
  'Kidney Stones': 'Nephrologist / Urologist',
  'Renal Failure': 'Nephrologist',

  // Ophthalmology
  'Eye Disease': 'Ophthalmologist',
  'Cataract': 'Ophthalmologist',
  'Glaucoma': 'Ophthalmologist',
  'Vision Loss': 'Ophthalmologist',

  // Dermatology
  'Skin Disease': 'Dermatologist',
  'Eczema': 'Dermatologist',
  'Psoriasis': 'Dermatologist',
  'Acne Vulgaris': 'Dermatologist',
  'Fungal Skin Infection': 'Dermatologist',

  // Oncology
  'Cancer': 'Oncologist',
  'Tumor': 'Oncologist',
  'Leukemia': 'Oncologist',

  // Psychiatry & Mental Health
  'Mental Health': 'Psychiatrist',
  'Depression': 'Psychiatrist',
  'Anxiety Disorder': 'Psychiatrist',
  'Insomnia / Sleep Disorder': 'Psychiatrist',

  // ENT
  'ENT Problems': 'ENT Specialist',
  'Sinusitis': 'ENT Specialist',
  'Otitis Media (Ear Infection)': 'ENT Specialist',
  'Tonsillitis': 'ENT Specialist',

  // Orthopedics
  'Bone Injury': 'Orthopedic',
  'Arthritis': 'Orthopedic',
  'Osteoporosis': 'Orthopedic',
  'Joint Pain / Fracture': 'Orthopedic',

  // Gynecology
  'Women\'s Health': 'Gynecologist',
  'PCOS / PCOD': 'Gynecologist',
  'Pregnancy Care': 'Gynecologist',
  'Menstrual Disorder': 'Gynecologist',

  // Pediatrics
  'Child Disease': 'Pediatrician',
  'Pediatric Infections': 'Pediatrician',

  // Pulmonology / Respiratory
  'Lung Disease': 'Pulmonologist',
  'Asthma': 'Pulmonologist',
  'COPD': 'Pulmonologist',
  'Pneumonia': 'Pulmonologist',
  'Bronchitis': 'Pulmonologist',
  'Tuberculosis': 'Pulmonologist',

  // Hepatology & Gastroenterology
  'Liver Disease': 'Hepatologist',
  'Hepatitis B / C': 'Hepatologist',
  'Fatty Liver': 'Hepatologist',
  'Digestive Disorders': 'Gastroenterologist',
  'GERD / Acid Reflux': 'Gastroenterologist',
  'Peptic Ulcer': 'Gastroenterologist',
  'Irritable Bowel Syndrome (IBS)': 'Gastroenterologist',

  // General & Infectious
  'General Fever': 'General Physician',
  'Common Cold / Flu': 'General Physician',
  'Malaria': 'General Physician',
  'Dengue Fever': 'General Physician',
  'Typhoid': 'General Physician',
  'COVID-19': 'General Physician / Pulmonologist'
};

const symptomToSpecialistMap = {
  chest_pain: 'Cardiologist',
  palpitations: 'Cardiologist',
  shortness_of_breath: 'Pulmonologist',
  joint_pain: 'Orthopedic',
  dizziness: 'Neurologist',
  skin_rash: 'Dermatologist',
  blurred_vision: 'Ophthalmologist',
  ear_pain: 'ENT Specialist',
  stomach_pain: 'Gastroenterologist',
  fever: 'General Physician',
  cough: 'Pulmonologist',
  headache: 'Neurologist'
};

/**
 * Resolves specialist requirement based on predicted disease name or primary symptoms
 * @param {string} diseaseName 
 * @param {Array<string>} symptoms 
 * @returns {object} { specialist: string, rationale: string, urgency: string }
 */
function resolveSpecialist(diseaseName, symptoms = []) {
  if (!diseaseName) {
    return {
      specialist: 'General Physician',
      rationale: 'Comprehensive primary care evaluation recommended for general health symptoms.',
      urgency: 'Moderate'
    };
  }

  // Exact or partial disease lookup
  const exactMatch = diseaseSpecialistMap[diseaseName];
  if (exactMatch) {
    return {
      specialist: exactMatch,
      rationale: `Based on detected condition "${diseaseName}", consultation with a specialized ${exactMatch} is strongly recommended.`,
      urgency: getUrgencyForSpecialist(exactMatch, diseaseName)
    };
  }

  // Partial match
  const matchedKey = Object.keys(diseaseSpecialistMap).find(key => 
    diseaseName.toLowerCase().includes(key.toLowerCase()) || key.toLowerCase().includes(diseaseName.toLowerCase())
  );

  if (matchedKey) {
    const spec = diseaseSpecialistMap[matchedKey];
    return {
      specialist: spec,
      rationale: `Symptom profile indicates symptoms related to ${matchedKey}. Consulting a ${spec} is recommended.`,
      urgency: getUrgencyForSpecialist(spec, diseaseName)
    };
  }

  // Fallback to primary symptom map
  for (const sym of symptoms) {
    const symName = typeof sym === 'string' ? sym : (sym.symptom || sym.name);
    if (symName && symptomToSpecialistMap[symName.toLowerCase()]) {
      const spec = symptomToSpecialistMap[symName.toLowerCase()];
      return {
        specialist: spec,
        rationale: `Primary symptom (${symName}) suggests consultation with a ${spec}.`,
        urgency: getUrgencyForSpecialist(spec, diseaseName)
      };
    }
  }

  return {
    specialist: 'General Physician',
    rationale: 'Primary healthcare assessment by a General Physician is recommended for diagnostic confirmation.',
    urgency: 'Moderate'
  };
}

function getUrgencyForSpecialist(specialist, diseaseName) {
  const highRisk = ['Cardiologist', 'Neurologist', 'Oncologist', 'Pulmonologist'];
  if (highRisk.includes(specialist) || (diseaseName && (diseaseName.includes('Heart') || diseaseName.includes('Stroke') || diseaseName.includes('Failure')))) {
    return 'High';
  }
  return 'Moderate';
}

module.exports = {
  diseaseSpecialistMap,
  symptomToSpecialistMap,
  resolveSpecialist
};

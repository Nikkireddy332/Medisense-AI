// Disease dataset for prediction
const diseaseDataset = [
  {
    name: "Common Cold",
    symptoms: ["runny_nose", "sore_throat", "cough", "fatigue", "headache"],
    precautions: ["Rest", "Stay hydrated", "Warm salt water gargle", "Use humidifier"],
    medications: ["Antihistamines", "Decongestants", "Pain relievers"],
    description: "Viral infection of upper respiratory tract usually resolving in 7-10 days.",
    severity: "Low"
  },
  {
    name: "Influenza",
    symptoms: ["fever", "cough", "fatigue", "muscle_aches", "headache", "sore_throat"],
    precautions: ["Get flu shot", "Stay home", "Rest", "Hydration"],
    medications: ["Antiviral drugs", "Fever reducers", "Cough medicine"],
    description: "Highly contagious viral infection affecting respiratory system.",
    severity: "Medium"
  },
  {
    name: "COVID-19",
    symptoms: ["fever", "cough", "fatigue", "shortness_of_breath", "loss_of_appetite", "sore_throat"],
    precautions: ["Isolate", "Wear mask", "Monitor oxygen levels", "Seek medical care if severe"],
    medications: ["Antivirals", "Corticosteroids", "Oxygen therapy"],
    description: "Respiratory illness caused by SARS-CoV-2 virus.",
    severity: "High"
  },
  {
    name: "Gastroenteritis",
    symptoms: ["nausea", "vomiting", "diarrhea", "abdominal_pain", "fever"],
    precautions: ["Oral rehydration", "BRAT diet", "Rest", "Hand washing"],
    medications: ["Anti-diarrheal", "Antiemetics", "Probiotics"],
    description: "Inflammation of stomach and intestines often called stomach flu.",
    severity: "Medium"
  },
  {
    name: "Migraine",
    symptoms: ["headache", "nausea", "dizziness", "fatigue"],
    precautions: ["Dark quiet room", "Cold compress", "Avoid triggers", "Regular sleep"],
    medications: ["Triptans", "NSAIDs", "Anti-nausea drugs"],
    description: "Neurological condition causing severe throbbing headaches.",
    severity: "Medium"
  }
];

// Prediction function
const predictDisease = (symptoms) => {
  const predictions = [];
  
  for (const disease of diseaseDataset) {
    let matchCount = 0;
    let severityScore = 0;
    
    for (const symptom of symptoms) {
      const symptomName = typeof symptom === 'string' ? symptom : symptom.name;
      if (disease.symptoms.includes(symptomName.toLowerCase())) {
        matchCount++;
        if (typeof symptom === 'object' && symptom.severity) {
          severityScore += symptom.severity;
        }
      }
    }
    
    const confidence = (matchCount / disease.symptoms.length) * 100;
    
    if (confidence > 0) {
      predictions.push({
        disease: disease.name,
        confidence: Math.round(confidence),
        description: disease.description,
        precautions: disease.precautions,
        medications: disease.medications,
        severity: disease.severity
      });
    }
  }
  
  // Sort by confidence descending
  predictions.sort((a, b) => b.confidence - a.confidence);
  
  // Return top 3 predictions
  return predictions.slice(0, 5);
};

const calculateSeverity = (confidence, diseaseName) => {
  const disease = diseaseDataset.find(d => d.name === diseaseName);
  if (!disease) return "Low";
  
  if (confidence > 70) {
    return disease.severity === "High" ? "High" : "Medium";
  } else if (confidence > 40) {
    return "Low";
  } else {
    return "Low";
  }
};

module.exports = {
  diseaseDataset,
  predictDisease,
  calculateSeverity
};
const diseaseMap = [
  { disease: 'Common Cold', keywords: ['cough', 'sore throat', 'runny nose', 'sneeze'], risk: 'Low' },
  { disease: 'Migraine', keywords: ['headache', 'nausea', 'light sensitivity', 'migraine'], risk: 'Medium' },
  { disease: 'Flu', keywords: ['fever', 'chills', 'fatigue', 'body ache'], risk: 'Medium' },
  { disease: 'Bronchitis', keywords: ['cough', 'phlegm', 'shortness of breath', 'chest pain'], risk: 'Medium' },
  { disease: 'Hypertension', keywords: ['high blood pressure', 'dizziness', 'blurred vision', 'headache'], risk: 'High' },
  { disease: 'Diabetes', keywords: ['thirst', 'urination', 'fatigue', 'blurred vision'], risk: 'High' },
  { disease: 'Asthma', keywords: ['wheezing', 'shortness of breath', 'chest tightness', 'cough'] , risk: 'Medium' }
];

export function predictDisease(rawSymptoms) {
  const symptoms = rawSymptoms.toLowerCase();
  if (!symptoms.trim()) {
    return { disease: 'Unknown', confidence: 0.05, risk: 'Unknown', summary: 'Please provide symptoms to analyze.' };
  }

  const scores = diseaseMap.map((item) => {
    const matched = item.keywords.reduce((count, keyword) => (symptoms.includes(keyword) ? count + 1 : count), 0);
    return { ...item, score: matched };
  });

  const best = scores.sort((a, b) => b.score - a.score)[0];
  const confidence = Math.min(0.95, 0.25 + best.score * 0.2);

  return {
    disease: best.disease,
    confidence,
    risk: best.risk,
    summary: `AI prediction suggests ${best.disease} with ${Math.round(confidence * 100)}% confidence based on the reported symptoms.`
  };
}

export function recommendDoctors(disease, location, doctors) {
  const selectedKeywords = disease.toLowerCase().split(' ');
  return doctors
    .map((doctor) => {
      const score = selectedKeywords.reduce((count, term) => (doctor.specialty.toLowerCase().includes(term) ? count + 1 : count), 0) + (doctor.location === location ? 1 : 0);
      return { ...doctor, score };
    })
    .filter((doctor) => doctor.score > 0)
    .sort((a, b) => b.score - a.score);
}

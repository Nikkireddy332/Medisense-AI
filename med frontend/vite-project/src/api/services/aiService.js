import api from '../axios';

export const aiService = {
  // Predict disease from symptoms
  predictDisease: (symptoms, age, gender) =>
    api.post('/ai/predict', { symptoms, age, gender }),

  // Get recommended doctors for condition
  getRecommendedDoctors: (condition, location) =>
    api.post('/ai/recommend-doctors', { condition, location }),

  // Analyze health data
  analyzeHealthData: (data) =>
    api.post('/ai/analyze', data),

  // Get health insights
  getHealthInsights: (userId) =>
    api.get(`/ai/insights/${userId}`),

  // Chat with AI health assistant
  chatWithAI: (message) =>
    api.post('/ai/chat', { message })
};

export default aiService;

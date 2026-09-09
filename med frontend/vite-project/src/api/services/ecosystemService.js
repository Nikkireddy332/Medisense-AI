import api from '../axios';

export const ecosystemService = {
  getFavorites: async () => {
    const response = await api.get('/ecosystem/favorites');
    return response.data;
  },

  addFavorite: async (favoriteData) => {
    const response = await api.post('/ecosystem/favorites', favoriteData);
    return response.data;
  },

  removeFavorite: async (itemType, itemId) => {
    const response = await api.delete(`/ecosystem/favorites/${itemType}/${itemId}`);
    return response.data;
  },

  getMedicalTimeline: async () => {
    const response = await api.get('/ecosystem/history');
    return response.data;
  },

  addHistoryItem: async (historyData) => {
    const response = await api.post('/ecosystem/history', historyData);
    return response.data;
  },

  getHealthScore: async () => {
    const response = await api.get('/ecosystem/health-score');
    return response.data;
  },

  updateHealthMetrics: async (metrics) => {
    const response = await api.post('/ecosystem/health-score', metrics);
    return response.data;
  },

  getAnalytics: async () => {
    const response = await api.get('/ecosystem/analytics');
    return response.data;
  }
};

export default ecosystemService;

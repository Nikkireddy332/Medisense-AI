import api from '../axios';

export const healthService = {
  // Check API health status
  checkHealth: () =>
    api.get('/health').then(() => ({
      status: 'healthy',
      message: 'Backend API is running'
    })).catch((error) => ({
      status: 'unhealthy',
      message: error.message,
      error: true
    }))
};

export default healthService;

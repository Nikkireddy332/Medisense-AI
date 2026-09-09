import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  timeout: parseInt(import.meta.env.VITE_API_TIMEOUT) || 15000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor - add token to headers
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('medAuthToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (import.meta.env.VITE_ENABLE_REQUEST_LOGGING === 'true') {
    console.log(`[API Request] ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
  }

  return config;
});

// Response interceptor - handle errors and logging
api.interceptors.response.use(
  (response) => {
    if (import.meta.env.VITE_ENABLE_REQUEST_LOGGING === 'true') {
      console.log(`[API Response] ${response.config.method?.toUpperCase()} ${response.status}`, response.data);
    }
    return response;
  },
  (error) => {
    if (error.response) {
      // Backend returned error response
      console.error(`[API Error] ${error.response.status}`, error.response.data);

      if (error.response.status === 401) {
        // Unauthorized - clear token and redirect to login
        localStorage.removeItem('medAuthToken');
        window.location.href = '/login';
      }
    } else if (error.request) {
      // Request made but no response
      console.error('[API Error] No response from server', error.request);
    } else {
      // Error in request setup
      console.error('[API Error] Request setup error', error.message);
    }
    return Promise.reject(error);
  }
);

export default api;

import api from '../axios';

export const authService = {
  // Register a new user
  register: (data) => api.post('/auth/register', data),

  // Login user (trim email; password sent as entered)
  login: (email, password) =>
    api.post('/auth/login', {
      email: typeof email === 'string' ? email.trim() : email,
      password,
    }),

  // Get current user info
  getMe: () => api.get('/auth/me'),

  // Request password reset
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),

  // Reset password with token
  resetPassword: (token, password) => api.post(`/auth/reset-password/${token}`, { password }),

  // Logout (clear token locally)
  logout: () => {
    localStorage.removeItem('medAuthToken');
  }
};

export default authService;

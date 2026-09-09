import api from '../axios';

export const adminService = {
  // Get admin dashboard
  getDashboard: () => api.get('/admin/dashboard'),

  // Get all users
  getUsers: (page = 1, limit = 10) => api.get(`/admin/users?page=${page}&limit=${limit}`),

  // Get user by ID
  getUser: (userId) => api.get(`/admin/users/${userId}`),

  // Delete user
  deleteUser: (userId) => api.delete(`/admin/users/${userId}`),

  // Block/Unblock user
  toggleUserStatus: (userId, isActive) =>
    api.put(`/admin/users/${userId}`, { isActive }),

  // Get all doctors
  getDoctors: (page = 1, limit = 10) => api.get(`/admin/doctors?page=${page}&limit=${limit}`),

  // Verify doctor
  verifyDoctor: (doctorId) => api.put(`/admin/doctors/${doctorId}/verify`),

  // Get all appointments
  getAppointments: (page = 1, limit = 10) => api.get(`/admin/appointments?page=${page}&limit=${limit}`),

  // Get system statistics
  getStatistics: () => api.get('/admin/statistics'),

  // Get logs
  getLogs: (page = 1, limit = 50) => api.get(`/admin/logs?page=${page}&limit=${limit}`)
};

export default adminService;

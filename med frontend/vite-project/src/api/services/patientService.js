import api from '../axios';

export const patientService = {
  // Get patient dashboard
  getDashboard: () => api.get('/patient/dashboard'),

  // Get patient appointments
  getAppointments: () => api.get('/patient/appointments'),

  // Book appointment
  bookAppointment: (data) => api.post('/patient/appointments', data),

  // Get medical history
  getMedicalHistory: () => api.get('/patient/medical-history'),

  // Upload medical record
  uploadMedicalRecord: (formData) =>
    api.post('/patient/medical-records', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),

  // Get patient profile
  getProfile: () => api.get('/patient/profile'),

  // Update patient profile
  updateProfile: (data) => api.put('/patient/profile', data),

  // Predict health condition (AI)
  predictCondition: (symptoms, prediction) => api.post('/patient/predict', { symptoms, prediction })
};

export default patientService;

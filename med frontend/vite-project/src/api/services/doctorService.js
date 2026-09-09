import api from '../axios';

export const doctorService = {
  // Get doctor dashboard
  getDashboard: () => api.get('/doctor/dashboard'),

  // Get doctor appointments
  getAppointments: () => api.get('/doctor/appointments'),

  // Accept/reject appointment
  updateAppointmentStatus: (appointmentId, status) =>
    api.put(`/doctor/appointments/${appointmentId}`, { status }),

  // Get doctor patients
  getPatients: () => api.get('/doctor/patients'),

  // Get patient details
  getPatientDetails: (patientId) => api.get(`/doctor/patients/${patientId}`),

  // Add prescription
  addPrescription: (appointmentId, data) =>
    api.post(`/doctor/appointments/${appointmentId}/prescription`, data),

  // Get doctor profile
  getProfile: () => api.get('/doctor/profile'),

  // Update doctor profile
  updateProfile: (data) => api.put('/doctor/profile', data),

  // Get availability slots
  getAvailability: () => api.get('/doctor/availability'),

  // Set availability
  setAvailability: (data) => api.post('/doctor/availability', data)
};

export default doctorService;

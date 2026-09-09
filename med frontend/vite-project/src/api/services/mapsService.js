import api from '../axios';

export const mapsService = {
  getNearbyHospitals: async (params = {}) => {
    const response = await api.get('/maps/hospitals', { params });
    return response.data;
  },

  getNearbyLabs: async (params = {}) => {
    const response = await api.get('/maps/labs', { params });
    return response.data;
  },

  getNearbyPharmacies: async (params = {}) => {
    const response = await api.get('/maps/pharmacies', { params });
    return response.data;
  },

  getEmergencyServices: async (params = {}) => {
    const response = await api.get('/maps/emergency', { params });
    return response.data;
  }
};

export default mapsService;

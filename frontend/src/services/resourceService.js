import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/v1/resources';

// --- ADVANCED MOCK DATA FOR "NEXT LEVEL" UI DEMO ---
const advancedMockData = [
  { id: '1', name: 'Main Auditorium', type: 'HALL', capacity: 500, location: 'Block A, Floor 1', status: 'ACTIVE' },
  { id: '2', name: 'Chemistry Lab B1', type: 'LAB', capacity: 40, location: 'Science Wing', status: 'ACTIVE' },
  { id: '3', name: 'Server Rack 04', type: 'EQUIPMENT', capacity: null, location: 'IT Dept Server Room', status: 'OUT_OF_SERVICE' },
  { id: '4', name: 'Meeting Room Alpha', type: 'ROOM', capacity: 15, location: 'Block C, Floor 4', status: 'ACTIVE' },
  { id: '5', name: 'Study Pod 12', type: 'POD', capacity: 4, location: 'Library 2nd Floor', status: 'ACTIVE' },
  { id: '6', name: 'Physics Mechanics Lab', type: 'LAB', capacity: 30, location: 'Block B, Floor 2', status: 'UNDER_MAINTENANCE' },
  { id: '7', name: 'Projector X-200 (Mobile)', type: 'EQUIPMENT', capacity: null, location: 'Admin Office', status: 'ACTIVE' },
  { id: '8', name: 'Open Air Theater', type: 'HALL', capacity: 1000, location: 'Campus Center', status: 'ACTIVE' },
  { id: '9', name: 'Computer Lab 3 (Macs)', type: 'LAB', capacity: 60, location: 'IT Wing, Floor 3', status: 'ACTIVE' },
  { id: '10', name: 'Exam Hall A', type: 'HALL', capacity: 250, location: 'Block F', status: 'ACTIVE' }
];

const resourceService = {
  getAllResources: async (page = 0, size = 10, sort = 'id,desc', filters = {}) => {
    try {
      let url = `${API_BASE_URL}?page=${page}&size=${size}&sort=${sort}`;
      // Append any available filters
      if (filters.search) url += `&search=${filters.search}`;
      if (filters.type) url += `&type=${filters.type}`;
      if (filters.minCapacity) url += `&minCapacity=${filters.minCapacity}`;
      if (filters.maxCapacity) url += `&maxCapacity=${filters.maxCapacity}`;
      if (filters.location) url += `&location=${filters.location}`;
      if (filters.status) url += `&status=${filters.status}`;

      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.warn("Backend offline! Switching to ADVANCED MOCK DATA for demo.");
      return new Promise((resolve) => {
        setTimeout(() => resolve(advancedMockData), 400); // simulate network delay for smooth animations
      });
    }
  },

  getResourceById: async (id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/${id}`);
      return response.data;
    } catch (e) {
      return advancedMockData.find(r => r.id === id);
    }
  },

  createResource: async (resourceData) => {
    try {
      const response = await axios.post(API_BASE_URL, resourceData);
      return response.data;
    } catch (e) {
       resourceData.id = Math.random().toString(36).substr(2, 9);
       advancedMockData.push(resourceData);
       return resourceData;
    }
  },

  updateResource: async (id, resourceData) => {
    const response = await axios.put(`${API_BASE_URL}/${id}`, resourceData);
    return response.data;
  },

  updateResourceStatus: async (id, status) => {
    const response = await axios.patch(`${API_BASE_URL}/${id}/status?status=${status}`);
    return response.data;
  },

  deleteResource: async (id) => {
    try {
        const response = await axios.delete(`${API_BASE_URL}/${id}`);
        return response.data;
    } catch (e) {
        return true;
    }
  }
};

export default resourceService;

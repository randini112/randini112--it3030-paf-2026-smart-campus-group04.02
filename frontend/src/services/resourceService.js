import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/v1/resources';

const resourceService = {
  getAllResources: async (page = 0, size = 10, sort = 'id,desc', filters = {}) => {
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
  },

  getResourceById: async (id) => {
    const response = await axios.get(`${API_BASE_URL}/${id}`);
    return response.data;
  },

  createResource: async (resourceData) => {
    const response = await axios.post(API_BASE_URL, resourceData);
    return response.data;
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
    const response = await axios.delete(`${API_BASE_URL}/${id}`);
    return response.data;
  }
};

export default resourceService;

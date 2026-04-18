import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/v1/resources';

// --- ADVANCED MOCK DATA FOR "NEXT LEVEL" UI DEMO ---
// Using 'let' so delete/update can mutate this in-memory for offline demo
let advancedMockData = [
  { id: '1', name: 'Main Auditorium', type: 'HALL', capacity: 500, location: 'Block A, Floor 1', building: 'Block A', floor: '1', status: 'ACTIVE', availStart: '08:00', availEnd: '22:00', description: 'The largest auditorium on campus, equipped with state-of-the-art AV systems.' },
  { id: '2', name: 'Chemistry Lab B1', type: 'LAB', capacity: 40, location: 'Science Wing', building: 'Science Block', floor: '2', status: 'ACTIVE', availStart: '08:00', availEnd: '18:00', description: 'Fully equipped chemistry laboratory with fume hoods and safety showers.' },
  { id: '3', name: 'Cisco Nexus 9300 Core Switch', type: 'EQUIPMENT', capacity: null, location: 'IT Dept Server Room', building: 'IT Block', floor: '1', status: 'OUT_OF_SERVICE', availStart: '00:00', availEnd: '23:59', description: 'SN: CSNEX-23004. Enterprise core switch undergoing firmware updates.' },
  { id: '4', name: 'Meeting Room Alpha', type: 'MEETING_ROOM', capacity: 15, location: 'Block C, Floor 4', building: 'Block C', floor: '4', status: 'ACTIVE', availStart: '09:00', availEnd: '17:00', description: 'Executive meeting room with video conferencing capabilities.' },
  { id: '5', name: 'Study Pod 12', type: 'MEETING_ROOM', capacity: 4, location: 'Library 2nd Floor', building: 'Library', floor: '2', status: 'ACTIVE', availStart: '07:00', availEnd: '22:00', description: 'Quiet collaborative study pod for small group sessions.' },
  { id: '6', name: 'Physics Mechanics Lab', type: 'LAB', capacity: 30, location: 'Block B, Floor 2', building: 'Block B', floor: '2', status: 'OUT_OF_SERVICE', availStart: '08:00', availEnd: '18:00', description: 'Mechanics and dynamics laboratory for undergraduate physics experiments.' },
  { id: '7', name: 'Epson Pro L1060U Projector', type: 'EQUIPMENT', capacity: null, location: 'Admin Office', building: 'Admin Block', floor: '1', status: 'ACTIVE', availStart: '08:00', availEnd: '20:00', description: 'SN: EPS-84992. Portable high-lumen 4K projector for presentations.' },
  { id: '8', name: 'Open Air Theater', type: 'HALL', capacity: 1000, location: 'Campus Center', building: 'Main Campus', floor: 'Ground', status: 'ACTIVE', availStart: '17:00', availEnd: '23:00', description: 'Open-air amphitheater for large campus events and performances.' },
  { id: '9', name: 'Computer Lab 3 (Macs)', type: 'LAB', capacity: 60, location: 'IT Wing, Floor 3', building: 'IT Block', floor: '3', status: 'ACTIVE', availStart: '08:00', availEnd: '21:00', description: 'Apple iMac lab for design, development, and media production courses.' },
  { id: '10', name: 'Exam Hall A', type: 'HALL', capacity: 250, location: 'Block F', building: 'Block F', floor: '1', status: 'ACTIVE', availStart: '08:00', availEnd: '18:00', description: 'Large examination hall with individual seating and controlled environment.' },
  { id: '11', name: 'Robotics Lab', type: 'LAB', capacity: 25, location: 'Engineering Block', building: 'Engineering Block', floor: '2', status: 'ACTIVE', availStart: '09:00', availEnd: '21:00', description: 'Advanced robotics and automation lab with industrial robot arms.' },
  { id: '12', name: 'Lecture Theater 1', type: 'HALL', capacity: 150, location: 'Block B, Floor 1', building: 'Block B', floor: '1', status: 'ACTIVE', availStart: '08:00', availEnd: '20:00', description: 'Modern tiered lecture theater with digital podium and live-stream capability.' },
  { id: '13', name: 'Conference Room Beta', type: 'MEETING_ROOM', capacity: 20, location: 'Block C, Floor 4', building: 'Block C', floor: '4', status: 'OUT_OF_SERVICE', availStart: '09:00', availEnd: '17:00', description: 'Boardroom-style conference room undergoing AV upgrade.' },
  { id: '14', name: 'Prusa i3 MK3S+ 3D Printer', type: 'EQUIPMENT', capacity: null, location: 'Innovation Hub', building: 'Innovation Hub', floor: '1', status: 'ACTIVE', availStart: '09:00', availEnd: '19:00', description: 'SN: PRU-39011. FDM 3D printer assigned to the rapid prototyping farm.' },
  { id: '15', name: 'Study Pod 14', type: 'MEETING_ROOM', capacity: 4, location: 'Library 3rd Floor', building: 'Library', floor: '3', status: 'ACTIVE', availStart: '07:00', availEnd: '22:00', description: 'Silent study pod with whiteboards available on request.' },
  { id: '16', name: 'Biology Dissection Lab', type: 'LAB', capacity: 35, location: 'Science Wing', building: 'Science Block', floor: '1', status: 'ACTIVE', availStart: '08:00', availEnd: '17:00', description: 'Anatomy and biology lab with dissection benches and specimen storage.' },
  { id: '17', name: 'Zeiss LSM 900 Confocal Microscope', type: 'EQUIPMENT', capacity: null, location: 'Bio Wing', building: 'Science Block', floor: '1', status: 'ACTIVE', availStart: '08:00', availEnd: '22:00', description: 'SN: ZEI-09488. High-precision electron microscope for Bio-lab research.' },
  { id: '18', name: 'Mini Auditorium', type: 'HALL', capacity: 100, location: 'Block D', building: 'Block D', floor: '2', status: 'ACTIVE', availStart: '08:00', availEnd: '22:00', description: 'Intimate auditorium ideal for seminars, workshops, and panel discussions.' },
  { id: '19', name: 'Dell PowerEdge R740 Server', type: 'EQUIPMENT', capacity: null, location: 'IT Dept Server Room', building: 'IT Block', floor: 'Basement', status: 'ACTIVE', availStart: '00:00', availEnd: '23:59', description: 'SN: DEL-83021. Rack server hosting institutional databases and cloud VMs.' },
  { id: '20', name: 'Exam Hall B', type: 'HALL', capacity: 250, location: 'Block F', building: 'Block F', floor: '2', status: 'ACTIVE', availStart: '08:00', availEnd: '18:00', description: 'Secondary exam hall with CCTV monitoring and climate control.' },
  { id: '21', name: 'Virtual Reality Lab', type: 'LAB', capacity: 15, location: 'Innovation Hub', building: 'Innovation Hub', floor: '2', status: 'OUT_OF_SERVICE', availStart: '09:00', availEnd: '18:00', description: 'Immersive VR lab with Oculus headsets for simulation and design research.' },
  { id: '22', name: 'Seminar Room 1', type: 'MEETING_ROOM', capacity: 50, location: 'Block A, Floor 2', building: 'Block A', floor: '2', status: 'ACTIVE', availStart: '08:00', availEnd: '20:00', description: 'Flexible seminar room with movable partitions to support various layouts.' },
  { id: '23', name: 'Keysight Digital Oscilloscope', type: 'EQUIPMENT', capacity: null, location: 'Engineering Block', building: 'Engineering Block', floor: '1', status: 'ACTIVE', availStart: '08:00', availEnd: '18:00', description: 'SN: KEY-10029. High-bandwidth digital oscilloscope for signal processing.' },
  { id: '24', name: 'Quiet Study Area', type: 'MEETING_ROOM', capacity: 80, location: 'Library 4th Floor', building: 'Library', floor: '4', status: 'ACTIVE', availStart: '07:00', availEnd: '23:00', description: 'Large silent study zone with individual carrels and power outlets at every seat.' },
  { id: '25', name: 'Meta Quest 3 VR Headset', type: 'EQUIPMENT', capacity: null, location: 'IT Wing, Floor 2', building: 'IT Block', floor: '2', status: 'ACTIVE', availStart: '08:00', availEnd: '21:00', description: 'SN: MQ3-99021. Mixed reality headset for spatial computing research.' }
];

// Helper: wrap plain array in Spring Boot paginated response format
const toPaginatedResponse = (data, page, size) => {
  const start = page * size;
  const end = start + size;
  const content = data.slice(start, end);
  return {
    content,
    pageable: { pageNumber: page, pageSize: size },
    totalElements: data.length,
    totalPages: Math.ceil(data.length / size),
    size,
    number: page
  };
};

const resourceService = {
  getAllResources: async (page = 0, size = 10, sort = 'id,desc', filters = {}) => {
    try {
      let url = `${API_BASE_URL}?page=${page}&size=${size}&sort=${sort}`;
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
      // Apply client-side filters on mock data
      let filtered = [...advancedMockData];
      if (filters.search) filtered = filtered.filter(r => r.name.toLowerCase().includes(filters.search.toLowerCase()));
      if (filters.type) filtered = filtered.filter(r => r.type === filters.type);
      if (filters.status) filtered = filtered.filter(r => r.status === filters.status);
      if (filters.location) filtered = filtered.filter(r => r.location?.toLowerCase().includes(filters.location.toLowerCase()));
      if (filters.minCapacity) filtered = filtered.filter(r => r.capacity >= parseInt(filters.minCapacity));
      return new Promise((resolve) => {
        setTimeout(() => resolve(toPaginatedResponse(filtered, page, size)), 300);
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
    try {
      const response = await axios.put(`${API_BASE_URL}/${id}`, resourceData);
      return response.data;
    } catch (e) {
      // Mock update: find and replace in-memory
      const idx = advancedMockData.findIndex(r => r.id === id);
      if (idx !== -1) advancedMockData[idx] = { ...advancedMockData[idx], ...resourceData, id };
      return advancedMockData[idx];
    }
  },

  updateResourceStatus: async (id, status) => {
    try {
      const response = await axios.patch(`${API_BASE_URL}/${id}/status?status=${status}`);
      return response.data;
    } catch (e) {
      // Mock status toggle in-memory
      const idx = advancedMockData.findIndex(r => r.id === id);
      if (idx !== -1) advancedMockData[idx] = { ...advancedMockData[idx], status };
      return advancedMockData[idx];
    }
  },

  deleteResource: async (id) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/${id}`);
      return response.data;
    } catch (e) {
      // Mock delete: actually remove from in-memory array
      const idx = advancedMockData.findIndex(r => r.id === id);
      if (idx !== -1) advancedMockData.splice(idx, 1);
      console.log(`Mock: Deleted resource ${id}. Remaining: ${advancedMockData.length}`);
      return true;
    }
  }
};

export default resourceService;

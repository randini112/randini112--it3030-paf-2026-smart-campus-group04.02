import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/v1/maintenance';

// --- MOCK DATA ---
let mockTickets = [
  { id: 'mt1', title: 'Projector Bulb Replacement', description: 'The projector in Lecture Theater 1 has a blown bulb. Classes are affected.', facilityId: '12', facilityName: 'Lecture Theater 1', priority: 'HIGH', status: 'OPEN', reportedBy: 'Dr. Silva', assignedTo: 'Tech Team A', reportedDate: '2026-04-15', estimatedDate: '2026-04-19' },
  { id: 'mt2', title: 'HVAC System Failure', description: 'Air conditioning completely non-functional in the Robotics Lab. Equipment overheating risk.', facilityId: '11', facilityName: 'Robotics Lab', priority: 'CRITICAL', status: 'IN_PROGRESS', reportedBy: 'Prof. Perera', assignedTo: 'Facilities Dept', reportedDate: '2026-04-14', estimatedDate: '2026-04-20' },
  { id: 'mt3', title: 'Network Switch Down', description: 'Primary network switch in Computer Lab 3 is offline. All 60 workstations affected.', facilityId: '9', facilityName: 'Computer Lab 3 (Macs)', priority: 'CRITICAL', status: 'IN_PROGRESS', reportedBy: 'Lab Technician', assignedTo: 'IT Support', reportedDate: '2026-04-16', estimatedDate: '2026-04-18' },
  { id: 'mt4', title: 'Broken Door Lock', description: 'Main entrance door lock mechanism is faulty in Meeting Room Alpha. Security concern.', facilityId: '4', facilityName: 'Meeting Room Alpha', priority: 'MEDIUM', status: 'OPEN', reportedBy: 'Admin Staff', assignedTo: 'Maintenance Crew', reportedDate: '2026-04-17', estimatedDate: '2026-04-21' },
  { id: 'mt5', title: 'VR Headset Calibration Error', description: 'All VR headsets showing tracking errors. Lab temporarily closed for safety.', facilityId: '21', facilityName: 'Virtual Reality Lab', priority: 'HIGH', status: 'OPEN', reportedBy: 'VR Lab Manager', assignedTo: 'Unassigned', reportedDate: '2026-04-13', estimatedDate: '2026-04-25' },
  { id: 'mt6', title: 'Power Outlet Bank Failure', description: 'South-side power outlets in Quiet Study Area are non-functional.', facilityId: '24', facilityName: 'Quiet Study Area', priority: 'MEDIUM', status: 'RESOLVED', reportedBy: 'Student Rep', assignedTo: 'Electrical Team', reportedDate: '2026-04-10', estimatedDate: '2026-04-12' },
  { id: 'mt7', title: 'Fume Hood Fan Broken', description: 'One of three fume hoods in Chemistry Lab B1 has a non-functional extraction fan. Safety hazard.', facilityId: '2', facilityName: 'Chemistry Lab B1', priority: 'CRITICAL', status: 'RESOLVED', reportedBy: 'Lab Safety Officer', assignedTo: 'Facilities Dept', reportedDate: '2026-04-08', estimatedDate: '2026-04-10' },
  { id: 'mt8', title: 'Whiteboard Replacement', description: 'Whiteboard in Seminar Room 1 is cracked and needs replacement.', facilityId: '22', facilityName: 'Seminar Room 1', priority: 'LOW', status: 'OPEN', reportedBy: 'Faculty Member', assignedTo: 'Unassigned', reportedDate: '2026-04-17', estimatedDate: '2026-04-30' },
  { id: 'mt9', title: 'Stage Lighting Malfunction', description: 'Half the stage lighting rigs in the Open Air Theater are unresponsive.', facilityId: '8', facilityName: 'Open Air Theater', priority: 'HIGH', status: 'IN_PROGRESS', reportedBy: 'Events Coordinator', assignedTo: 'AV Team', reportedDate: '2026-04-15', estimatedDate: '2026-04-22' },
  { id: 'mt10', title: 'Server Rack Cooling Fan', description: 'Cooling fan on Server Rack 04 making grinding noise. Replacement required.', facilityId: '3', facilityName: 'Server Rack 04', priority: 'CRITICAL', status: 'IN_PROGRESS', reportedBy: 'IT Admin', assignedTo: 'IT Support', reportedDate: '2026-04-12', estimatedDate: '2026-04-18' },
  { id: 'mt11', title: 'Projector Remote Missing', description: 'Exam Hall A projector remote control is missing. Temporary workaround in place.', facilityId: '10', facilityName: 'Exam Hall A', priority: 'LOW', status: 'RESOLVED', reportedBy: 'Invigilator', assignedTo: 'Admin Staff', reportedDate: '2026-04-11', estimatedDate: '2026-04-13' },
  { id: 'mt12', title: '3D Printer Nozzle Clogs', description: 'Three FDM printers in the 3D Printer Farm have clogged nozzles and require cleaning.', facilityId: '14', facilityName: '3D Printer Farm', priority: 'MEDIUM', status: 'OPEN', reportedBy: 'Innovation Hub Staff', assignedTo: 'Tech Team B', reportedDate: '2026-04-18', estimatedDate: '2026-04-23' },
];

const toPaginatedResponse = (data, page, size) => {
  const start = page * size;
  const content = data.slice(start, start + size);
  return {
    content,
    pageable: { pageNumber: page, pageSize: size },
    totalElements: data.length,
    totalPages: Math.ceil(data.length / size),
    size,
    number: page
  };
};

const maintenanceService = {
  getAllTickets: async (page = 0, size = 20, filters = {}) => {
    try {
      const response = await axios.get(`${API_BASE_URL}?page=${page}&size=${size}`);
      return response.data;
    } catch {
      let filtered = [...mockTickets];
      if (filters.status) filtered = filtered.filter(t => t.status === filters.status);
      if (filters.priority) filtered = filtered.filter(t => t.priority === filters.priority);
      if (filters.search) filtered = filtered.filter(t => t.title.toLowerCase().includes(filters.search.toLowerCase()) || t.facilityName.toLowerCase().includes(filters.search.toLowerCase()));
      return new Promise(resolve => setTimeout(() => resolve(toPaginatedResponse(filtered, page, size)), 300));
    }
  },

  getTicketById: async (id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/${id}`);
      return response.data;
    } catch {
      return mockTickets.find(t => t.id === id);
    }
  },

  createTicket: async (data) => {
    try {
      const response = await axios.post(API_BASE_URL, data);
      return response.data;
    } catch {
      const newTicket = { ...data, id: 'mt' + Date.now(), reportedDate: new Date().toISOString().split('T')[0] };
      mockTickets.unshift(newTicket);
      return newTicket;
    }
  },

  updateTicket: async (id, data) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/${id}`, data);
      return response.data;
    } catch {
      const idx = mockTickets.findIndex(t => t.id === id);
      if (idx !== -1) mockTickets[idx] = { ...mockTickets[idx], ...data, id };
      return mockTickets[idx];
    }
  },

  updateTicketStatus: async (id, status) => {
    try {
      const response = await axios.patch(`${API_BASE_URL}/${id}/status?status=${status}`);
      return response.data;
    } catch {
      const idx = mockTickets.findIndex(t => t.id === id);
      if (idx !== -1) mockTickets[idx] = { ...mockTickets[idx], status };
      return mockTickets[idx];
    }
  },

  deleteTicket: async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/${id}`);
      return true;
    } catch {
      const idx = mockTickets.findIndex(t => t.id === id);
      if (idx !== -1) mockTickets.splice(idx, 1);
      return true;
    }
  }
};

export default maintenanceService;

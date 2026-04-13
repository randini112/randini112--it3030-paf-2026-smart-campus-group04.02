import axios from 'axios'

const API_BASE_URL = 'http://localhost:8081/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  try {
    const userData = localStorage.getItem('user')
    if (userData) {
      const user = JSON.parse(userData)
      config.headers = config.headers || {}
      config.headers['X-User-Name'] = user.username || user.fullName || 'admin'
      config.headers['X-User-Role'] = user.role || 'STUDENT'
      if (user.role !== 'ADMIN' && user.moduleAssignment) {
        config.headers['X-User-Module'] = user.moduleAssignment
      }
    }
  } catch (error) {
    console.error('Failed to attach auth headers', error)
  }

  return config
})

export const apiService = {
  get: (url) => api.get(url),
  post: (url, data) => api.post(url, data),
  put: (url, data) => api.put(url, data),
  delete: (url) => api.delete(url),
  getBookings: () => api.get('/bookings'),
  getPendingBookings: () => api.get('/bookings/pending'),
  approveBooking: (bookingId) => api.post(`/bookings/${bookingId}/approve`),
  rejectBooking: (bookingId, reason) => api.post(`/bookings/${bookingId}/reject?reason=${encodeURIComponent(reason)}`),
}

export default apiService

import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

// Attach token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('ecolife_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle 401 globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('ecolife_token')
      localStorage.removeItem('ecolife_user')
      window.location.href = '/home'
    }
    return Promise.reject(error)
  }
)

// ========================
// AUTH
// ========================
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/me', data),
}



// ========================
// AI
// ========================
// export const aiAPI = {
//   getEnergyTips: () => api.get('/ai/energy-tips'),
// }


// ========================
// RECYCLING
// ========================
export const recyclingAPI = {
  getCenters: (params) => api.get('/recycling/centers', { params }),
  getNearbyCenters: (params) => api.get('/recycling/centers/nearby', { params }),
  getCenterById: (id) => api.get(`/recycling/centers/${id}`),
  createSubmission: (data) => api.post('/recycling/submissions', data),
  getMySubmissions: () => api.get('/recycling/submissions/me'),
  // Admin
  getAllSubmissions: (params) => api.get('/recycling/submissions', { params }),
  reviewSubmission: (id, data) => api.patch(`/recycling/submissions/${id}/review`, data),
  createCenter: (data) => api.post('/recycling/centers', data),
  updateCenter: (id, data) => api.put(`/recycling/centers/${id}`, data),
  deleteCenter: (id) => api.delete(`/recycling/centers/${id}`),
}

// ========================
// ADMIN................................................................................................................

// ========================
// export const adminAPI = {
//   getStats: () => api.get('/admin/stats'),
//   getUsers: (params) => api.get('/admin/users', { params }),
//   getUserById: (id) => api.get(`/admin/users/${id}`),
//   toggleUserStatus: (id) => api.patch(`/admin/users/${id}/toggle-status`),
// }

export default api

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
// ENERGY / APPLIANCES
// ========================
export const energyAPI = {
  getAppliances: () => api.get('/energy/appliances'),
  addAppliance: (data) => api.post('/energy/appliances', data),
  updateAppliance: (id, data) => api.put(`/energy/appliances/${id}`, data),
  deleteAppliance: (id) => api.delete(`/energy/appliances/${id}`),
  toggleAppliance: (id) => api.patch(`/energy/appliances/${id}/toggle`),
  estimateBill: () => api.get('/energy/estimate-bill'),
  // Tariffs
  getTariffs: () => api.get('/energy/tariffs'),
  createTariff: (data) => api.post('/energy/tariffs', data),
  updateTariff: (id, data) => api.put(`/energy/tariffs/${id}`, data),
  deleteTariff: (id) => api.delete(`/energy/tariffs/${id}`),
}

// ========================
// MARKETPLACE
// ========================
// export const marketplaceAPI = {
//   getItems: (params) => api.get('/marketplace/items', { params }),
//   getItemById: (id) => api.get(`/marketplace/items/${id}`),
//   getMyItems: () => api.get('/marketplace/my-items'),
//   createItem: (formData) => api.post('/marketplace/items', formData, {
//     headers: { 'Content-Type': 'multipart/form-data' }
//   }),
//   updateItem: (id, data) => api.put(`/marketplace/items/${id}`, data),
//   deleteItem: (id) => api.delete(`/marketplace/items/${id}`),
//   claimItem: (id) => api.post(`/marketplace/items/${id}/claim`),
//   getMyTransactions: () => api.get('/marketplace/transactions'),
//   reviewTransaction: (id, action) => api.patch(`/marketplace/transactions/${id}/review`, { action }),
//   // Admin
//   adminGetAll: () => api.get('/marketplace/admin/all'),
// }

// ========================
// WASTE
// ========================
// export const wasteAPI = {
//   getLogs: (params) => api.get('/waste', { params }),
//   logWaste: (formData) => api.post('/waste', formData, {
//     headers: { 'Content-Type': 'multipart/form-data' }
//   }),
//   getAnalytics: () => api.get('/waste/analytics'),
//   getLogById: (id) => api.get(`/waste/${id}`),
//   deleteLog: (id) => api.delete(`/waste/${id}`),
//   // Admin
//   adminGetAll: () => api.get('/waste/admin/all'),
// }

// ========================
// RECYCLING
// ========================
// export const recyclingAPI = {
//   getCenters: (params) => api.get('/recycling/centers', { params }),
//   getNearbyCenters: (params) => api.get('/recycling/centers/nearby', { params }),
//   getCenterById: (id) => api.get(`/recycling/centers/${id}`),
//   createSubmission: (data) => api.post('/recycling/submissions', data),
//   getMySubmissions: () => api.get('/recycling/submissions/me'),
//   // Admin
//   getAllSubmissions: (params) => api.get('/recycling/submissions', { params }),
//   reviewSubmission: (id, data) => api.patch(`/recycling/submissions/${id}/review`, data),
//   createCenter: (data) => api.post('/recycling/centers', data),
//   updateCenter: (id, data) => api.put(`/recycling/centers/${id}`, data),
//   deleteCenter: (id) => api.delete(`/recycling/centers/${id}`),
// }

// ========================
// ADMIN
// ========================
export const adminAPI = {
  getStats: () => api.get('/admin/stats'),
  getUsers: (params) => api.get('/admin/users', { params }),
  getUserById: (id) => api.get(`/admin/users/${id}`),
  toggleUserStatus: (id) => api.patch(`/admin/users/${id}/toggle-status`),
}

export default api

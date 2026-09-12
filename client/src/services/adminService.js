import api from './api.js'

export async function fetchDashboardStats() {
  const { data } = await api.get('/admin/dashboard')

  return data
}

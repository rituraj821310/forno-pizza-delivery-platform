import api from './api.js'

export async function fetchMenu(params = {}) {
  const { data } = await api.get('/menu', { params })
  return data
}

export async function fetchAdminMenu(params = {}) {
  const { data } = await api.get('/menu/admin', {
    params,
  })

  return data
}

export async function fetchMenuItem(id) {
  const { data } = await api.get(`/menu/${id}`)
  return data
}

export async function createMenuItem(payload) {
  const { data } = await api.post('/menu', payload)
  return data
}

export async function updateMenuItem(id, payload) {
  const { data } = await api.put(
    `/menu/${id}`,
    payload
  )

  return data
}

export async function deleteMenuItem(id) {
  const { data } = await api.delete(`/menu/${id}`)
  return data
}
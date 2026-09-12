import api from './api.js'

export async function fetchUsers(params = {}) {
  const { data } = await api.get('/users', { params })
  return data
}

export async function updateUserRole(id, role) {
  const { data } = await api.patch(`/users/${id}/role`, { role })
  return data
}

export async function deleteUser(id) {
  const { data } = await api.delete(`/users/${id}`)
  return data
}

import api from './api.js'

export async function createOrder(payload) {
  const { data } = await api.post('/orders', payload)
  return data
}

export async function fetchMyOrders() {
  const { data } = await api.get('/orders/me')
  return data
}

export async function fetchOrder(id) {
  const { data } = await api.get(`/orders/${id}`)
  return data
}

export async function fetchAllOrders(params = {}) {
  const { data } = await api.get('/orders', { params })
  return data
}

export async function updateOrderStatus(id, status) {
  const { data } = await api.patch(`/orders/${id}/status`, { status })
  return data
}

export async function cancelOrder(id) {
  const { data } = await api.patch(`/orders/${id}/cancel`)
  return data
}

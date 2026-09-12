export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || '/api'

export const SERVER_BASE_URL =
  import.meta.env.VITE_SERVER_BASE_URL || 'http://localhost:5000'

export const ORDER_STATUS = {
  PLACED: 'placed',
  CONFIRMED: 'confirmed',
  PREPARING: 'preparing',
  BAKING: 'baking',
  OUT_FOR_DELIVERY: 'out_for_delivery',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
}

export const ORDER_STATUS_LABELS = {
  [ORDER_STATUS.PLACED]: 'Order placed',
  [ORDER_STATUS.CONFIRMED]: 'Confirmed',
  [ORDER_STATUS.PREPARING]: 'Preparing',
  [ORDER_STATUS.BAKING]: 'In the oven',
  [ORDER_STATUS.OUT_FOR_DELIVERY]: 'Out for delivery',
  [ORDER_STATUS.DELIVERED]: 'Delivered',
  [ORDER_STATUS.CANCELLED]: 'Cancelled',
}

export const ORDER_STATUS_SEQUENCE = [
  ORDER_STATUS.PLACED,
  ORDER_STATUS.CONFIRMED,
  ORDER_STATUS.PREPARING,
  ORDER_STATUS.BAKING,
  ORDER_STATUS.OUT_FOR_DELIVERY,
  ORDER_STATUS.DELIVERED,
]

export const USER_ROLES = {
  CUSTOMER: 'customer',
  ADMIN: 'admin',
}

export const PIZZA_SIZES = [
  { id: 'small', label: '10"', multiplier: 0.8 },
  { id: 'medium', label: '12"', multiplier: 1 },
  { id: 'large', label: '14"', multiplier: 1.25 },
  { id: 'xl', label: '16"', multiplier: 1.5 },
]

export const AUTH_TOKEN_KEY = 'forno_auth_token'

import api from './api.js'

export async function createPaymentOrder({
  amount,
  currency = 'INR',
  receipt,
}) {
  const { data } = await api.post('/payments/create-order', {
    amount,
    currency,
    receipt,
  })

  return data.order
}

export async function verifyPayment({
  razorpayOrderId,
  razorpayPaymentId,
  razorpaySignature,
}) {
  const { data } = await api.post('/payments/verify', {
    razorpayOrderId,
    razorpayPaymentId,
    razorpaySignature,
  })

  return data
}
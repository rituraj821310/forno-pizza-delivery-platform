import razorpay from '../config/razorpay.js'

async function createRazorpayOrder({
  amount,
  currency = 'INR',
  receipt,
}) {
  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error('Invalid payment amount')
  }

  const options = {
    amount: Math.round(amount * 100),
    currency,
    receipt: receipt || `receipt_${Date.now()}`,
  }

  return await razorpay.orders.create(options)
}

async function getRazorpayOrder(orderId) {
  return await razorpay.orders.fetch(orderId)
}

async function getRazorpayPayment(paymentId) {
  return await razorpay.payments.fetch(paymentId)
}

const paymentService = {
  createRazorpayOrder,
  getRazorpayOrder,
  getRazorpayPayment,
}

export default paymentService
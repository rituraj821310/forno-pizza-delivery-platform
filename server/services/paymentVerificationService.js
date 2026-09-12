import crypto from 'node:crypto'
import { razorpayKeySecret } from '../config/env.js'

function verifyRazorpaySignature({
  razorpayOrderId,
  razorpayPaymentId,
  razorpaySignature,
}) {
  const generatedSignature = crypto
    .createHmac('sha256', razorpayKeySecret)
    .update(`${razorpayOrderId}|${razorpayPaymentId}`)
    .digest('hex')

  return crypto.timingSafeEqual(
    Buffer.from(generatedSignature),
    Buffer.from(razorpaySignature),
  )
}

const paymentVerificationService = {
  verifyRazorpaySignature,
}

export default paymentVerificationService
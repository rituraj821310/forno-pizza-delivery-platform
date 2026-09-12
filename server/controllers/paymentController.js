import paymentService from '../services/paymentService.js'
import paymentVerificationService from '../services/paymentVerificationService.js'

export async function createPaymentOrder(req, res, next) {
  try {
    const { amount, currency = 'INR', receipt } = req.body

    if (!amount || amount <= 0) {
      return res.status(400).json({
        message: 'Invalid payment amount',
      })
    }

    const order = await paymentService.createRazorpayOrder({
      amount: Number(amount),
      currency,
      receipt,
    })

    res.status(201).json({
      success: true,
      order,
    })
  } catch (error) {
    console.error('[razorpay] create order failed:', error)
    next(error)
  }
}

export async function verifyPayment(req, res, next) {
  try {
    const {
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
    } = req.body

    if (
      !razorpayOrderId ||
      !razorpayPaymentId ||
      !razorpaySignature
    ) {
      return res.status(400).json({
        success: false,
        message: 'Missing payment verification details',
      })
    }

    const isValid =
      paymentVerificationService.verifyRazorpaySignature({
        razorpayOrderId,
        razorpayPaymentId,
        razorpaySignature,
      })

    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment signature',
      })
    }

    res.status(200).json({
      success: true,
      message: 'Payment verified successfully',
    })
  } catch (error) {
    console.error('[razorpay] payment verification failed:', error)
    next(error)
  }
}
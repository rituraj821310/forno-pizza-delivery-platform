import Razorpay from 'razorpay'
import { razorpayKeyId, razorpayKeySecret } from './env.js'

const razorpay = new Razorpay({
  key_id: razorpayKeyId,
  key_secret: razorpayKeySecret,
})

export default razorpay
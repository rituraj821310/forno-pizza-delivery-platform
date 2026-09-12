import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({
  path: path.resolve(__dirname, '../../.env')
})

function required(name, fallback) {
  const value = process.env[name] ?? fallback
  return value
}

export const nodeEnv = required('NODE_ENV', 'development')
export const port = Number(required('PORT', 5000))
export const mongoUri = required(
  'MONGO_URI',
  'mongodb://127.0.0.1:27017/pizza-delivery'
)
export const jwtSecret = required('JWT_SECRET', 'dev-secret-change-me')
export const jwtExpiresIn = required('JWT_EXPIRES_IN', '7d')
export const clientOrigin = required(
  'CLIENT_ORIGIN',
  'http://localhost:5173'
)
export const razorpayKeyId =
  required('RAZORPAY_KEY_ID', '')

export const razorpayKeySecret =
  required('RAZORPAY_KEY_SECRET', '')

import express from 'express'

import {
  register,
  login,
  forgotPassword,
  verifyResetOTP,
  resetPassword,
  me,
  logout,
  updateProfile,
  changePassword,
} from '../controllers/authController.js'

import { protect } from '../middleware/auth.js'

const router = express.Router()

router.post('/register', register)

router.post('/login', login)

router.post('/forgot-password', forgotPassword)

router.post('/verify-reset-otp', verifyResetOTP)

router.post('/reset-password', resetPassword)

router.post('/logout', logout)

router.get('/me', protect, me)

router.put('/profile', protect, updateProfile)

router.put('/password', protect, changePassword)

export default router
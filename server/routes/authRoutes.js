import express from 'express'

import {
  register,
  login,
  me,
  logout,
  updateProfile,
  changePassword,
} from '../controllers/authController.js'

import { protect } from '../middleware/auth.js'

const router = express.Router()

router.post('/register', register)

router.post('/login', login)

router.post('/logout', logout)

router.get('/me', protect, me)

router.put('/profile', protect, updateProfile)

router.put('/password', protect, changePassword)

export default router
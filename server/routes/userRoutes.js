import express from 'express'

import {
  listUsers,
  updateUserRole,
  deleteUser,
} from '../controllers/userController.js'

import { protect, adminOnly } from '../middleware/auth.js'

const router = express.Router()

// Get all users — Admin only
router.get(
  '/',
  protect,
  adminOnly,
  listUsers
)

// Change user role — Admin only
router.patch(
  '/:id/role',
  protect,
  adminOnly,
  updateUserRole
)

// Delete user — Admin only
router.delete(
  '/:id',
  protect,
  adminOnly,
  deleteUser
)

export default router
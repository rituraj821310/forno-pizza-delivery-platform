import express from 'express'
import {
  createOrder,
  getMyOrders,
  getOrder,
  getAllOrders,
  updateOrderStatus,
  cancelOrder,
} from '../controllers/orderController.js'
import { protect, adminOnly } from '../middleware/auth.js'

const router = express.Router()

// NOTE: /me must be registered before /:id or Express will try to treat "me" as an id.

router.get('/me', protect, getMyOrders)
router.get('/', protect, adminOnly, getAllOrders)
router.post('/', protect, createOrder)
router.get('/:id', protect, getOrder)
router.patch('/:id/status', protect, adminOnly, updateOrderStatus)
router.patch('/:id/cancel', protect, cancelOrder)

export default router
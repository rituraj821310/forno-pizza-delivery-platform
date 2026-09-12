import asyncHandler from '../utils/asyncHandler.js'
import ApiError from '../utils/ApiError.js'
import * as orderService from '../services/orderService.js'
import Order from '../models/Order.js'

const createOrder = asyncHandler(async (req, res) => {
  const {
  items,
  deliveryAddress,
  paymentMethod,
  razorpayOrderId,
  razorpayPaymentId,
  razorpaySignature,
} = req.body

  const order = await orderService.createOrder(
  req.user,
  {
    items,
    deliveryAddress,
    paymentMethod,
    razorpayOrderId,
    razorpayPaymentId,
    razorpaySignature,
  }
)

  res.status(201).json(order)
})

const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await orderService.getOrdersForUser(req.user._id)

  res.json({ orders })
})

const getOrder = asyncHandler(async (req, res) => {
  const order = await orderService.getOrderById(
    req.params.id,
    req.user
  )

  res.json({ order })
})

const getAllOrders = asyncHandler(async (req, res) => {
  const { status } = req.query

  const orders = await orderService.getAllOrders({ status })

  res.json({ orders })
})

const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body

  if (!Order.STATUSES.includes(status)) {
    throw ApiError.badRequest(
      `Status must be one of: ${Order.STATUSES.join(', ')}`
    )
  }

  const order = await orderService.updateStatus(
    req.params.id,
    status
  )

  res.json({ order })
})

const cancelOrder = asyncHandler(async (req, res) => {
  const order = await orderService.cancelOrder(
    req.params.id,
    req.user
  )

  res.json({ order })
})

export {
  createOrder,
  getMyOrders,
  getOrder,
  getAllOrders,
  updateOrderStatus,
  cancelOrder,
}
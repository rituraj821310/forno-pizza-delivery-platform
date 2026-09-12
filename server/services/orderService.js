import mongoose from 'mongoose'
import Order from '../models/Order.js'
import MenuItem from '../models/MenuItem.js'
import ApiError from '../utils/ApiError.js'
import {
  calculateItemPrice,
  calculateTotals,
} from './orderPricingService.js'
import paymentService from './paymentService.js'
import paymentVerificationService from './paymentVerificationService.js'
import { emitOrderUpdate } from '../sockets/index.js'

const CANCELLABLE_STATUSES = [
  'placed',
  'confirmed',
]

const ACTIVE_STATUSES = [
  'placed',
  'confirmed',
  'preparing',
  'baking',
  'out_for_delivery',
]

async function createOrder(
  user,
  {
    items,
    deliveryAddress,
    paymentMethod,
    razorpayOrderId,
    razorpayPaymentId,
    razorpaySignature,
  }
) {
  // ---------------------------------------
  // Validate order items
  // ---------------------------------------

  if (
    !Array.isArray(items) ||
    items.length === 0
  ) {
    throw ApiError.badRequest(
      'Your order needs at least one item'
    )
  }

  // ---------------------------------------
  // Validate delivery address
  // ---------------------------------------

  if (
    !deliveryAddress?.street ||
    !deliveryAddress?.city ||
    !deliveryAddress?.zip
  ) {
    throw ApiError.badRequest(
      'A complete delivery address is required'
    )
  }

  // ---------------------------------------
  // Validate payment method
  // ---------------------------------------

  if (
    paymentMethod !== 'razorpay' &&
    paymentMethod !== 'cash'
  ) {
    throw ApiError.badRequest(
      'Invalid payment method'
    )
  }

  // ---------------------------------------
  // Calculate prices from database
  // ---------------------------------------

  const pricedItems = []

  for (const item of items) {
    // Validate menu item ID
    if (
      !mongoose.isValidObjectId(
        item.menuItemId
      )
    ) {
      throw ApiError.badRequest(
        `Invalid menu item: ${item.menuItemId}`
      )
    }

    // Get actual menu item from database
    const menuItem =
      await MenuItem.findById(
        item.menuItemId
      )

    if (!menuItem) {
      throw ApiError.notFound(
        'One of the selected menu items was not found'
      )
    }

    // Check availability
    if (!menuItem.isAvailable) {
      throw ApiError.badRequest(
        `${menuItem.name} is currently unavailable`
      )
    }

    // Validate quantity
    const quantity = Number(
      item.quantity
    )

    if (
      !Number.isInteger(quantity) ||
      quantity < 1
    ) {
      throw ApiError.badRequest(
        'Quantity must be at least 1'
      )
    }

    // Default size
    const size =
      item.size || 'medium'

    // Toppings
    const toppings =
      Array.isArray(item.toppings)
        ? item.toppings
        : []

    // Calculate price using SERVER data
    const price =
      calculateItemPrice(
        menuItem.basePrice,
        size,
        toppings
      )

    pricedItems.push({
      menuItemId: menuItem._id,
      name: menuItem.name,
      size,
      toppings,
      price,
      quantity,
    })
  }

  // ---------------------------------------
  // Calculate final order totals
  // ---------------------------------------

  const pricing =
    calculateTotals(
      pricedItems
    )

  // ---------------------------------------
  // Razorpay verification
  // ---------------------------------------

  if (paymentMethod === 'razorpay') {
    // -------------------------------------
    // 1. Check required Razorpay details
    // -------------------------------------

    if (
      !razorpayOrderId ||
      !razorpayPaymentId ||
      !razorpaySignature
    ) {
      throw ApiError.badRequest(
        'Razorpay payment details are required'
      )
    }

    // -------------------------------------
    // 2. Verify Razorpay signature
    // -------------------------------------

    const isValid =
      paymentVerificationService.verifyRazorpaySignature({
        razorpayOrderId,
        razorpayPaymentId,
        razorpaySignature,
      })

    if (!isValid) {
      throw ApiError.badRequest(
        'Payment verification failed'
      )
    }

    // -------------------------------------
    // 3. Fetch Razorpay order
    // -------------------------------------

    const razorpayOrder =
      await paymentService.getRazorpayOrder(
        razorpayOrderId
      )

    if (!razorpayOrder) {
      throw ApiError.badRequest(
        'Razorpay order not found'
      )
    }

    // -------------------------------------
    // 4. Verify payment amount
    // -------------------------------------

    const expectedAmount =
      Math.round(
        pricing.total * 100
      )

    if (
      Number(razorpayOrder.amount) !==
      expectedAmount
    ) {
      throw ApiError.badRequest(
        'Payment amount does not match the order total'
      )
    }

    // -------------------------------------
    // 5. Verify Razorpay order status
    // -------------------------------------

    if (
      razorpayOrder.status !== 'paid'
    ) {
      throw ApiError.badRequest(
        'Razorpay payment has not been completed'
      )
    }

    // -------------------------------------
    // 6. Fetch actual Razorpay payment
    // -------------------------------------

    const razorpayPayment =
      await paymentService.getRazorpayPayment(
        razorpayPaymentId
      )

    if (!razorpayPayment) {
      throw ApiError.badRequest(
        'Razorpay payment not found'
      )
    }

    // -------------------------------------
    // 7. Verify payment belongs to
    //    the same Razorpay order
    // -------------------------------------

    if (
      razorpayPayment.order_id !==
      razorpayOrderId
    ) {
      throw ApiError.badRequest(
        'Payment does not belong to this Razorpay order'
      )
    }

    // -------------------------------------
    // 8. Verify payment amount
    // -------------------------------------

    if (
      Number(razorpayPayment.amount) !==
      expectedAmount
    ) {
      throw ApiError.badRequest(
        'Payment amount does not match the order total'
      )
    }

    // -------------------------------------
    // 9. Verify payment is captured
    // -------------------------------------

    if (
      razorpayPayment.status !== 'captured'
    ) {
      throw ApiError.badRequest(
        'Razorpay payment has not been captured'
      )
    }
  }

  // ---------------------------------------
  // Create order
  // ---------------------------------------

  const order =
    await Order.create({
      user: user._id,

      customerName:
        user.name,

      items:
        pricedItems,

      deliveryAddress,

      paymentMethod,

      paymentStatus:
        paymentMethod === 'razorpay'
          ? 'paid'
          : 'pending',

      razorpayOrderId:
        paymentMethod === 'razorpay'
          ? razorpayOrderId
          : null,

      razorpayPaymentId:
        paymentMethod === 'razorpay'
          ? razorpayPaymentId
          : null,

      razorpaySignature:
        paymentMethod === 'razorpay'
          ? razorpaySignature
          : null,

      ...pricing,
    })

  return order
}

// ---------------------------------------
// Get single order
// ---------------------------------------

async function getOrderById(
  orderId,
  requester
) {
  const order =
    await Order.findById(
      orderId
    )

  if (!order) {
    throw ApiError.notFound(
      'Order not found'
    )
  }

  const isOwner =
    order.user.toString() ===
    requester._id.toString()

  if (
    !isOwner &&
    requester.role !== 'admin'
  ) {
    throw ApiError.forbidden(
      'You do not have access to this order'
    )
  }

  return order
}

// ---------------------------------------
// Get user's orders
// ---------------------------------------

async function getOrdersForUser(
  userId
) {
  return Order.find({
    user: userId,
  }).sort({
    createdAt: -1,
  })
}

// ---------------------------------------
// Get all orders - Admin
// ---------------------------------------

async function getAllOrders({
  status,
} = {}) {
  const filter = status
    ? { status }
    : {}

  return Order.find(
    filter
  ).sort({
    createdAt: -1,
  })
}

// ---------------------------------------
// Update order status - Admin
// ---------------------------------------

async function updateStatus(
  orderId,
  status
) {
  const order =
    await Order.findById(
      orderId
    )

  if (!order) {
    throw ApiError.notFound(
      'Order not found'
    )
  }

  order.status =
    status

  await order.save()

  // Notify connected clients
  emitOrderUpdate(order)

  return order
}

// ---------------------------------------
// Cancel order
// ---------------------------------------

async function cancelOrder(
  orderId,
  requester
) {
  const order =
    await Order.findById(
      orderId
    )

  if (!order) {
    throw ApiError.notFound(
      'Order not found'
    )
  }

  const isOwner =
    order.user.toString() ===
    requester._id.toString()

  if (
    !isOwner &&
    requester.role !== 'admin'
  ) {
    throw ApiError.forbidden(
      'You do not have access to this order'
    )
  }

  if (
    !CANCELLABLE_STATUSES.includes(
      order.status
    )
  ) {
    throw ApiError.badRequest(
      'This order can no longer be cancelled'
    )
  }

  order.status =
    'cancelled'

  await order.save()

  // Notify connected clients
  emitOrderUpdate(order)

  return order
}

// ---------------------------------------
// Exports
// ---------------------------------------

export {
  createOrder,
  getOrderById,
  getOrdersForUser,
  getAllOrders,
  updateStatus,
  cancelOrder,
  CANCELLABLE_STATUSES,
  ACTIVE_STATUSES,
}
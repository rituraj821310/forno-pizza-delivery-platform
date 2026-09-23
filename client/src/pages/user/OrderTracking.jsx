import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { fetchOrder, cancelOrder } from '../../services/orderService.js'
import { connectSocket, disconnectSocket } from '../../services/socket.js'
import { useFetch } from '../../hooks/useFetch.js'

export default function OrderTracking() {
  const { id } = useParams()
  const navigate = useNavigate()

  const { data, loading, error, setData } = useFetch(
    () => fetchOrder(id),
    [id]
  )

  const order = data?.order ?? data

  const [cancelling, setCancelling] = useState(false)
  const [cancelError, setCancelError] = useState('')
  const [isLive, setIsLive] = useState(false)

  // --------------------------------------------------
  // Socket.IO real-time order tracking
  // --------------------------------------------------
  useEffect(() => {
    if (!id) return

    const socket = connectSocket()

    function handleConnect() {
      console.log('🟢 SOCKET CONNECTED:', socket.id)

      setIsLive(true)

      socket.emit('order:subscribe', id)

      console.log('📦 SUBSCRIBED TO ORDER:', id)
    }

    function handleDisconnect(reason) {
      console.log('🔴 SOCKET DISCONNECTED:', reason)

      setIsLive(false)
    }

    function handleConnectError(error) {
      console.error('❌ SOCKET CONNECTION ERROR:', error)
    }

    function handleOrderUpdated(updatedOrder) {
      console.log('🔥 ORDER UPDATED EVENT RECEIVED:', updatedOrder)

      const updatedId = updatedOrder?._id || updatedOrder?.id

      console.log('📌 Updated Order ID:', updatedId)
      console.log('📌 Current Order ID:', id)

      if (!updatedId || String(updatedId) !== String(id)) {
        console.log('⚠️ Order ID does not match. Ignoring update.')
        return
      }

      console.log('✅ Updating order state in UI')

      setData((prev) => {
        if (prev?.order) {
          return {
            ...prev,
            order: updatedOrder,
          }
        }

        return updatedOrder
      })
    }

    socket.on('connect', handleConnect)
    socket.on('disconnect', handleDisconnect)
    socket.on('connect_error', handleConnectError)
    socket.on('order:updated', handleOrderUpdated)

    // If socket was already connected before this effect ran
    if (socket.connected) {
      handleConnect()
    }

    return () => {
      console.log('🧹 Cleaning up order socket:', id)

      socket.off('connect', handleConnect)
      socket.off('disconnect', handleDisconnect)
      socket.off('connect_error', handleConnectError)
      socket.off('order:updated', handleOrderUpdated)

      socket.emit('order:unsubscribe', id)

      disconnectSocket()
    }
  }, [id, setData])

  // --------------------------------------------------
  // Cancel order
  // --------------------------------------------------
  async function handleCancelOrder() {
    if (!order?._id || cancelling) return

    const confirmed = window.confirm(
      'Are you sure you want to cancel this order?'
    )

    if (!confirmed) return

    try {
      setCancelling(true)
      setCancelError('')

      const response = await cancelOrder(order._id)

      const updatedOrder = response?.order ?? response

      setData((prev) => {
        if (prev?.order) {
          return {
            ...prev,
            order: updatedOrder,
          }
        }

        return updatedOrder
      })
    } catch (err) {
      console.error('Failed to cancel order:', err)

      setCancelError(
        err?.response?.data?.message ||
          err?.message ||
          'Failed to cancel order'
      )
    } finally {
      setCancelling(false)
    }
  }

  // --------------------------------------------------
  // Loading
  // --------------------------------------------------
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">
          Loading order...
        </div>
      </div>
    )
  }

  // --------------------------------------------------
  // Error
  // --------------------------------------------------
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-600">
            Unable to load order
          </h2>

          <p className="mt-2 text-gray-600">
            {error?.message || 'Something went wrong.'}
          </p>

          <button
            type="button"
            onClick={() => navigate('/orders')}
            className="mt-4 rounded-lg bg-black px-5 py-2 text-white"
          >
            Back to Orders
          </button>
        </div>
      </div>
    )
  }

  // --------------------------------------------------
  // Order not found
  // --------------------------------------------------
  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold">
            Order not found
          </h2>

          <button
            type="button"
            onClick={() => navigate('/orders')}
            className="mt-4 rounded-lg bg-black px-5 py-2 text-white"
          >
            Back to Orders
          </button>
        </div>
      </div>
    )
  }

  // --------------------------------------------------
  // Helpers
  // --------------------------------------------------
  const status = order.status || 'placed'

  const statusSteps = [
    {
      key: 'placed',
      label: 'Order Placed',
    },
    {
      key: 'confirmed',
      label: 'Confirmed',
    },
    {
      key: 'preparing',
      label: 'Preparing',
    },
    {
      key: 'out_for_delivery',
      label: 'Out for Delivery',
    },
    {
      key: 'delivered',
      label: 'Delivered',
    },
  ]

  const statusIndex = statusSteps.findIndex(
    (step) => step.key === status
  )

  const isCancelled = status === 'cancelled'

  // --------------------------------------------------
  // Render
  // --------------------------------------------------
  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto max-w-5xl">

        {/* Header */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Track Your Order
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Order #{order._id}
            </p>
          </div>

          {/* Live indicator */}
          <div
            className={`inline-flex w-fit items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium ${
              isLive
                ? 'bg-green-100 text-green-700'
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            <span
              className={`h-2 w-2 rounded-full ${
                isLive ? 'bg-green-500' : 'bg-gray-400'
              }`}
            />

            {isLive ? 'Live' : 'Offline'}
          </div>
        </div>

        {/* Real-time message */}
        <div className="mb-6 rounded-xl border border-gray-200 bg-white p-4">
          <p className="text-sm text-gray-600">
            {isLive
              ? 'Your order status will update automatically in real time.'
              : 'Real-time updates are currently unavailable. Please refresh the page if needed.'}
          </p>
        </div>

        {/* Cancel error */}
        {cancelError && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {cancelError}
          </div>
        )}

        {/* Cancelled order */}
        {isCancelled ? (
          <div className="mb-6 rounded-2xl border border-red-200 bg-white p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-red-600">
                ✕
              </div>

              <div>
                <h2 className="font-semibold text-gray-900">
                  Order Cancelled
                </h2>

                <p className="text-sm text-gray-500">
                  This order has been cancelled.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Status Timeline */}
            <div className="mb-6 rounded-2xl bg-white p-6 shadow-sm">
              <h2 className="mb-6 text-lg font-semibold text-gray-900">
                Order Status
              </h2>

              <div className="space-y-6">
                {statusSteps.map((step, index) => {
                  const completed =
                    statusIndex >= index

                  const current =
                    status === step.key

                  return (
                    <div
                      key={step.key}
                      className="flex items-start gap-4"
                    >
                      {/* Indicator */}
                      <div className="flex flex-col items-center">
                        <div
                          className={`flex h-9 w-9 items-center justify-center rounded-full border-2 text-sm font-semibold ${
                            completed
                              ? 'border-green-500 bg-green-500 text-white'
                              : 'border-gray-300 bg-white text-gray-400'
                          }`}
                        >
                          {completed ? '✓' : index + 1}
                        </div>

                        {index < statusSteps.length - 1 && (
                          <div
                            className={`mt-1 h-8 w-0.5 ${
                              statusIndex > index
                                ? 'bg-green-500'
                                : 'bg-gray-200'
                            }`}
                          />
                        )}
                      </div>

                      {/* Label */}
                      <div className="pt-1">
                        <p
                          className={`font-medium ${
                            current
                              ? 'text-green-600'
                              : completed
                              ? 'text-gray-900'
                              : 'text-gray-400'
                          }`}
                        >
                          {step.label}
                        </p>

                        {current && (
                          <p className="mt-1 text-sm text-gray-500">
                            Current status
                          </p>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </>
        )}

        {/* Order Details */}
        <div className="grid gap-6 md:grid-cols-2">

          {/* Items */}
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">
              Order Items
            </h2>

            <div className="space-y-4">
              {(order.items || []).map((item, index) => (
                <div
                  key={item._id || item.id || index}
                  className="flex items-center justify-between gap-4 border-b border-gray-100 pb-4 last:border-0 last:pb-0"
                >
                  <div>
                    <p className="font-medium text-gray-900">
                      {item.name || item.title || 'Pizza'}
                    </p>

                    <p className="text-sm text-gray-500">
                      Qty: {item.quantity || item.qty || 1}
                    </p>
                  </div>

                  <p className="font-medium text-gray-900">
                    $
                    {Number(
                      item.price || 0
                    ).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery Address */}
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">
              Delivery Address
            </h2>

            <div className="text-sm text-gray-600">
              {order.address ? (
                <>
                  <p className="font-medium text-gray-900">
                    {order.address.name ||
                      order.address.fullName ||
                      ''}
                  </p>

                  <p className="mt-1">
                    {order.address.address ||
                      order.address.street ||
                      ''}
                  </p>

                  <p>
                    {order.address.city || ''}
                    {order.address.city &&
                    order.address.postalCode
                      ? ', '
                      : ''}
                    {order.address.postalCode || ''}
                  </p>

                  {order.address.phone && (
                    <p className="mt-2">
                      Phone: {order.address.phone}
                    </p>
                  )}
                </>
              ) : (
                <p>No address information available.</p>
              )}
            </div>
          </div>

          {/* Payment */}
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">
              Payment
            </h2>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">
                  Method
                </span>

                <span className="font-medium text-gray-900">
                  {order.paymentMethod ||
                    order.payment?.method ||
                    'N/A'}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">
                  Payment Status
                </span>

                <span className="font-medium text-gray-900">
                  {order.paymentStatus ||
                    order.payment?.status ||
                    'N/A'}
                </span>
              </div>
            </div>
          </div>

          {/* Price Summary */}
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">
              Price Summary
            </h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">
                  Subtotal
                </span>

                <span>
                  $
                  {Number(
                    order.subtotal || 0
                  ).toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">
                  Delivery Fee
                </span>

                <span>
                  $
                  {Number(
                    order.deliveryFee || 0
                  ).toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">
                  Tax
                </span>

                <span>
                  $
                  {Number(
                    order.tax || 0
                  ).toFixed(2)}
                </span>
              </div>

              <div className="border-t border-gray-200 pt-3">
                <div className="flex justify-between text-base font-semibold">
                  <span>Total</span>

                  <span>
                    $
                    {Number(
                      order.total || 0
                    ).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Cancel button */}
        {!isCancelled &&
          status !== 'delivered' &&
          status !== 'out_for_delivery' && (
            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={handleCancelOrder}
                disabled={cancelling}
                className="rounded-lg border border-red-300 px-5 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {cancelling
                  ? 'Cancelling...'
                  : 'Cancel Order'}
              </button>
            </div>
          )}

        {/* Back button */}
        <div className="mt-6">
          <button
            type="button"
            onClick={() => navigate('/orders')}
            className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            ← Back to Orders
          </button>
        </div>
      </div>
    </div>
  )
}
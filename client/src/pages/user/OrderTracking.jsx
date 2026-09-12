import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  FiArrowLeft,
  FiCheckCircle,
  FiClock,
  FiCreditCard,
  FiMapPin,
  FiPackage,
  FiShield,
  FiTruck,
  FiXCircle,
} from 'react-icons/fi'

import { useFetch } from '../../hooks/useFetch.js'

import {
  fetchOrder,
  cancelOrder,
} from '../../services/orderService.js'

import {
  connectSocket,
  disconnectSocket,
} from '../../services/socket.js'

import Loader from '../../components/Loader.jsx'
import ErrorBanner from '../../components/ErrorBanner.jsx'
import OrderStatusBadge from '../../components/OrderStatusBadge.jsx'
import OrderProgress from '../../components/OrderProgress.jsx'

import { formatCurrency } from '../../utils/formatCurrency.js'
import { ORDER_STATUS } from '../../utils/constants.js'

export default function OrderTracking() {
  const { id } = useParams()

  const {
    data,
    loading,
    error,
    setData,
  } = useFetch(
    () => fetchOrder(id),
    [id]
  )

  const order = data?.order ?? data

  const [cancelling, setCancelling] = useState(false)
  const [cancelError, setCancelError] = useState('')
  const [isLive, setIsLive] = useState(false)

  // ---------------------------------------
  // Real-time order updates
  // ---------------------------------------

  useEffect(() => {
    if (!id) return

    const socket = connectSocket()

    function handleConnect() {
      setIsLive(true)

      socket.emit('order:subscribe', id)
    }

    function handleDisconnect() {
      setIsLive(false)
    }

    function handleOrderUpdated(updatedOrder) {
      const updatedId =
        updatedOrder?._id ||
        updatedOrder?.id

      if (
        !updatedId ||
        String(updatedId) !== String(id)
      ) {
        return
      }

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

    socket.on(
      'disconnect',
      handleDisconnect
    )

    socket.on(
      'order:updated',
      handleOrderUpdated
    )

    if (socket.connected) {
      handleConnect()
    }

    return () => {
      socket.off(
        'connect',
        handleConnect
      )

      socket.off(
        'disconnect',
        handleDisconnect
      )

      socket.off(
        'order:updated',
        handleOrderUpdated
      )

      socket.emit(
        'order:unsubscribe',
        id
      )

      disconnectSocket()
    }
  }, [id, setData])

  // ---------------------------------------
  // Cancel order
  // ---------------------------------------

  async function handleCancel() {
    if (cancelling) return

    const confirmed = window.confirm(
      'Are you sure you want to cancel this order?'
    )

    if (!confirmed) return

    setCancelling(true)
    setCancelError('')

    try {
      const updated = await cancelOrder(id)

      setData((prev) => {
        if (prev?.order) {
          return {
            ...prev,
            order: updated,
          }
        }

        return updated
      })
    } catch (err) {
      setCancelError(
        err?.response?.data?.message ||
          'Unable to cancel this order.'
      )
    } finally {
      setCancelling(false)
    }
  }

  // ---------------------------------------
  // Loading
  // ---------------------------------------

  if (loading) {
    return (
      <Loader
        fullScreen
        label="Loading your order..."
      />
    )
  }

  // ---------------------------------------
  // Error
  // ---------------------------------------

  if (error || !order) {
    return (
      <div className="min-h-[70vh] bg-flour px-5 py-16 sm:px-8">
        <div className="mx-auto max-w-2xl">
          <ErrorBanner
            message={
              error ||
              'Order not found.'
            }
          />

          <Link
            to="/orders"
            className="btn-secondary mt-6 inline-flex"
          >
            Back to orders
          </Link>
        </div>
      </div>
    )
  }

  // ---------------------------------------
  // Status helpers
  // ---------------------------------------

  const canCancel = [
    ORDER_STATUS.PLACED,
    ORDER_STATUS.CONFIRMED,
  ].includes(order.status)

  const isDelivered =
    order.status === ORDER_STATUS.DELIVERED

  const isCancelled =
    order.status === ORDER_STATUS.CANCELLED

  const orderId = String(
    order._id || order.id
  )

  const shortOrderId = orderId
    .slice(-6)
    .toUpperCase()

  // ---------------------------------------
  // Payment helpers
  // ---------------------------------------

  const paymentMethod =
    order.paymentMethod === 'razorpay'
      ? 'Razorpay'
      : 'Cash on delivery'

  const paymentStatus =
    order.paymentStatus || 'pending'

  const paymentStatusLabel =
    paymentStatus === 'paid'
      ? 'Paid'
      : paymentStatus === 'failed'
        ? 'Failed'
        : paymentStatus === 'refunded'
          ? 'Refunded'
          : 'Pending'

  // ---------------------------------------
  // Render
  // ---------------------------------------

  return (
    <div className="min-h-screen bg-flour">
      <div className="mx-auto max-w-4xl px-5 py-10 sm:px-8 sm:py-14">

        {/* Back */}
        <Link
          to="/orders"
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-char/50 transition-colors hover:text-tomato"
        >
          <FiArrowLeft size={15} />
          Back to my orders
        </Link>

        {/* Header */}
        <div className="mb-8 rounded-[2rem] border border-char/10 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <p className="label-sm text-tomato">
                  Order #{shortOrderId}
                </p>

                {/* Live indicator */}
                {isLive && !isDelivered && !isCancelled && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-basil/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-basil-dark">
                    <span className="h-1.5 w-1.5 rounded-full bg-basil" />
                    Live
                  </span>
                )}
              </div>

              <h1 className="mt-2 font-display text-3xl font-semibold text-char sm:text-4xl">
                {isCancelled
                  ? 'Order cancelled'
                  : isDelivered
                    ? 'Order delivered'
                    : 'Tracking your order'}
              </h1>

              <p className="mt-2 text-sm leading-relaxed text-char/50">
                {isCancelled
                  ? 'This order has been cancelled.'
                  : isDelivered
                    ? 'Enjoy your pizza! Thanks for ordering with Forno.'
                    : 'Your order status updates automatically in real time.'}
              </p>
            </div>

            <OrderStatusBadge
              status={order.status}
            />
          </div>
        </div>

        {/* Cancelled state */}
        {isCancelled && (
          <div className="mb-8 rounded-[2rem] border border-tomato/20 bg-tomato/5 p-6 sm:p-8">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-tomato/10 text-tomato">
                <FiXCircle size={22} />
              </div>

              <div>
                <h2 className="font-display text-lg font-semibold text-char">
                  This order was cancelled
                </h2>

                <p className="mt-1 text-sm leading-relaxed text-char/55">
                  If you were charged for this order, please check
                  your payment status below.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Delivered state */}
        {isDelivered && (
          <div className="mb-8 rounded-[2rem] border border-basil/20 bg-basil/5 p-6 sm:p-8">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-basil/10 text-basil-dark">
                <FiCheckCircle size={22} />
              </div>

              <div>
                <h2 className="font-display text-lg font-semibold text-char">
                  Your pizza has arrived!
                </h2>

                <p className="mt-1 text-sm leading-relaxed text-char/55">
                  We hope you enjoy every bite.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Order progress */}
        {!isCancelled && (
          <div className="card mb-8 p-6 sm:p-8">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-char/35">
                  Live progress
                </p>

                <h2 className="mt-1 font-display text-xl font-semibold">
                  Your pizza journey
                </h2>
              </div>

              {!isDelivered && (
                <FiClock
                  className="text-tomato"
                  size={21}
                />
              )}
            </div>

            <OrderProgress
              status={order.status}
            />
          </div>
        )}

        {/* Delivery + Items */}
        <div className="mb-8 grid gap-6 sm:grid-cols-2">

          {/* Delivery */}
          <div className="card p-6">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-tomato/10 text-tomato">
                <FiMapPin size={18} />
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-char/35">
                  Delivery
                </p>

                <h2 className="font-display font-semibold">
                  Delivering to
                </h2>
              </div>
            </div>

            <p className="text-sm leading-relaxed text-char/70">
              {order.deliveryAddress?.street}
              <br />
              {order.deliveryAddress?.city}{' '}
              {order.deliveryAddress?.zip}
            </p>

            {order.deliveryAddress?.instructions && (
              <div className="mt-4 rounded-xl bg-char/5 p-3">
                <p className="text-xs font-semibold text-char/45">
                  Delivery instructions
                </p>

                <p className="mt-1 text-xs leading-relaxed text-char/60">
                  {order.deliveryAddress.instructions}
                </p>
              </div>
            )}
          </div>

          {/* Items */}
          <div className="card p-6">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cheese/20 text-char">
                <FiPackage size={18} />
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-char/35">
                  Order
                </p>

                <h2 className="font-display font-semibold">
                  Items
                </h2>
              </div>
            </div>

            <ul className="flex flex-col gap-3">
              {order.items?.map((item, idx) => (
                <li
                  key={`${item.menuItemId || item.name}-${idx}`}
                  className="flex justify-between gap-4 border-b border-char/8 pb-3 last:border-0 last:pb-0"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-char/75">
                      {item.quantity}× {item.name}
                    </p>

                    {item.size && (
                      <p className="mt-0.5 text-xs capitalize text-char/40">
                        {item.size}

                        {item.toppings?.length
                          ? ` • ${item.toppings.length} toppings`
                          : ''}
                      </p>
                    )}
                  </div>

                  <span className="shrink-0 text-sm font-semibold text-char">
                    {formatCurrency(
                      item.price * item.quantity
                    )}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Order summary */}
        <div className="card mb-8 p-6 sm:p-7">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-basil/10 text-basil-dark">
              <FiTruck size={18} />
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-char/35">
                Price
              </p>

              <h2 className="font-display font-semibold">
                Order summary
              </h2>
            </div>
          </div>

          <div className="space-y-3 text-sm">
            <SummaryRow
              label="Subtotal"
              value={formatCurrency(order.subtotal)}
            />

            <SummaryRow
              label="Delivery"
              value={formatCurrency(order.deliveryFee)}
            />

            <SummaryRow
              label="Tax"
              value={formatCurrency(order.tax)}
            />

            <div className="my-4 h-px bg-char/10" />

            <div className="flex items-center justify-between">
              <span className="font-semibold text-char">
                Total
              </span>

              <span className="font-display text-2xl font-semibold text-char">
                {formatCurrency(order.total)}
              </span>
            </div>
          </div>
        </div>

        {/* Payment */}
        <div className="card mb-8 p-6 sm:p-7">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-tomato/10 text-tomato">
              <FiCreditCard size={18} />
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-char/35">
                Payment
              </p>

              <h2 className="font-display font-semibold">
                Payment details
              </h2>
            </div>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-char">
                {paymentMethod}
              </p>

              <p className="mt-1 text-xs text-char/45">
                Payment status
              </p>
            </div>

            <span
              className={`
                inline-flex
                w-fit
                items-center
                rounded-full
                px-3
                py-1.5
                text-xs
                font-bold
                capitalize
                ${
                  paymentStatus === 'paid'
                    ? 'bg-basil/10 text-basil-dark'
                    : paymentStatus === 'failed'
                      ? 'bg-tomato/10 text-tomato-dark'
                      : paymentStatus === 'refunded'
                        ? 'bg-purple-100 text-purple-700'
                        : 'bg-char/5 text-char/60'
                }
              `}
            >
              {paymentStatusLabel}
            </span>
          </div>

          <div className="mt-5 flex items-center gap-2 border-t border-char/8 pt-4 text-xs text-char/40">
            <FiShield size={14} />
            Payment information is securely handled.
          </div>
        </div>

        {/* Cancellation error */}
        {cancelError && (
          <div className="mb-6">
            <ErrorBanner
              message={cancelError}
            />
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-wrap gap-3">
          <Link
            to="/orders"
            className="btn-secondary"
          >
            All orders
          </Link>

          {!isCancelled && !isDelivered && canCancel && (
            <button
              type="button"
              onClick={handleCancel}
              disabled={cancelling}
              className="btn-ghost text-tomato disabled:cursor-not-allowed disabled:opacity-50"
            >
              {cancelling
                ? 'Cancelling...'
                : 'Cancel order'}
            </button>
          )}

          {(isDelivered || isCancelled) && (
            <Link
              to="/menu"
              className="btn-primary"
            >
              Order again
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}

function SummaryRow({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-4 text-char/60">
      <span>{label}</span>

      <span className="font-medium text-char/75">
        {value}
      </span>
    </div>
  )
}
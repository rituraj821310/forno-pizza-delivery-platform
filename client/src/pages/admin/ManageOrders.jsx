import { useMemo, useState } from 'react'
import {
  FiShoppingBag,
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiCreditCard,
  FiRefreshCw,
  FiEye,
  FiX,
  FiMapPin,
  FiUser,
  FiPackage,
} from 'react-icons/fi'

import { useFetch } from '../../hooks/useFetch.js'

import {
  fetchAllOrders,
  updateOrderStatus,
} from '../../services/orderService.js'

import Loader from '../../components/Loader.jsx'
import EmptyState from '../../components/EmptyState.jsx'
import OrderStatusBadge from '../../components/OrderStatusBadge.jsx'

import { formatCurrency } from '../../utils/formatCurrency.js'

import {
  ORDER_STATUS_SEQUENCE,
  ORDER_STATUS_LABELS,
} from '../../utils/constants.js'

const FILTER_OPTIONS = [
  {
    value: 'all',
    label: 'All orders',
  },

  ...ORDER_STATUS_SEQUENCE.map((status) => ({
    value: status,
    label: ORDER_STATUS_LABELS[status],
  })),

  {
    value: 'cancelled',
    label: 'Cancelled',
  },
]

function formatDate(date) {
  if (!date) return '—'

  return new Date(date).toLocaleString('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
}

function getItemCount(order) {
  if (!Array.isArray(order.items)) {
    return 0
  }

  return order.items.reduce(
    (total, item) =>
      total + Number(item.quantity || 0),
    0
  )
}

function getPaymentLabel(order) {
  if (order.paymentMethod === 'razorpay') {
    return 'Razorpay'
  }

  if (order.paymentMethod === 'cash') {
    return 'Cash'
  }

  return order.paymentMethod || '—'
}

function getPaymentStatusClass(status) {
  if (status === 'paid') {
    return 'text-green-700 bg-green-500/10'
  }

  if (status === 'failed') {
    return 'text-red-700 bg-red-500/10'
  }

  if (status === 'refunded') {
    return 'text-purple-700 bg-purple-500/10'
  }

  return 'text-amber-700 bg-amber-500/10'
}

function getAddressText(address) {
  if (!address) {
    return 'No delivery address provided'
  }

  if (typeof address === 'string') {
    return address
  }

  return [
    address.street,
    address.city,
    address.state,
    address.postalCode,
    address.zipCode,
  ]
    .filter(Boolean)
    .join(', ')
}

function getToppingNames(toppings) {
  if (!Array.isArray(toppings) || toppings.length === 0) {
    return 'No extra toppings'
  }

  return toppings.join(', ')
}

export default function ManageOrders() {
  const {
    data,
    loading,
    setData,
    error,
    refetch,
  } = useFetch(
    () => fetchAllOrders(),
    []
  )

  const orders = data?.orders ?? data ?? []

  const [updatingId, setUpdatingId] = useState(null)
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [statusError, setStatusError] = useState('')
  const [refreshing, setRefreshing] = useState(false)

  // Selected order for details modal
  const [selectedOrder, setSelectedOrder] = useState(null)

  // ---------------------------------------
  // Order statistics
  // ---------------------------------------

  const statistics = useMemo(() => {
    const totalOrders = orders.length

    const activeOrders = orders.filter((order) =>
      [
        'placed',
        'confirmed',
        'preparing',
        'baking',
        'out_for_delivery',
      ].includes(order.status)
    ).length

    const deliveredOrders = orders.filter(
      (order) => order.status === 'delivered'
    ).length

    const cancelledOrders = orders.filter(
      (order) => order.status === 'cancelled'
    ).length

    const paidOrders = orders.filter(
      (order) => order.paymentStatus === 'paid'
    )

    const paidRevenue = paidOrders.reduce(
      (total, order) =>
        total + Number(order.total || 0),
      0
    )

    const pendingPayments = orders.filter(
      (order) => order.paymentStatus === 'pending'
    ).length

    return {
      totalOrders,
      activeOrders,
      deliveredOrders,
      cancelledOrders,
      paidRevenue,
      pendingPayments,
    }
  }, [orders])

  // ---------------------------------------
  // Filter orders
  // ---------------------------------------

  const filteredOrders = useMemo(() => {
    if (selectedFilter === 'all') {
      return orders
    }

    return orders.filter(
      (order) => order.status === selectedFilter
    )
  }, [orders, selectedFilter])

  // ---------------------------------------
  // Refresh
  // ---------------------------------------

  async function handleRefresh() {
    try {
      setRefreshing(true)
      setStatusError('')

      await refetch()
    } catch (error) {
      console.error(
        '[admin orders] refresh failed:',
        error
      )
    } finally {
      setRefreshing(false)
    }
  }

  // ---------------------------------------
  // Update order status
  // ---------------------------------------

  async function handleStatusChange(order, status) {
    const id = order._id || order.id

    if (!id) return

    if (order.status === status) {
      return
    }

    setUpdatingId(id)
    setStatusError('')

    try {
      await updateOrderStatus(id, status)

      setData((prev) => {
        const list = prev?.orders ?? prev ?? []

        const updatedList = list.map((currentOrder) => {
          const currentId =
            currentOrder._id || currentOrder.id

          if (currentId === id) {
            return {
              ...currentOrder,
              status,
            }
          }

          return currentOrder
        })

        if (prev?.orders) {
          return {
            ...prev,
            orders: updatedList,
          }
        }

        return updatedList
      })

      // Also update the currently opened modal
      setSelectedOrder((current) => {
        if (!current) return current

        const currentId =
          current._id || current.id

        if (currentId !== id) {
          return current
        }

        return {
          ...current,
          status,
        }
      })
    } catch (error) {
      console.error(
        '[admin orders] status update failed:',
        error
      )

      setStatusError(
        error?.response?.data?.message ||
          'Failed to update order status'
      )
    } finally {
      setUpdatingId(null)
    }
  }

  // ---------------------------------------
  // Loading
  // ---------------------------------------

  if (loading) {
    return (
      <div>
        <h1 className="mb-8 text-2xl font-semibold">
          Orders
        </h1>

        <Loader label="Loading orders..." />
      </div>
    )
  }

  // ---------------------------------------
  // Page
  // ---------------------------------------

  return (
    <div className="space-y-7">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-tomato">
            Admin
          </p>

          <h1 className="mt-1 text-3xl font-black tracking-tight text-slate-900">
            Order Management
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Monitor orders and update their delivery status.
          </p>
        </div>

        <button
          type="button"
          onClick={handleRefresh}
          disabled={refreshing}
          className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <FiRefreshCw
            className={refreshing ? 'animate-spin' : ''}
          />

          Refresh
        </button>
      </div>

      {/* Statistics */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {/* Total */}
        <div className="card p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-slate-500">
                Total Orders
              </p>

              <p className="mt-2 text-3xl font-black text-slate-900">
                {statistics.totalOrders}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-600">
              <FiShoppingBag size={21} />
            </div>
          </div>
        </div>

        {/* Active */}
        <div className="card p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-slate-500">
                Active Orders
              </p>

              <p className="mt-2 text-3xl font-black text-slate-900">
                {statistics.activeOrders}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
              <FiClock size={21} />
            </div>
          </div>
        </div>

        {/* Delivered */}
        <div className="card p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-slate-500">
                Delivered
              </p>

              <p className="mt-2 text-3xl font-black text-slate-900">
                {statistics.deliveredOrders}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-green-50 text-green-600">
              <FiCheckCircle size={21} />
            </div>
          </div>
        </div>

        {/* Cancelled */}
        <div className="card p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-slate-500">
                Cancelled
              </p>

              <p className="mt-2 text-3xl font-black text-slate-900">
                {statistics.cancelledOrders}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-red-50 text-red-600">
              <FiXCircle size={21} />
            </div>
          </div>
        </div>
      </div>

      {/* Revenue + payments */}
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-3xl bg-slate-950 p-6 text-white shadow-lg">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-slate-400">
                Paid Revenue
              </p>

              <p className="mt-2 text-3xl font-black">
                {formatCurrency(statistics.paidRevenue)}
              </p>

              <p className="mt-2 text-xs text-slate-500">
                Calculated from successfully paid orders
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10">
              <FiCreditCard size={21} />
            </div>
          </div>
        </div>

        <div className="card p-6">
          <p className="text-sm text-slate-500">
            Pending Payments
          </p>

          <p className="mt-2 text-3xl font-black text-slate-900">
            {statistics.pendingPayments}
          </p>

          <p className="mt-2 text-xs text-slate-400">
            Orders waiting for payment completion
          </p>
        </div>
      </div>

      {/* Error */}
      {(error || statusError) && (
        <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-700">
          {statusError ||
            error?.message ||
            'Failed to load orders'}
        </div>
      )}

      {/* Filter */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-black text-slate-900">
            Orders
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            {filteredOrders.length} order
            {filteredOrders.length !== 1 ? 's' : ''} shown
          </p>
        </div>

        <select
          value={selectedFilter}
          onChange={(event) =>
            setSelectedFilter(event.target.value)
          }
          className="input-field w-full sm:w-auto"
        >
          {FILTER_OPTIONS.map((option) => (
            <option
              key={option.value}
              value={option.value}
            >
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Empty state */}
      {orders.length === 0 ? (
        <EmptyState
          title="No orders yet"
          message="New customer orders will appear here."
        />
      ) : filteredOrders.length === 0 ? (
        <EmptyState
          title="No matching orders"
          message="There are no orders with this status."
        />
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1180px] text-sm">
              <thead>
                <tr className="border-b border-char/10 bg-char/[0.02] text-left text-char/50">
                  <th className="px-5 py-4 font-medium">
                    Order
                  </th>

                  <th className="px-5 py-4 font-medium">
                    Customer
                  </th>

                  <th className="px-5 py-4 font-medium">
                    Items
                  </th>

                  <th className="px-5 py-4 font-medium">
                    Payment
                  </th>

                  <th className="px-5 py-4 font-medium">
                    Total
                  </th>

                  <th className="px-5 py-4 font-medium">
                    Status
                  </th>

                  <th className="px-5 py-4 font-medium">
                    Update
                  </th>

                  <th className="px-5 py-4 font-medium">
                    Date
                  </th>

                  <th className="px-5 py-4 font-medium">
                    Details
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-char/10">
                {filteredOrders.map((order) => {
                  const id =
                    order._id ||
                    order.id

                  const itemCount =
                    getItemCount(order)

                  const paymentStatus =
                    order.paymentStatus ||
                    'pending'

                  const isUpdating =
                    updatingId === id

                  const isFinalOrder =
                    order.status === 'delivered' ||
                    order.status === 'cancelled'

                  return (
                    <tr
                      key={id}
                      className="transition hover:bg-char/[0.02]"
                    >
                      {/* Order */}
                      <td className="px-5 py-4">
                        <div className="font-semibold">
                          #
                          {String(id)
                            .slice(-6)
                            .toUpperCase()}
                        </div>

                        <div className="mt-1 text-xs text-char/40">
                          {String(id)}
                        </div>
                      </td>

                      {/* Customer */}
                      <td className="px-5 py-4">
                        <div className="font-medium">
                          {order.customerName ||
                            order.user?.name ||
                            '—'}
                        </div>

                        {order.user?.email && (
                          <div className="mt-1 text-xs text-char/50">
                            {order.user.email}
                          </div>
                        )}
                      </td>

                      {/* Items */}
                      <td className="px-5 py-4">
                        <div className="font-medium">
                          {itemCount}{' '}
                          {itemCount === 1
                            ? 'item'
                            : 'items'}
                        </div>

                        {Array.isArray(order.items) &&
                          order.items
                            .slice(0, 2)
                            .map((item, index) => (
                              <div
                                key={`${item.menuItemId || item.name}-${index}`}
                                className="mt-1 max-w-[180px] truncate text-xs text-char/50"
                              >
                                {item.quantity}× {item.name}
                              </div>
                            ))}

                        {order.items?.length > 2 && (
                          <div className="mt-1 text-xs text-char/40">
                            +
                            {order.items.length - 2}{' '}
                            more
                          </div>
                        )}
                      </td>

                      {/* Payment */}
                      <td className="px-5 py-4">
                        <div className="font-medium">
                          {getPaymentLabel(order)}
                        </div>

                        <span
                          className={`mt-1 inline-flex rounded-full px-2 py-1 text-xs font-medium ${getPaymentStatusClass(
                            paymentStatus
                          )}`}
                        >
                          {paymentStatus}
                        </span>
                      </td>

                      {/* Total */}
                      <td className="px-5 py-4 font-semibold">
                        {formatCurrency(order.total)}
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4">
                        <OrderStatusBadge
                          status={order.status}
                        />
                      </td>

                      {/* Update */}
                      <td className="px-5 py-4">
                        <select
                          className="input-field !w-auto !px-3 !py-2 text-sm"
                          value={order.status}
                          disabled={
                            isUpdating ||
                            isFinalOrder
                          }
                          onChange={(event) =>
                            handleStatusChange(
                              order,
                              event.target.value
                            )
                          }
                        >
                          {ORDER_STATUS_SEQUENCE.map(
                            (status) => (
                              <option
                                key={status}
                                value={status}
                              >
                                {
                                  ORDER_STATUS_LABELS[
                                    status
                                  ]
                                }
                              </option>
                            )
                          )}

                          <option value="cancelled">
                            Cancelled
                          </option>
                        </select>

                        {isUpdating && (
                          <div className="mt-1 text-xs text-char/40">
                            Updating...
                          </div>
                        )}

                        {isFinalOrder && (
                          <div className="mt-1 text-xs text-char/40">
                            Final status
                          </div>
                        )}
                      </td>

                      {/* Date */}
                      <td className="px-5 py-4 text-xs text-char/60">
                        {formatDate(order.createdAt)}
                      </td>

                      {/* Details */}
                      <td className="px-5 py-4">
                        <button
                          type="button"
                          onClick={() =>
                            setSelectedOrder(order)
                          }
                          className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-3 py-2 text-xs font-semibold text-white transition hover:bg-slate-800"
                        >
                          <FiEye size={15} />
                          View
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* --------------------------------------- */}
      {/* Order Details Modal */}
      {/* --------------------------------------- */}

      {selectedOrder && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedOrder(null)
            }
          }}
        >
          <div className="max-h-[90vh] w-full max-w-3xl overflow-hidden rounded-3xl bg-white shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-100 px-6 py-5">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-tomato">
                  Order Details
                </p>

                <h2 className="mt-1 text-2xl font-black text-slate-900">
                  #
                  {String(
                    selectedOrder._id ||
                      selectedOrder.id
                  )
                    .slice(-6)
                    .toUpperCase()}
                </h2>

                <p className="mt-1 text-xs text-slate-400">
                  {formatDate(
                    selectedOrder.createdAt
                  )}
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setSelectedOrder(null)
                }
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600 transition hover:bg-slate-200"
              >
                <FiX size={20} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="max-h-[calc(90vh-100px)] overflow-y-auto p-6">
              <div className="space-y-6">
                {/* Customer + Status */}
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                    <div className="flex items-center gap-2 text-slate-500">
                      <FiUser size={17} />

                      <span className="text-xs font-semibold uppercase tracking-wide">
                        Customer
                      </span>
                    </div>

                    <p className="mt-3 font-bold text-slate-900">
                      {selectedOrder.customerName ||
                        selectedOrder.user?.name ||
                        '—'}
                    </p>

                    {selectedOrder.user?.email && (
                      <p className="mt-1 text-sm text-slate-500">
                        {selectedOrder.user.email}
                      </p>
                    )}
                  </div>

                  <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                    <div className="flex items-center gap-2 text-slate-500">
                      <FiPackage size={17} />

                      <span className="text-xs font-semibold uppercase tracking-wide">
                        Order Status
                      </span>
                    </div>

                    <div className="mt-3">
                      <OrderStatusBadge
                        status={
                          selectedOrder.status
                        }
                      />
                    </div>
                  </div>
                </div>

                {/* Delivery Address */}
                <div className="rounded-2xl border border-slate-100 p-5">
                  <div className="flex items-center gap-2">
                    <FiMapPin className="text-tomato" />

                    <h3 className="font-bold text-slate-900">
                      Delivery Address
                    </h3>
                  </div>

                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    {getAddressText(
                      selectedOrder.deliveryAddress
                    )}
                  </p>
                </div>

                {/* Items */}
                <div>
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="font-bold text-slate-900">
                      Ordered Items
                    </h3>

                    <span className="text-sm text-slate-400">
                      {getItemCount(
                        selectedOrder
                      )}{' '}
                      items
                    </span>
                  </div>

                  <div className="overflow-hidden rounded-2xl border border-slate-100">
                    {Array.isArray(
                      selectedOrder.items
                    ) &&
                      selectedOrder.items.map(
                        (item, index) => (
                          <div
                            key={`${item.menuItemId || item.name}-${index}`}
                            className="border-b border-slate-100 p-4 last:border-b-0"
                          >
                            <div className="flex items-start justify-between gap-4">
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="rounded-lg bg-slate-100 px-2 py-1 text-xs font-bold text-slate-600">
                                    {item.quantity}×
                                  </span>

                                  <h4 className="font-bold text-slate-900">
                                    {item.name}
                                  </h4>
                                </div>

                                <p className="mt-2 text-sm text-slate-500">
                                  Size:{' '}
                                  <span className="font-medium capitalize text-slate-700">
                                    {item.size ||
                                      'medium'}
                                  </span>
                                </p>

                                <p className="mt-1 text-sm text-slate-500">
                                  Toppings:{' '}
                                  <span className="font-medium text-slate-700">
                                    {getToppingNames(
                                      item.toppings
                                    )}
                                  </span>
                                </p>
                              </div>

                              <p className="whitespace-nowrap font-bold text-slate-900">
                                {formatCurrency(
                                  Number(
                                    item.price ||
                                      0
                                  ) *
                                    Number(
                                      item.quantity ||
                                        0
                                    )
                                )}
                              </p>
                            </div>
                          </div>
                        )
                      )}
                  </div>
                </div>

                {/* Payment */}
                <div className="rounded-2xl border border-slate-100 p-5">
                  <h3 className="font-bold text-slate-900">
                    Payment
                  </h3>

                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    <div>
                      <p className="text-xs text-slate-400">
                        Method
                      </p>

                      <p className="mt-1 font-semibold text-slate-800">
                        {getPaymentLabel(
                          selectedOrder
                        )}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-slate-400">
                        Payment Status
                      </p>

                      <span
                        className={`mt-1 inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${getPaymentStatusClass(
                          selectedOrder.paymentStatus ||
                            'pending'
                        )}`}
                      >
                        {selectedOrder.paymentStatus ||
                          'pending'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="rounded-2xl bg-slate-950 p-5 text-white">
                  <h3 className="font-bold">
                    Price Breakdown
                  </h3>

                  <div className="mt-4 space-y-3 text-sm">
                    <div className="flex justify-between text-slate-400">
                      <span>Subtotal</span>

                      <span>
                        {formatCurrency(
                          selectedOrder.subtotal ??
                            0
                        )}
                      </span>
                    </div>

                    <div className="flex justify-between text-slate-400">
                      <span>Delivery Fee</span>

                      <span>
                        {formatCurrency(
                          selectedOrder.deliveryFee ??
                            0
                        )}
                      </span>
                    </div>

                    <div className="flex justify-between text-slate-400">
                      <span>Tax</span>

                      <span>
                        {formatCurrency(
                          selectedOrder.tax ?? 0
                        )}
                      </span>
                    </div>

                    <div className="border-t border-white/10 pt-3">
                      <div className="flex justify-between">
                        <span className="font-semibold">
                          Total
                        </span>

                        <span className="text-xl font-black">
                          {formatCurrency(
                            selectedOrder.total ??
                              0
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Status Controls */}
                <div>
                  <h3 className="mb-3 font-bold text-slate-900">
                    Update Order Status
                  </h3>

                  {selectedOrder.status !==
                    'delivered' &&
                    selectedOrder.status !==
                      'cancelled' ? (
                    <select
                      className="input-field w-full"
                      value={
                        selectedOrder.status
                      }
                      disabled={
                        updatingId ===
                        (selectedOrder._id ||
                          selectedOrder.id)
                      }
                      onChange={(event) =>
                        handleStatusChange(
                          selectedOrder,
                          event.target.value
                        )
                      }
                    >
                      {ORDER_STATUS_SEQUENCE.map(
                        (status) => (
                          <option
                            key={status}
                            value={status}
                          >
                            {
                              ORDER_STATUS_LABELS[
                                status
                              ]
                            }
                          </option>
                        )
                      )}

                      <option value="cancelled">
                        Cancelled
                      </option>
                    </select>
                  ) : (
                    <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-500">
                      This order has reached a final status.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
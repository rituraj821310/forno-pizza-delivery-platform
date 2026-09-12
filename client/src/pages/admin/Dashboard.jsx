import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  FiShoppingBag,
  FiUsers,
  FiCoffee,
  FiClock,
  FiArrowRight,
  FiRefreshCw,
} from 'react-icons/fi'

import { fetchDashboardStats } from '../../services/adminService.js'
import { formatCurrency } from '../../utils/formatCurrency.js'
import Loader from '../../components/Loader.jsx'
import ErrorBanner from '../../components/ErrorBanner.jsx'
import OrderStatusBadge from '../../components/OrderStatusBadge.jsx'

const STATUS_LABELS = {
  placed: 'Placed',
  confirmed: 'Confirmed',
  preparing: 'Preparing',
  baking: 'Baking',
  out_for_delivery: 'Out for delivery',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
}

function formatDate(date) {
  return new Date(date).toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function getItemCount(items = []) {
  return items.reduce(
    (total, item) => total + item.quantity,
    0
  )
}

export default function Dashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  async function loadDashboard() {
    try {
      setLoading(true)
      setError('')

      const result = await fetchDashboardStats()

      setData(result)
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          'Failed to load dashboard.'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDashboard()
  }, [])

  const stats = data?.stats

  const statCards = useMemo(
    () => [
      {
        label: 'Total Orders',
        value: stats?.totalOrders ?? 0,
        icon: FiShoppingBag,
        description: 'All orders placed',
      },
      {
        label: 'Total Customers',
        value: stats?.totalCustomers ?? 0,
        icon: FiUsers,
        description: 'Registered customers',
      },
      {
        label: 'Menu Items',
        value: stats?.totalMenuItems ?? 0,
        icon: FiCoffee,
        description: 'Items in menu',
      },
      {
        label: 'Active Orders',
        value: stats?.activeOrders ?? 0,
        icon: FiClock,
        description: 'Currently in progress',
      },
    ],
    [stats]
  )

  if (loading && !data) {
    return (
      <Loader
        fullScreen
        label="Loading dashboard..."
      />
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-tomato">
            Admin
          </p>

          <h1 className="mt-1 text-3xl font-black tracking-tight text-slate-900">
            Dashboard
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Here's what's happening with your pizza business.
          </p>
        </div>

        <button
          type="button"
          onClick={loadDashboard}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <FiRefreshCw
            className={loading ? 'animate-spin' : ''}
          />
          Refresh
        </button>
      </div>

      {/* Error */}
      {error && (
        <ErrorBanner message={error} />
      )}

      {/* Stats */}
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((card) => {
          const Icon = card.icon

          return (
            <div
              key={card.label}
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    {card.label}
                  </p>

                  <p className="mt-3 text-3xl font-black text-slate-900">
                    {card.value}
                  </p>
                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-tomato/10 text-tomato">
                  <Icon size={22} />
                </div>
              </div>

              <p className="mt-4 text-xs text-slate-400">
                {card.description}
              </p>
            </div>
          )
        })}
      </div>

      {/* Revenue */}
      <div className="rounded-3xl bg-slate-950 p-7 text-white shadow-lg">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium text-slate-400">
              Total Revenue
            </p>

            <h2 className="mt-2 text-4xl font-black">
              {formatCurrency(stats?.totalRevenue ?? 0)}
            </h2>
          </div>

          <p className="text-sm text-slate-400">
            Based on paid orders
          </p>
        </div>
      </div>

      {/* Recent Orders */}
      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-slate-100 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-black text-slate-900">
              Recent Orders
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Your latest customer orders
            </p>
          </div>

          <Link
            to="/admin/orders"
            className="inline-flex items-center gap-2 text-sm font-bold text-tomato transition hover:gap-3"
          >
            View all orders
            <FiArrowRight />
          </Link>
        </div>

        {data?.recentOrders?.length ? (
          <div className="divide-y divide-slate-100">
            {data.recentOrders.map((order) => (
              <div
                key={order._id}
                className="flex flex-col gap-4 px-6 py-5 lg:flex-row lg:items-center lg:justify-between"
              >
                {/* Customer */}
                <div className="min-w-0">
                  <p className="font-bold text-slate-900">
                    {order.customerName}
                  </p>

                  <p className="mt-1 truncate text-xs text-slate-400">
                    #{order._id}
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    {getItemCount(order.items)} item
                    {getItemCount(order.items) !== 1
                      ? 's'
                      : ''}
                    {' • '}
                    {formatDate(order.createdAt)}
                  </p>
                </div>

                {/* Status */}
                <div className="flex items-center gap-4">
                  <OrderStatusBadge
                    status={order.status}
                    label={
                      STATUS_LABELS[order.status] ||
                      order.status
                    }
                  />

                  <div className="text-right">
                    <p className="font-black text-slate-900">
                      {formatCurrency(order.total)}
                    </p>

                    <p className="mt-1 text-xs capitalize text-slate-400">
                      {order.paymentStatus}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="px-6 py-12 text-center">
            <FiShoppingBag
              className="mx-auto text-slate-300"
              size={36}
            />

            <p className="mt-4 font-semibold text-slate-700">
              No orders yet
            </p>

            <p className="mt-1 text-sm text-slate-400">
              New orders will appear here.
            </p>
          </div>
        )}
      </section>
    </div>
  )
}
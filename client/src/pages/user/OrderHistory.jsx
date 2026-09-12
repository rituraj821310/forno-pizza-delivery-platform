import { Link } from 'react-router-dom'
import { useFetch } from '../../hooks/useFetch.js'
import { fetchMyOrders } from '../../services/orderService.js'
import Loader from '../../components/Loader.jsx'
import EmptyState from '../../components/EmptyState.jsx'
import OrderStatusBadge from '../../components/OrderStatusBadge.jsx'
import ErrorBanner from '../../components/ErrorBanner.jsx'
import { formatCurrency } from '../../utils/formatCurrency.js'

export default function OrderHistory() {
  const { data, loading, error } = useFetch(() => fetchMyOrders(), [])
  const orders = data?.orders ?? data ?? []

  return (
    <div className="max-w-4xl mx-auto px-5 sm:px-8 py-12">
      <h1 className="text-3xl font-semibold mb-8">My orders</h1>

      {loading ? (
        <Loader label="Loading your orders..." />
      ) : error ? (
        <ErrorBanner message={error} />
      ) : orders.length === 0 ? (
        <EmptyState
          title="No orders yet"
          message="Once you place an order, you'll be able to track it here."
          action={<Link to="/menu" className="btn-primary">Browse the menu</Link>}
        />
      ) : (
        <div className="flex flex-col gap-4">
          {orders.map((order) => (
            <Link
              key={order._id || order.id}
              to={`/orders/${order._id || order.id}`}
              className="card flex items-center justify-between gap-4 p-5 hover:shadow-lg hover:shadow-char/5 transition-shadow"
            >
              <div>
                <p className="font-display font-semibold">
                  Order #{String(order._id || order.id).slice(-6).toUpperCase()}
                </p>
                <p className="text-sm text-char/50 mt-1">
                  {order.items?.length || 0} item{order.items?.length === 1 ? '' : 's'} ·{' '}
                  {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : ''}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-semibold text-sm">{formatCurrency(order.total)}</span>
                <OrderStatusBadge status={order.status} />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

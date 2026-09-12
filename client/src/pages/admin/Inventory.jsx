import {
  useEffect,
  useMemo,
  useState,
} from 'react'

import {
  FiBox,
  FiCheckCircle,
  FiXCircle,
  FiSearch,
  FiRefreshCw,
} from 'react-icons/fi'

import {
  fetchAdminMenu,
  updateMenuItem,
} from '../../services/menuService.js'

import Loader from '../../components/Loader.jsx'
import EmptyState from '../../components/EmptyState.jsx'

const CATEGORIES = [
  'All',
  'Classic',
  'Specialty',
  'Vegetarian',
  'Sides',
  'Drinks',
]

export default function Inventory() {
  const [items, setItems] = useState([])

  const [loading, setLoading] = useState(true)

  const [refreshing, setRefreshing] =
    useState(false)

  const [updatingId, setUpdatingId] =
    useState(null)

  const [search, setSearch] =
    useState('')

  const [category, setCategory] =
    useState('All')

  const [stockFilter, setStockFilter] =
    useState('all')

  const [error, setError] =
    useState('')

  // ---------------------------------------
  // Load inventory
  // ---------------------------------------

  async function loadInventory(
    showRefresh = false
  ) {
    try {
      setError('')

      if (showRefresh) {
        setRefreshing(true)
      } else {
        setLoading(true)
      }

      const data =
        await fetchAdminMenu()

      const menuItems =
        Array.isArray(data)
          ? data
          : data?.items ||
            data?.menuItems ||
            data?.data ||
            []

      setItems(menuItems)
    } catch (error) {
      console.error(
        '[inventory] failed to load:',
        error
      )

      setError(
        error?.response?.data?.message ||
          'Failed to load inventory.'
      )
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  // ---------------------------------------
  // Initial load
  // ---------------------------------------

  useEffect(() => {
  loadInventory()
}, [])

  // ---------------------------------------
  // Toggle stock
  // ---------------------------------------

  async function handleToggleStock(item) {
    const id =
      item._id ||
      item.id

    if (!id) return

    const newAvailability =
      !item.isAvailable

    try {
      setUpdatingId(id)
      setError('')

      const response =
        await updateMenuItem(id, {
          isAvailable:
            newAvailability,
        })

      const updatedItem =
        response?.item ||
        response?.menuItem ||
        response?.data ||
        response

      setItems(
        (currentItems) =>
          currentItems.map(
            (currentItem) => {
              const currentId =
                currentItem._id ||
                currentItem.id

              if (
                currentId !== id
              ) {
                return currentItem
              }

              return {
                ...currentItem,
                ...updatedItem,
                isAvailable:
                  updatedItem?.isAvailable ??
                  newAvailability,
              }
            }
          )
      )
    } catch (error) {
      console.error(
        '[inventory] stock update failed:',
        error
      )

      setError(
        error?.response?.data?.message ||
          'Failed to update stock status.'
      )
    } finally {
      setUpdatingId(null)
    }
  }

  // ---------------------------------------
  // Statistics
  // ---------------------------------------

  const statistics = useMemo(() => {
    const total =
      items.length

    const available =
      items.filter(
        (item) =>
          item.isAvailable
      ).length

    const outOfStock =
      items.filter(
        (item) =>
          !item.isAvailable
      ).length

    const categories =
      new Set(
        items
          .map(
            (item) =>
              item.category
          )
          .filter(Boolean)
      ).size

    return {
      total,
      available,
      outOfStock,
      categories,
    }
  }, [items])

  // ---------------------------------------
  // Filter items
  // ---------------------------------------

  const filteredItems =
    useMemo(() => {
      const normalizedSearch =
        search
          .trim()
          .toLowerCase()

      return items.filter(
        (item) => {
          const matchesSearch =
            !normalizedSearch ||
            item.name
              ?.toLowerCase()
              .includes(
                normalizedSearch
              ) ||
            item.description
              ?.toLowerCase()
              .includes(
                normalizedSearch
              )

          const matchesCategory =
            category === 'All' ||
            item.category ===
              category

          const matchesStock =
            stockFilter ===
              'all' ||
            (
              stockFilter ===
                'available' &&
              item.isAvailable
            ) ||
            (
              stockFilter ===
                'out_of_stock' &&
              !item.isAvailable
            )

          return (
            matchesSearch &&
            matchesCategory &&
            matchesStock
          )
        }
      )
    }, [
      items,
      search,
      category,
      stockFilter,
    ])

  // ---------------------------------------
  // Loading
  // ---------------------------------------

  if (loading) {
    return (
      <div>
        <h1 className="mb-8 text-2xl font-semibold">
          Inventory
        </h1>

        <Loader label="Loading inventory..." />
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
            Inventory Management
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Quickly control which menu items are available for customers.
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            loadInventory(true)
          }
          disabled={refreshing}
          className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <FiRefreshCw
            className={
              refreshing
                ? 'animate-spin'
                : ''
            }
          />

          Refresh
        </button>
      </div>

      {/* Statistics */}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {/* Total */}

        <div className="card p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">
                Total Items
              </p>

              <p className="mt-2 text-3xl font-black text-slate-900">
                {statistics.total}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-600">
              <FiBox size={21} />
            </div>
          </div>
        </div>

        {/* Available */}

        <div className="card p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">
                Available
              </p>

              <p className="mt-2 text-3xl font-black text-green-600">
                {statistics.available}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-green-50 text-green-600">
              <FiCheckCircle size={21} />
            </div>
          </div>
        </div>

        {/* Out of stock */}

        <div className="card p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">
                Out of Stock
              </p>

              <p className="mt-2 text-3xl font-black text-red-600">
                {statistics.outOfStock}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-red-50 text-red-600">
              <FiXCircle size={21} />
            </div>
          </div>
        </div>

        {/* Categories */}

        <div className="card p-5">
          <p className="text-sm text-slate-500">
            Categories
          </p>

          <p className="mt-2 text-3xl font-black text-slate-900">
            {statistics.categories}
          </p>
        </div>
      </div>

      {/* Error */}

      {error && (
        <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </div>
      )}

      {/* Filters */}

      <div className="card p-4">
        <div className="grid gap-3 lg:grid-cols-[1fr_auto_auto]">
          {/* Search */}

          <div className="relative">
            <FiSearch
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />

            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
              placeholder="Search menu items..."
              className="input-field pl-11"
            />
          </div>

          {/* Category */}

          <select
            value={category}
            onChange={(event) =>
              setCategory(
                event.target.value
              )
            }
            className="input-field"
          >
            {CATEGORIES.map(
              (item) => (
                <option
                  key={item}
                  value={item}
                >
                  {item}
                </option>
              )
            )}
          </select>

          {/* Stock */}

          <select
            value={stockFilter}
            onChange={(event) =>
              setStockFilter(
                event.target.value
              )
            }
            className="input-field"
          >
            <option value="all">
              All stock
            </option>

            <option value="available">
              Available
            </option>

            <option value="out_of_stock">
              Out of stock
            </option>
          </select>
        </div>
      </div>

      {/* Items */}

      {items.length === 0 ? (
        <EmptyState
          title="No menu items"
          message="Create menu items from Manage Menu first."
        />
      ) : filteredItems.length ===
        0 ? (
        <EmptyState
          title="No matching items"
          message="Try changing your search or filters."
        />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {filteredItems.map(
            (item) => {
              const id =
                item._id ||
                item.id

              const updating =
                updatingId === id

              return (
                <div
                  key={id}
                  className="card overflow-hidden"
                >
                  {/* Image */}

                  <div className="relative h-48 bg-slate-100">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className={`h-full w-full object-cover transition ${
                          !item.isAvailable
                            ? 'grayscale'
                            : ''
                        }`}
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-slate-300">
                        <FiBox
                          size={42}
                        />
                      </div>
                    )}

                    {/* Availability badge */}

                    <div className="absolute right-3 top-3">
                      {item.isAvailable ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-bold text-green-700 shadow-sm">
                          <FiCheckCircle />
                          Available
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-bold text-red-700 shadow-sm">
                          <FiXCircle />
                          Out of stock
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Content */}

                  <div className="p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-black text-slate-900">
                          {item.name}
                        </h3>

                        <p className="mt-1 text-xs font-medium text-tomato">
                          {item.category}
                        </p>
                      </div>

                      <p className="whitespace-nowrap font-black text-slate-900">
                        ₹
                        {Number(
                          item.basePrice ||
                            0
                        )}
                      </p>
                    </div>

                    {item.description && (
                      <p className="mt-3 line-clamp-2 text-sm leading-5 text-slate-500">
                        {item.description}
                      </p>
                    )}

                    {/* Toggle */}

                    <button
                      type="button"
                      disabled={
                        updating
                      }
                      onClick={() =>
                        handleToggleStock(
                          item
                        )
                      }
                      className={`mt-5 w-full rounded-2xl px-4 py-3 text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-60 ${
                        item.isAvailable
                          ? 'border border-red-200 bg-red-50 text-red-700 hover:bg-red-100'
                          : 'bg-green-600 text-white hover:bg-green-700'
                      }`}
                    >
                      {updating
                        ? 'Updating...'
                        : item.isAvailable
                          ? 'Mark Out of Stock'
                          : 'Mark Available'}
                    </button>
                  </div>
                </div>
              )
            }
          )}
        </div>
      )}
    </div>
  )
}
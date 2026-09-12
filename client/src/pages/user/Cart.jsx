import { Link, useNavigate } from 'react-router-dom'
import {
  FiArrowLeft,
  FiArrowRight,
  FiCheckCircle,
  FiShield,
  FiTrash2,
  FiTruck,
} from 'react-icons/fi'

import { useCart } from '../../hooks/useCart.js'
import { formatCurrency } from '../../utils/formatCurrency.js'
import QuantityStepper from '../../components/QuantityStepper.jsx'
import EmptyState from '../../components/EmptyState.jsx'

const DELIVERY_FEE = 40
const TAX_RATE = 0.08

export default function Cart() {
  const {
    items,
    removeItem,
    updateQuantity,
    subtotal,
    unavailableItems,
    checkingAvailability,
    checkAvailability,
  } = useCart()

  const navigate = useNavigate()

  const tax = subtotal * TAX_RATE
  const total = items.length > 0 ? subtotal + DELIVERY_FEE + tax : 0

  const handleCheckout = async () => {
    const available = await checkAvailability()

    if (!available) {
      return
    }

    navigate('/checkout')
  }

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] bg-flour px-5 py-16 sm:px-8">
        <div className="mx-auto max-w-3xl">
          <div className="mb-8">
            <Link
              to="/menu"
              className="inline-flex items-center gap-2 text-sm font-semibold text-char/55 transition-colors hover:text-tomato"
            >
              <FiArrowLeft size={15} />
              Back to menu
            </Link>
          </div>

          <div className="rounded-[2rem] border border-char/10 bg-white px-6 py-12 shadow-sm sm:px-10">
            <EmptyState
              title="Your cart is empty"
              message="Add a pizza or two — your future self will thank you."
              action={
                <Link to="/menu" className="btn-primary">
                  Browse the menu
                </Link>
              }
            />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-flour">
      <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-14">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Link
              to="/menu"
              className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-char/50 transition-colors hover:text-tomato"
            >
              <FiArrowLeft size={15} />
              Continue shopping
            </Link>

            <p className="label-sm text-tomato">
              Your order
            </p>

            <h1 className="mt-1 font-display text-3xl font-semibold sm:text-4xl">
              Your cart
            </h1>
          </div>

          <div className="flex items-center gap-2 text-sm text-char/50">
            <FiCheckCircle className="text-basil" size={17} />
            {items.length} {items.length === 1 ? 'item' : 'items'} selected
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
          {/* Cart items */}
          <div className="space-y-4">
            {items.map((item) => {
              const isUnavailable = unavailableItems.some(
                (unavailableItem) => unavailableItem.key === item.key
              )

              return (
                <CartItem
                  key={item.key}
                  item={item}
                  isUnavailable={isUnavailable}
                  onRemove={() => removeItem(item.key)}
                  onQuantityChange={(quantity) =>
                    updateQuantity(item.key, quantity)
                  }
                />
              )
            })}

            {/* Unavailable items warning */}
            {unavailableItems.length > 0 && (
              <div className="rounded-2xl border border-tomato/20 bg-tomato/10 px-4 py-4">
                <p className="font-semibold text-tomato-dark">
                  Some items are no longer available
                </p>

                <p className="mt-1 text-sm text-char/60">
                  Please remove the unavailable items before continuing to
                  checkout.
                </p>

                <div className="mt-3 space-y-2">
                  {unavailableItems.map((item) => (
                    <div
                      key={item.key}
                      className="flex items-center justify-between gap-3 text-sm"
                    >
                      <span className="font-medium text-char">
                        {item.name}
                      </span>

                      <button
                        type="button"
                        onClick={() => removeItem(item.key)}
                        className="font-semibold text-tomato transition-colors hover:text-tomato-dark"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Delivery information */}
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <InfoCard
                icon={<FiTruck size={18} />}
                title="Fast delivery"
                text="Hot pizza delivered to your door."
              />

              <InfoCard
                icon={<FiShield size={18} />}
                title="Secure checkout"
                text="Your payment is handled securely."
              />
            </div>
          </div>

          {/* Summary */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="overflow-hidden rounded-[2rem] border border-char/10 bg-white shadow-sm">
              <div className="p-6 sm:p-7">
                <div className="mb-6">
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-char/40">
                    Summary
                  </p>

                  <h2 className="mt-1 font-display text-2xl font-semibold">
                    Order summary
                  </h2>
                </div>

                <div className="space-y-3 text-sm">
                  <Row
                    label="Subtotal"
                    value={formatCurrency(subtotal)}
                  />

                  <Row
                    label="Delivery fee"
                    value={formatCurrency(DELIVERY_FEE)}
                  />

                  <Row
                    label={`Tax (${TAX_RATE * 100}%)`}
                    value={formatCurrency(tax)}
                  />
                </div>

                <div className="my-6 border-t border-dashed border-char/15" />

                <div className="mb-6 flex items-end justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-char/50">
                      Total
                    </p>

                    <p className="mt-1 font-display text-3xl font-semibold text-char">
                      {formatCurrency(total)}
                    </p>
                  </div>

                  {unavailableItems.length > 0 ? (
                    <span className="rounded-full bg-tomato/10 px-3 py-1.5 text-xs font-bold text-tomato-dark">
                      Action required
                    </span>
                  ) : (
                    <span className="rounded-full bg-basil/10 px-3 py-1.5 text-xs font-bold text-basil-dark">
                      Ready to order
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleCheckout}
                  disabled={
                    checkingAvailability ||
                    unavailableItems.length > 0
                  }
                  className="
                    group
                    flex
                    w-full
                    items-center
                    justify-center
                    gap-2
                    rounded-full
                    bg-tomato
                    px-6
                    py-3.5
                    font-semibold
                    text-flour
                    shadow-lg
                    shadow-tomato/20
                    transition-all
                    duration-200
                    hover:-translate-y-0.5
                    hover:bg-tomato-dark
                    hover:shadow-xl
                    disabled:cursor-not-allowed
                    disabled:opacity-60
                    disabled:hover:translate-y-0
                    disabled:hover:bg-tomato
                    disabled:hover:shadow-lg
                  "
                >
                  {checkingAvailability
                    ? 'Checking availability...'
                    : unavailableItems.length > 0
                      ? 'Remove unavailable items'
                      : 'Proceed to checkout'}

                  {!checkingAvailability &&
                    unavailableItems.length === 0 && (
                      <FiArrowRight
                        size={17}
                        className="transition-transform duration-200 group-hover:translate-x-1"
                      />
                    )}
                </button>

                <p className="mt-4 text-center text-xs leading-relaxed text-char/40">
                  You'll review your delivery details and payment
                  before placing the order.
                </p>
              </div>

              {/* Bottom accent */}
              <div className="h-1.5 bg-gradient-to-r from-tomato via-cheese to-basil" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function CartItem({
  item,
  isUnavailable,
  onRemove,
  onQuantityChange,
}) {
  return (
    <div
      className={`
        group
        rounded-[1.75rem]
        border
        bg-white
        p-4
        shadow-sm
        transition-all
        duration-300
        hover:shadow-md
        sm:p-5
        ${
          isUnavailable
            ? 'border-tomato/30 bg-tomato/[0.03]'
            : 'border-char/10'
        }
      `}
    >
      {isUnavailable && (
        <div className="mb-4 rounded-xl bg-tomato/10 px-3 py-2 text-xs font-semibold text-tomato-dark">
          This item is currently unavailable.
        </div>
      )}

      <div className="flex gap-4 sm:gap-5">
        {/* Image */}
        <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-crust-light sm:h-28 sm:w-28">
          {item.image ? (
            <img
              src={item.image}
              alt={item.name}
              className={`
                h-full
                w-full
                object-cover
                transition-transform
                duration-500
                group-hover:scale-105
                ${isUnavailable ? 'opacity-50 grayscale' : ''}
              `}
            />
          ) : (
            <PizzaThumbnail />
          )}

          {isUnavailable && (
            <div className="absolute inset-0 flex items-center justify-center bg-char/20">
              <span className="rounded-full bg-white px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-char">
                Unavailable
              </span>
            </div>
          )}
        </div>

        {/* Main content */}
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h2 className="truncate font-display text-lg font-semibold text-char sm:text-xl">
                {item.name}
              </h2>

              <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-tomato">
                {item.size}
              </p>
            </div>

            <p className="shrink-0 font-display text-lg font-semibold text-char">
              {formatCurrency(item.price * item.quantity)}
            </p>
          </div>

          {/* Toppings */}
          {item.toppings?.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {item.toppings.map((topping) => (
                <span
                  key={topping}
                  className="
                    rounded-full
                    bg-basil/10
                    px-2.5
                    py-1
                    text-[10px]
                    font-semibold
                    text-basil-dark
                  "
                >
                  {topping}
                </span>
              ))}
            </div>
          )}

          {/* Controls */}
          <div className="mt-4 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={onRemove}
              className="
                inline-flex
                items-center
                gap-1.5
                text-xs
                font-semibold
                text-char/40
                transition-colors
                hover:text-tomato
              "
            >
              <FiTrash2 size={14} />
              Remove
            </button>

            <QuantityStepper
              value={item.quantity}
              onChange={onQuantityChange}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

function InfoCard({ icon, title, text }) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-char/8 bg-white/60 p-4">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-tomato/10 text-tomato">
        {icon}
      </div>

      <div>
        <p className="text-sm font-semibold text-char">
          {title}
        </p>

        <p className="mt-0.5 text-xs leading-relaxed text-char/45">
          {text}
        </p>
      </div>
    </div>
  )
}

function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-4 text-char/60">
      <span>{label}</span>

      <span className="font-medium text-char/75">
        {value}
      </span>
    </div>
  )
}

function PizzaThumbnail() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <svg
        width="75"
        height="75"
        viewBox="0 0 75 75"
        fill="none"
        aria-hidden="true"
      >
        <circle cx="37.5" cy="37.5" r="31" fill="#D8A24A" />
        <circle cx="37.5" cy="37.5" r="25" fill="#F2B705" />
        <circle cx="37.5" cy="37.5" r="22" fill="#F8D66B" />

        <circle cx="28" cy="29" r="4" fill="#C1440E" />
        <circle cx="46" cy="27" r="3.5" fill="#C1440E" />
        <circle cx="49" cy="45" r="4" fill="#C1440E" />
        <circle cx="28" cy="47" r="3.5" fill="#C1440E" />
        <circle cx="38" cy="38" r="3.5" fill="#C1440E" />

        <circle cx="38" cy="27" r="2.2" fill="#5B7A5A" />
        <circle cx="40" cy="49" r="2.2" fill="#5B7A5A" />
      </svg>
    </div>
  )
}
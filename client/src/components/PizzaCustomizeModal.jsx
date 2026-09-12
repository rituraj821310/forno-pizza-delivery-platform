import { useMemo, useState } from 'react'
import { FiCheck, FiPlus, FiX } from 'react-icons/fi'
import { PIZZA_SIZES, SERVER_BASE_URL } from '../utils/constants.js'
import { formatCurrency } from '../utils/formatCurrency.js'
import { useCart } from '../hooks/useCart.js'
import QuantityStepper from './QuantityStepper.jsx'

const TOPPINGS = [
  { name: 'Mozzarella', icon: '🧀' },
  { name: 'Mushroom', icon: '🍄' },
  { name: 'Pepperoni', icon: '🍕' },
  { name: 'Basil', icon: '🌿' },
  { name: 'Chili Oil', icon: '🌶️' },
  { name: 'Olives', icon: '🫒' },
]

const DRINK_SIZES = [
  { id: 'small', label: 'Small', multiplier: 0.8 },
  { id: 'medium', label: 'Medium', multiplier: 1 },
  { id: 'large', label: 'Large', multiplier: 1.25 },
]

function getImageUrl(image) {
  if (!image) return null

  if (image.startsWith('http')) {
    return image
  }

  return `${SERVER_BASE_URL}${image.startsWith('/') ? '' : '/'}${image}`
}

export default function PizzaCustomizeModal({ item, onClose }) {
  const { addItem } = useCart()

  const isDrink = item.category === 'Drinks'
  const isSide = item.category === 'Sides'
  const isPizza = !isDrink && !isSide

  const [size, setSize] = useState(
    isPizza || isDrink ? 'medium' : null
  )
  const [toppings, setToppings] = useState([])
  const [quantity, setQuantity] = useState(1)

  const sizeOptions = isPizza ? PIZZA_SIZES : DRINK_SIZES

  const sizeInfo = sizeOptions.find((s) => s.id === size)

  const toppingPrice = 30

  const unitPrice = useMemo(() => {
    const multiplier = sizeInfo?.multiplier ?? 1
    const base = item.basePrice * multiplier

    return isPizza
      ? base + toppings.length * toppingPrice
      : base
  }, [
    item.basePrice,
    sizeInfo,
    toppings.length,
    isPizza,
  ])

  function toggleTopping(topping) {
    setToppings((prev) =>
      prev.includes(topping)
        ? prev.filter((t) => t !== topping)
        : [...prev, topping]
    )
  }

  function handleAdd() {
    addItem({
      menuItemId: item._id || item.id,
      name: item.name,
      size,
      toppings: isPizza ? toppings : [],
      price: unitPrice,
      quantity,
      image: item.image,
    })

    onClose()
  }

  const sectionTitle = isPizza
    ? 'Customize your pizza'
    : isDrink
      ? 'Choose your drink'
      : 'Choose your side'

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      {/* Backdrop */}
      <button
        type="button"
        className="
          absolute
          inset-0
          cursor-default
          bg-char/60
          backdrop-blur-md
          transition-opacity
        "
        aria-label="Close customization"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="
          relative
          flex
          max-h-[92vh]
          w-full
          flex-col
          overflow-hidden
          rounded-t-[2rem]
          bg-flour
          shadow-2xl
          sm:max-w-xl
          sm:rounded-[2rem]
        "
      >
        {/* Header image */}
        <div className="relative h-44 shrink-0 overflow-hidden bg-crust-light sm:h-52">
          {item.image ? (
            <img
              src={getImageUrl(item.image)}
              alt={item.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <PizzaPreview />
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-char/55 via-char/5 to-transparent" />

          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="
              absolute
              right-4
              top-4
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-full
              border
              border-white/30
              bg-white/85
              text-char
              shadow-md
              backdrop-blur-md
              transition-all
              hover:scale-105
              hover:bg-white
            "
            aria-label="Close"
          >
            <FiX size={19} />
          </button>

          {/* Item name */}
          <div className="absolute bottom-4 left-5 right-5">
            <p className="mb-1 text-xs font-semibold uppercase tracking-[0.18em] text-white/75">
              {sectionTitle}
            </p>

            <h2 className="font-display text-2xl font-semibold text-white sm:text-3xl">
              {item.name}
            </h2>
          </div>
        </div>

        {/* Scrollable content */}
        <div className="overflow-y-auto px-5 py-6 sm:px-7">
          {item.description && (
            <p className="mb-7 text-sm leading-relaxed text-char/60">
              {item.description}
            </p>
          )}

          {/* Size */}
          {!isSide && (
            <section className="mb-7">
              <div className="mb-3 flex items-end justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-char/45">
                    Step 1
                  </p>

                  <h3 className="mt-1 font-display text-xl font-semibold">
                    Choose your {isPizza ? 'pizza size' : 'drink size'}
                  </h3>
                </div>

                {sizeInfo && (
                  <span className="text-sm font-semibold text-tomato">
                    {sizeInfo.label}
                  </span>
                )}
              </div>

              <div
                className={
                  isPizza
                    ? 'grid grid-cols-2 gap-3 sm:grid-cols-4'
                    : 'grid grid-cols-3 gap-3'
                }
              >
                {sizeOptions.map((s) => {
                  const selected = size === s.id

                  return (
                    <button
                      type="button"
                      key={s.id}
                      onClick={() => setSize(s.id)}
                      className={`
                        relative
                        overflow-hidden
                        rounded-2xl
                        border-2
                        px-3
                        py-3
                        text-left
                        transition-all
                        duration-200
                        ${
                          selected
                            ? 'border-tomato bg-tomato/10 text-tomato-dark shadow-sm'
                            : 'border-char/10 bg-white/60 text-char/70 hover:border-char/25 hover:bg-white'
                        }
                      `}
                    >
                      {selected && (
                        <span className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-tomato text-white">
                          <FiCheck size={11} strokeWidth={3} />
                        </span>
                      )}

                      <span className="block text-sm font-bold">
                        {s.label}
                      </span>

                      <span className="mt-1 block text-xs text-char/45">
                        {s.multiplier === 1
                          ? 'Regular price'
                          : `${s.multiplier}× price`}
                      </span>
                    </button>
                  )
                })}
              </div>
            </section>
          )}

          {/* Toppings — Pizza only */}
          {isPizza && (
            <section className="mb-7">
              <div className="mb-3">
                <p className="text-xs font-bold uppercase tracking-wider text-char/45">
                  Step 2
                </p>

                <div className="mt-1 flex items-center justify-between gap-3">
                  <h3 className="font-display text-xl font-semibold">
                    Add extra toppings
                  </h3>

                  <span className="shrink-0 text-xs font-semibold text-char/45">
                    +{formatCurrency(toppingPrice)} each
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                {TOPPINGS.map((topping) => {
                  const selected = toppings.includes(topping.name)

                  return (
                    <button
                      type="button"
                      key={topping.name}
                      onClick={() => toggleTopping(topping.name)}
                      className={`
                        flex
                        items-center
                        gap-2.5
                        rounded-2xl
                        border-2
                        px-3
                        py-3
                        text-left
                        transition-all
                        duration-200
                        ${
                          selected
                            ? 'border-basil bg-basil/10 text-basil-dark'
                            : 'border-char/10 bg-white/60 text-char/70 hover:border-char/20 hover:bg-white'
                        }
                      `}
                    >
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-flour-dark text-base">
                        {topping.icon}
                      </span>

                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-xs font-semibold">
                          {topping.name}
                        </span>

                        <span className="mt-0.5 block text-[10px] text-char/40">
                          +{formatCurrency(toppingPrice)}
                        </span>
                      </span>

                      {selected && (
                        <FiCheck
                          size={16}
                          className="shrink-0 text-basil"
                          strokeWidth={3}
                        />
                      )}
                    </button>
                  )
                })}
              </div>
            </section>
          )}

          {/* Quantity */}
          <section className="mb-2">
            <div className="flex items-center justify-between rounded-2xl border border-char/10 bg-white/60 px-4 py-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-char/40">
                  {isPizza ? 'Step 3' : 'Step 2'}
                </p>

                <h3 className="mt-1 font-display text-lg font-semibold">
                  Quantity
                </h3>
              </div>

              <QuantityStepper
                value={quantity}
                onChange={setQuantity}
              />
            </div>
          </section>
        </div>

        {/* Bottom price/action */}
        <div className="shrink-0 border-t border-char/10 bg-white/80 px-5 py-4 backdrop-blur-md sm:px-7">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-medium text-char/45">
                Total
              </p>

              <p className="font-display text-2xl font-semibold text-char">
                {formatCurrency(unitPrice * quantity)}
              </p>
            </div>

            <button
              type="button"
              onClick={handleAdd}
              className="
                inline-flex
                flex-1
                items-center
                justify-center
                gap-2
                rounded-full
                bg-tomato
                px-5
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
                active:translate-y-0
                sm:flex-none
                sm:min-w-[230px]
              "
            >
              <FiPlus size={18} />
              Add to cart
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function PizzaPreview() {
  return (
    <div className="relative transition-transform duration-500 hover:scale-105">
      <div className="absolute inset-0 rounded-full bg-cheese/30 blur-2xl" />

      <svg
        width="145"
        height="145"
        viewBox="0 0 145 145"
        fill="none"
        className="relative drop-shadow-xl"
      >
        <circle
          cx="72.5"
          cy="72.5"
          r="63"
          fill="#D8A24A"
        />

        <circle
          cx="72.5"
          cy="72.5"
          r="53"
          fill="#F2B705"
        />

        <circle
          cx="72.5"
          cy="72.5"
          r="47"
          fill="#F8D66B"
        />

        {/* Pepperoni */}
        <circle cx="49" cy="52" r="7" fill="#C1440E" />
        <circle cx="84" cy="47" r="6" fill="#C1440E" />
        <circle cx="94" cy="79" r="7" fill="#C1440E" />
        <circle cx="51" cy="86" r="6" fill="#C1440E" />
        <circle cx="72" cy="68" r="6" fill="#C1440E" />

        {/* Basil */}
        <circle cx="68" cy="45" r="4" fill="#5B7A5A" />
        <circle cx="76" cy="92" r="4" fill="#5B7A5A" />
        <circle cx="40" cy="69" r="3.5" fill="#5B7A5A" />
      </svg>
    </div>
  )
}
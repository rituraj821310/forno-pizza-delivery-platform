const DELIVERY_FEE = 40

const TAX_RATE = 0.08

const SIZE_MULTIPLIERS = {
  small: 0.8,
  medium: 1,
  large: 1.25,
  xl: 1.5,
}

const TOPPING_PRICE = 30

function calculateItemPrice(
  basePrice,
  size = 'medium',
  toppings = []
) {
  const multiplier =
    SIZE_MULTIPLIERS[size]

  if (!multiplier) {
    throw new Error(
      `Invalid pizza size: ${size}`
    )
  }

  const toppingCount = Array.isArray(toppings)
    ? toppings.length
    : 0

  const price =
    basePrice * multiplier +
    toppingCount * TOPPING_PRICE

  return Number(price.toFixed(2))
}

function calculateTotals(items) {
  const subtotal = items.reduce(
    (sum, item) =>
      sum + item.price * item.quantity,
    0
  )

  const tax = Number(
    (subtotal * TAX_RATE).toFixed(2)
  )

  const deliveryFee = DELIVERY_FEE

  const total = Number(
    (
      subtotal +
      tax +
      deliveryFee
    ).toFixed(2)
  )

  return {
    subtotal: Number(
      subtotal.toFixed(2)
    ),
    deliveryFee,
    tax,
    total,
  }
}

export {
  calculateItemPrice,
  calculateTotals,
  DELIVERY_FEE,
  TAX_RATE,
  SIZE_MULTIPLIERS,
  TOPPING_PRICE,
}
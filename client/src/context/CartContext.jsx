import { createContext, useCallback, useEffect, useMemo, useState } from 'react'
import { fetchMenu } from '../services/menuService.js'

export const CartContext = createContext(null)

const STORAGE_KEY = 'forno_cart'

function loadInitialCart() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(loadInitialCart)
  const [unavailableItems, setUnavailableItems] = useState([])
  const [checkingAvailability, setCheckingAvailability] = useState(false)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items])

  const addItem = useCallback((item) => {
    setItems((prev) => {
      const key = `${item.menuItemId}-${item.size}-${(item.toppings || []).sort().join(',')}`

      const existing = prev.find((i) => i.key === key)

      if (existing) {
        return prev.map((i) =>
          i.key === key
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        )
      }

      return [
        ...prev,
        {
          ...item,
          key,
          quantity: item.quantity || 1,
        },
      ]
    })
  }, [])

  const removeItem = useCallback((key) => {
    setItems((prev) => prev.filter((i) => i.key !== key))

    setUnavailableItems((prev) =>
      prev.filter((item) => item.key !== key)
    )
  }, [])

  const updateQuantity = useCallback((key, quantity) => {
    setItems((prev) =>
      prev
        .map((i) =>
          i.key === key
            ? { ...i, quantity: Math.max(1, quantity) }
            : i
        )
        .filter((i) => i.quantity > 0)
    )
  }, [])

  const clearCart = useCallback(() => {
    setItems([])
    setUnavailableItems([])
  }, [])

  const checkAvailability = useCallback(async () => {
    if (items.length === 0) {
      setUnavailableItems([])
      return true
    }

    setCheckingAvailability(true)

    try {
      const data = await fetchMenu()

      const menuItems = data?.items || []

      const availableIds = new Set(
        menuItems.map((menuItem) => String(menuItem._id || menuItem.id))
      )

      const unavailable = items.filter(
        (item) => !availableIds.has(String(item.menuItemId))
      )

      setUnavailableItems(unavailable)

      return unavailable.length === 0
    } catch (error) {
      console.error('Failed to check cart availability:', error)

      // Don't block checkout just because the availability
      // check itself failed. The server will still validate it.
      return true
    } finally {
      setCheckingAvailability(false)
    }
  }, [items])

  const subtotal = useMemo(
    () => items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    [items]
  )

  const itemCount = useMemo(
    () => items.reduce((sum, i) => sum + i.quantity, 0),
    [items]
  )

  const value = useMemo(
    () => ({
      items,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      subtotal,
      itemCount,
      unavailableItems,
      checkingAvailability,
      checkAvailability,
    }),
    [
      items,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      subtotal,
      itemCount,
      unavailableItems,
      checkingAvailability,
      checkAvailability,
    ]
  )

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}

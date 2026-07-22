import React, { createContext, useContext, useState, ReactNode } from "react"

// Define the CartItem type
export type CartItem = {
  id: number
  name: string
  price: number
  images: string[]
  size: string
  quantity: number
}

// Context value type
type CartContextType = {
  cart: CartItem[]
  addToCart: (item: CartItem) => void
  removeFromCart: (id: number, size: string) => void
  increaseQuantity: (id: number, size: string) => void
  decreaseQuantity: (id: number, size: string) => void
  clearCart: () => void
}

// Create context
const CartContext = createContext<CartContextType | undefined>(undefined)

// Cart Provider
export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([])

  const addToCart = (item: CartItem) => {
    setCart(prevCart => {
      const existing = prevCart.find(
        i => i.id === item.id && i.size === item.size
      )
      if (existing) {
        return prevCart.map(i =>
          i.id === item.id && i.size === item.size
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        )
      }
      return [...prevCart, item]
    })
  }

  const removeFromCart = (id: number, size: string) => {
    setCart(prevCart => prevCart.filter(i => !(i.id === id && i.size === size)))
  }

  const increaseQuantity = (id: number, size: string) => {
    setCart(prevCart =>
      prevCart.map(i =>
        i.id === id && i.size === size
          ? { ...i, quantity: i.quantity + 1 }
          : i
      )
    )
  }

  const decreaseQuantity = (id: number, size: string) => {
    setCart(prevCart =>
      prevCart.map(i =>
        i.id === id && i.size === size && i.quantity > 1
          ? { ...i, quantity: i.quantity - 1 }
          : i
      )
    )
  }

  const clearCart = () => setCart([])

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

// Hook for using the context
export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}

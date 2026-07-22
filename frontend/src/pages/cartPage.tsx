import { useCart } from "../component/CartContext"
import { Minus, Plus, Trash } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"

export default function CartPage() {
  const {
    cart,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
  } = useCart()
 const SHIPPING_FEE = 300 // shipping fee 

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )

  const total = subtotal + SHIPPING_FEE
  
 
  const totalAmount = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Your Cart</h1>

      {cart.length === 0 ? (
        <div className="text-gray-600">
          Your cart is empty.
          <Link to="/products" className="text-blue-500 underline ml-2">
            Back to Products
          </Link>
        </div>
      ) : (
        <>
          {cart.map((item) => (
            <div
              key={item.id + item.size}
              className="flex items-center justify-between mb-6 border-b pb-4"
            >
              <div className="flex items-center">
                <img
                  src={item.images[0]}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded"
                />
                <div className="ml-4">
                  <h2 className="font-medium">{item.name}</h2>
                  <p className="text-sm text-gray-500">Size: {item.size}</p>
                  <p className="font-semibold text-lg">
                    {(item.price * item.quantity).toFixed(2)} ETB
                  </p>

                  {/* Quantity Controls */}
                  <div className="flex items-center mt-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => decreaseQuantity(item.id, item.size)}
                      disabled={item.quantity === 1}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="mx-2">{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => increaseQuantity(item.id, item.size)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeFromCart(item.id, item.size)}
                      className="ml-4 text-red-500 hover:text-red-700"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
           
  
  
          {/* Summary Section */}
          <div className="mt-10">
            <h2 className="text-xl font-bold mb-4">Summary</h2>
            <div className="text-gray-700">
            <p>Subtotal: {subtotal.toFixed(2)} ETB</p>
             <p>Shipping Fee: {SHIPPING_FEE.toFixed(2)} ETB</p>
             <p className="text-lg font-bold mt-2">
               Total: {total.toFixed(2)} ETB
              </p>
            </div>

            <Link to="/checkout">
              <Button className="mt-6 w-full">Proceed to Checkout</Button>
            </Link>
          </div>
        </>
      )}
    </div>
  )
}

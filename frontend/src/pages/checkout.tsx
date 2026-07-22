import { useCart } from "../component/CartContext"
import { useState } from "react"

export default function CheckoutPage() {
  const { cart } = useCart()

  const [shippingInfo, setShippingInfo] = useState({
    fullName: "",
    phone: "",
    country: "",
    region: "",
    city: "",
    
     
  })

  const [paymentMethod, setPaymentMethod] = useState("CBE")
  const [paymentPhone, setPaymentPhone] = useState("")
 
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setShippingInfo(prev => ({ ...prev, [name]: value }))
  }

  const handleConfirm = () => {
    console.log("Order Confirmed", {
      shippingInfo,
      payment: {
        method: paymentMethod,
        phone: paymentPhone,
      },
      cart,
    })
    alert("Order confirmed! 🚀")
  }

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shippingFee = 300
  const grandTotal = total + shippingFee

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Order Conformation</h1>

      {/* Order Review */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">Order Review</h2>
        {cart.map(item => (
          <div key={item.id + item.size} className="flex items-center mb-2">
            <img src={item.images[0]} alt={item.name} className="w-16 h-16 object-cover rounded" />
            <div className="ml-4">
              <h3 className="font-medium">{item.name}</h3>
              <p>Size: {item.size} | Qty: {item.quantity}</p>
              <p className="font-bold">{(item.price * item.quantity).toFixed(2)} ETB</p>
            </div>
          </div>
        ))}
        <p className="mt-4">Subtotal: {total.toFixed(2)} ETB</p>
        <p>Shipping: {shippingFee.toFixed(2)} ETB</p>
        <p className="font-bold">Total: {grandTotal.toFixed(2)} ETB</p>
      </div>

      {/* Shipping Info */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">Shipping Information</h2>
        {["fullName", "phone","country" , "Region","city",].map(field => (
          <input
            key={field}
            type="text"
            name={field}
            placeholder={field.replace(/([A-Z])/g, " $1")}
            value={(shippingInfo as any)[field]}
            onChange={handleInputChange}
            className="block w-full mb-2 p-2 border rounded"
          />
        ))}
      </div>

      {/* Payment Method */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">Payment Method</h2>
        <label className="block mb-2">
          <input type="radio" value="CBE" checked={paymentMethod === "CBE"} onChange={e => setPaymentMethod(e.target.value)} />
          <span className="ml-2">CBE</span>
        </label>
        <label className="block mb-4">
          <input type="radio" value="Telebirr" checked={paymentMethod === "Telebirr"} onChange={e => setPaymentMethod(e.target.value)} />
          <span className="ml-2">Telebirr</span>
        </label>

        <input
          type="text"
          placeholder={`Enter Your ${paymentMethod} Phone Number`}
          value={paymentPhone}
          onChange={e => setPaymentPhone(e.target.value)}
          className="block w-full p-2 border rounded"
        />
      </div>

      {/* Confirm Button */}
      <button
        onClick={handleConfirm}
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
        Confirm Order
      </button>
    </div>
  )
}

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Minus, Plus, Trash } from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  getCart,
  updateCart,
  removeCartItem,
} from "../services/cart.service";
import Navbar from "@/component/Navbar";

const SHIPPING_FEE = 300;

export default function CartPage() {
  const [cart, setCart] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      setLoading(true);

      const response = await getCart();

      setCart(response.data.items);
    } catch (error) {
      console.error("Failed to load cart", error);
    } finally {
      setLoading(false);
    }
  };

  const increaseQuantity = async (
    itemId: string,
    quantity: number
  ) => {
    try {
      await updateCart(itemId, quantity + 1);
      fetchCart();
    } catch (error) {
      console.error(error);
    }
  };

  const decreaseQuantity = async (
    itemId: string,
    quantity: number
  ) => {
    if (quantity <= 1) return;

    try {
      await updateCart(itemId, quantity - 1);
      fetchCart();
    } catch (error) {
      console.error(error);
    }
  };

  const removeItem = async (itemId: string) => {
    try {
      await removeCartItem(itemId);
      fetchCart();
    } catch (error) {
      console.error(error);
    }
  };

  const subtotal = cart.reduce(
    (sum, item) =>
      sum + Number(item.product.price) * item.quantity,
    0
  );

  const total = subtotal + SHIPPING_FEE;
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <h2 className="text-xl font-semibold text-black">
          Loading Cart...
        </h2>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
  
      <div className="container mx-auto px-6 py-8">
  
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-black">
            Your Cart
          </h1>
  
          <p className="text-gray-500 mt-2">
            Review your selected items before checkout.
          </p>
        </div>
  
        {cart.length === 0 ? (
  
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
  
            <p className="text-gray-500 text-lg mb-6">
              Your cart is empty.
            </p>
  
            <Link to="/products">
              <Button className="bg-black hover:bg-gray-900 text-white rounded-xl px-8">
                Continue Shopping
              </Button>
            </Link>
  
          </div>
  
        ) : (
  
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
  
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-6">
  
              {cart.map((item) => (
  
                <div
                  key={item.id}
                  className="bg-white rounded-2xl shadow-lg p-6 flex flex-col md:flex-row items-center justify-between gap-6"
                >
  
                  {/* Product */}
  
                  <div className="flex items-center gap-5 flex-1">
  
                    <img
                      src={
                        item.product.images.length > 0
                          ? item.product.images[0].url
                          : "/placeholder.svg"
                      }
                      alt={item.product.name}
                      className="w-28 h-28 rounded-xl object-cover border"
                    />
  
                    <div>
  
                      <h2 className="text-xl font-semibold text-black">
                        {item.product.name}
                      </h2>
  
                      <p className="text-gray-500 mt-1">
                        {item.product.category.name}
                      </p>
  
                      <p className="text-lg font-bold text-black mt-3">
                        {Number(item.product.price).toFixed(2)} ETB
                      </p>
  
                    </div>
  
                  </div>
  
                  {/* Quantity */}
  
                  <div className="flex items-center gap-3">
  
                    <Button
                      variant="outline"
                      size="icon"
                      disabled={item.quantity === 1}
                      onClick={() =>
                        decreaseQuantity(item.id, item.quantity)
                      }
                      className="rounded-lg"
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
  
                    <span className="font-semibold text-lg text-black w-8 text-center">
                      {item.quantity}
                    </span>
  
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() =>
                        increaseQuantity(item.id, item.quantity)
                      }
                      className="rounded-lg"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
  
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeItem(item.id)}
                      className="text-red-500 hover:text-red-700 rounded-lg"
                    >
                      <Trash className="w-5 h-5" />
                    </Button>
  
                  </div>
  
                  {/* Total */}
  
                  <div className="text-xl font-bold text-black">
                    {(
                      Number(item.product.price) *
                      item.quantity
                    ).toFixed(2)} ETB
                  </div>
  
                </div>
  
              ))}
  
            </div>
  
            {/* Order Summary */}
  
            <div>
  
              <div className="bg-white rounded-2xl shadow-lg p-8 sticky top-24">
  
                <h2 className="text-2xl font-bold text-black mb-6">
                  Order Summary
                </h2>
  
                <div className="space-y-4">
  
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>{subtotal.toFixed(2)} ETB</span>
                  </div>
  
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span>{SHIPPING_FEE.toFixed(2)} ETB</span>
                  </div>
  
                  <hr />
  
                  <div className="flex justify-between text-xl font-bold text-black">
                    <span>Total</span>
                    <span>{total.toFixed(2)} ETB</span>
                  </div>
  
                </div>
  
                <Link to="/checkout">
  
                  <Button className="w-full mt-8 h-11 bg-black hover:bg-gray-900 text-white rounded-xl">
                    Proceed to Checkout
                  </Button>
  
                </Link>
  
              </div>
  
            </div>
  
          </div>
  
        )}
  
      </div>
    </div>
  );}
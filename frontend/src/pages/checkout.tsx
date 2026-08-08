import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../api/axios";
import Navbar from "@/component/Navbar";

type Address = {
  id: string;
  fullName: string;
  phone: string;
  country: string;
  city: string;
  subCity: string;
  woreda?: string;
  houseNumber?: string;
  isDefault: boolean;
};

type CartItem = {
  id: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    price: number | string;
    images: {
      id: string;
      imageUrl: string;
      isPrimary: boolean;
    }[];
  };
};

type CheckoutSummary = {
  items: {
    cartItemId: string;
    productId: string;
    productName: string;
    image: string | null;
    quantity: number;
    unitPrice: number;
    lineTotal: number;
  }[];
  address: Address;
  subtotal: number;
  shipping: number;
  total: number;
};

export default function CheckoutPage() {
  const location = useLocation();
  const navigate = useNavigate();

  // Address selected from AddressPage
  const addressId = location.state?.addressId;

  const [cart, setCart] = useState<CartItem[]>([]);
  const [address, setAddress] = useState<Address | null>(null);
  const [summary, setSummary] = useState<CheckoutSummary | null>(null);

  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [error, setError] = useState("");

  /*
   * Load checkout information
   */
  useEffect(() => {
    if (!addressId) {
      setError("No shipping address selected.");
      setLoading(false);
      return;
    }

    loadCheckout();
  }, [addressId]);

  const loadCheckout = async () => {
    try {
      setLoading(true);
      setError("");

      // 1. Get cart
      const cartResponse = await api.get("/cart");

      const cartItems = cartResponse.data.data.items;

      if (!cartItems || cartItems.length === 0) {
        setError("Your cart is empty.");
        return;
      }

      setCart(cartItems);

      // 2. Get selected address
      const addressResponse = await api.get(
        `/address/${addressId}`
      );

      const selectedAddress = addressResponse.data.data;

      setAddress(selectedAddress);

      // 3. Get cart item IDs
      const cartItemIds = cartItems.map(
        (item: CartItem) => item.id
      );

      // 4. Ask backend to validate checkout
      // Chapa is the only payment method now.
      const checkoutResponse = await api.post(
        "/orders/checkout",
        {
          cartItemIds,
          addressId,
          paymentMethod: "CHAPA",
        }
      );

      setSummary(checkoutResponse.data.data);
    } catch (err: any) {
      console.error("Checkout error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to load checkout information."
      );
    } finally {
      setLoading(false);
    }
  };

  /*
   * Place order and initialize Chapa
   */
  const handleConfirmOrder = async () => {
    if (!addressId) {
      setError("Please select a shipping address.");
      return;
    }

    if (!summary || summary.items.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    try {
      setPlacingOrder(true);
      setError("");

      const cartItemIds = summary.items.map(
        (item) => item.cartItemId
      );

      /*
       * STEP 1
       * Create the order.
       */
      const orderResponse = await api.post("/orders", {
        cartItemIds,
        addressId,
        paymentMethod: "CHAPA",
      });

      const order = orderResponse.data.data;

      console.log("Order created:", order);

      if (!order?.id) {
        throw new Error("Order ID was not returned.");
      }

      /*
       * STEP 2
       * Initialize Chapa payment.
       */
      const paymentResponse = await api.post(
        "/payments/chapa/initialize",
        {
          orderId: order.id,
        }
      );

      const checkoutUrl =
        paymentResponse.data.data.checkoutUrl;

      if (!checkoutUrl) {
        throw new Error(
          "Chapa checkout URL was not returned."
        );
      }

      /*
       * STEP 3
       * Redirect customer to Chapa.
       */
      window.location.href = checkoutUrl;
    } catch (err: any) {
      console.error("Payment initialization error:", err);

      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to start payment."
      );

      setPlacingOrder(false);
    }
  };

  /*
   * Loading state
   */
  if (loading) {
    return (
      <>
        <Navbar />

        <div className="container mx-auto px-6 py-12">
          <p className="text-gray-600">
            Loading checkout...
          </p>
        </div>
      </>
    );
  }

  /*
   * Error state
   */
  if (error && !summary) {
    return (
      <>
        <Navbar />

        <div className="container mx-auto px-6 py-12">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <p className="text-red-600">{error}</p>

            <button
              onClick={() => navigate("/address")}
              className="mt-4 bg-black text-white px-6 py-2 rounded-lg"
            >
              Back to Address
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-black">
            Order Confirmation
          </h1>

          <p className="text-gray-500 mt-2">
            Review your order and continue to secure payment.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT SIDE */}
          <div className="lg:col-span-2 space-y-8">
            {/* Shipping Address */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-black">
                  Shipping Address
                </h2>

                <button
                  onClick={() => navigate("/address")}
                  className="text-sm underline text-gray-600 hover:text-black"
                >
                  Change
                </button>
              </div>

              {address && (
                <div className="border border-gray-200 rounded-xl p-5">
                  <p className="font-semibold text-black">
                    {address.fullName}
                  </p>

                  <p className="text-gray-600 mt-1">
                    {address.phone}
                  </p>

                  <p className="text-gray-600 mt-2">
                    {address.country}, {address.city},{" "}
                    {address.subCity}
                  </p>

                  {address.woreda && (
                    <p className="text-gray-600">
                      Woreda: {address.woreda}
                    </p>
                  )}

                  {address.houseNumber && (
                    <p className="text-gray-600">
                      House Number: {address.houseNumber}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Order Review */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-xl font-semibold text-black mb-6">
                Order Review
              </h2>

              {summary?.items.map((item) => (
                <div
                  key={item.cartItemId}
                  className="flex items-center justify-between border-b border-gray-200 pb-5 mb-5"
                >
                  <div className="flex items-center">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.productName}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                    ) : (
                      <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center">
                        <span className="text-gray-400 text-sm">
                          No Image
                        </span>
                      </div>
                    )}

                    <div className="ml-4">
                      <h3 className="font-medium text-black">
                        {item.productName}
                      </h3>

                      <p className="text-sm text-gray-500 mt-1">
                        Quantity: {item.quantity}
                      </p>

                      <p className="text-sm text-gray-500">
                        Unit Price:{" "}
                        {item.unitPrice.toFixed(2)} ETB
                      </p>
                    </div>
                  </div>

                  <p className="font-semibold text-black">
                    {item.lineTotal.toFixed(2)} ETB
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT SIDE - SUMMARY */}
          <div>
            <div className="bg-white rounded-2xl shadow-lg p-8 sticky top-6">
              <h2 className="text-xl font-semibold text-black mb-6">
                Order Summary
              </h2>

              <div className="space-y-4 text-gray-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>

                  <span>
                    {summary?.subtotal.toFixed(2)} ETB
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Shipping</span>

                  <span>
                    {summary?.shipping.toFixed(2)} ETB
                  </span>
                </div>

                <div className="border-t pt-4 flex justify-between text-lg font-bold text-black">
                  <span>Total</span>

                  <span>
                    {summary?.total.toFixed(2)} ETB
                  </span>
                </div>
              </div>

              {/* Payment */}
              <div className="mt-8 border-t pt-6">
                <h3 className="font-semibold text-black mb-3">
                  Payment Method
                </h3>

                <div className="border border-gray-200 rounded-lg p-4">
                  <p className="font-medium text-black">
                    Chapa
                  </p>

                  <p className="text-sm text-gray-500 mt-1">
                    You will be redirected to Chapa's secure
                    payment page.
                  </p>
                </div>
              </div>

              {/* Confirm */}
              <button
                onClick={handleConfirmOrder}
                disabled={placingOrder}
                className="mt-8 w-full h-12 rounded-lg bg-black text-white font-medium hover:bg-gray-900 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {placingOrder
                  ? "Redirecting to Chapa..."
                  : "Proceed to Chapa"}
              </button>

              <button
                onClick={() => navigate("/address")}
                disabled={placingOrder}
                className="mt-3 w-full h-12 rounded-lg border border-gray-300 text-black font-medium hover:bg-gray-50 transition"
              >
                Back to Address
              </button>

              <p className="text-xs text-gray-400 text-center mt-4">
                Your payment will be securely processed by Chapa.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

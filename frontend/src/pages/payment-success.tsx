import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import api from "../api/axios";

type Order = {
  id: string;
  status: string;
  paymentStatus: string;
  totalPrice: number | string;
  createdAt: string;

  payment?: {
    id: string;
    method: string;
    status: string;
    transactionId?: string | null;
  };

  items?: {
    id: string;
    quantity: number;
    price: number | string;
    product: {
      id: string;
      name: string;
      images?: {
        imageUrl: string;
        isPrimary: boolean;
      }[];
    };
  }[];
};

export default function PaymentSuccessPage() {
  const [searchParams] = useSearchParams();

  // Chapa returns the order ID in the URL
  const orderId = searchParams.get("orderId");

  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) {
        setError("Order reference was not found.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        /*
         * Get the order from our backend.
         *
         * Backend:
         * GET /api/orders/:id
         */
        const response = await api.get(`/orders/${orderId}`);

        const orderData = response.data.data;

        console.log("Payment success order:", orderData);

        setOrder(orderData);
      } catch (err: any) {
        console.error("Failed to load payment order:", err);

        setError(
          err.response?.data?.message ||
            "Unable to load your order information."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  /*
   * Loading
   */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-black rounded-full animate-spin mx-auto" />

          <h2 className="text-xl font-semibold mt-6">
            Verifying your payment...
          </h2>

          <p className="text-gray-500 mt-2">
            Please wait while we confirm your order.
          </p>
        </div>
      </div>
    );
  }

  /*
   * Error
   */
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white px-4">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 mx-auto rounded-full bg-red-100 flex items-center justify-center">
            <span className="text-4xl text-red-600">!</span>
          </div>

          <h1 className="text-3xl text-black font-bold mt-6">
            Payment Verification Failed
          </h1>

          <p className="text-gray-600 mt-3">
            {error}
          </p>

          <Link
            to="/orders"
            className="inline-block mt-6 bg-black text-white px-6 py-3 rounded-lg"
          >
            View My Orders
          </Link>
        </div>
      </div>
    );
  }

  /*
   * Order not found
   */
  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold">
            Order Not Found
          </h1>

          <Link
            to="/orders"
            className="inline-block mt-6 bg-black text-white px-6 py-3 rounded-lg"
          >
            View My Orders
          </Link>
        </div>
      </div>
    );
  }

  /*
   * Payment status
   */
  const isPaid =
    order.paymentStatus === "PAID" &&
    order.payment?.status === "PAID";

  /*
   * Payment not completed
   */
  if (!isPaid) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white px-4">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 mx-auto rounded-full bg-yellow-100 flex items-center justify-center">
            <span className="text-4xl text-yellow-600">
              !
            </span>
          </div>

          <h1 className="text-3xl font-bold mt-6">
            Payment Not Confirmed
          </h1>

          <p className="text-gray-600 mt-3">
            Your payment has not been confirmed yet.
          </p>

          <div className="mt-6 bg-gray-50 rounded-lg p-4 text-left">
            <p className="text-sm text-gray-500">
              Order ID
            </p>

            <p className="font-medium break-all">
              {order.id}
            </p>

            <p className="text-sm text-gray-500 mt-3">
              Payment Status
            </p>

            <p className="font-semibold">
              {order.paymentStatus}
            </p>
          </div>

          <div className="flex flex-col gap-3 mt-8">
            <Link
              to="/orders"
              className="bg-black text-white py-3 rounded-lg hover:bg-gray-900 transition"
            >
              View My Orders
            </Link>

            <Link
              to="/products"
              className="border border-gray-300 py-3 rounded-lg hover:bg-gray-50 transition"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  /*
   * PAYMENT SUCCESS
   */
  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4 py-10">
      <div className="max-w-md w-full text-center">

        {/* Success Icon */}
        <div className="w-20 h-20 mx-auto rounded-full bg-green-100 flex items-center justify-center">
          <span className="text-4xl text-green-600">
            ✓
          </span>
        </div>

        <h1 className="text-3xl font-bold mt-6">
          Payment Successful!
        </h1>

        <p className="text-gray-600 mt-3">
          Your payment has been successfully confirmed.
          Your order has been placed.
        </p>

        {/* Order Information */}
        <div className="mt-6 bg-gray-50 rounded-lg p-5 text-left">

          <p className="text-sm text-gray-500">
            Payment Status
          </p>

          <p className="font-semibold text-green-600">
            PAID ✓
          </p>

          <p className="text-sm text-gray-500 mt-4">
            Order ID
          </p>

          <p className="font-medium break-all">
            {order.id}
          </p>

          <p className="text-sm text-gray-500 mt-4">
            Order Status
          </p>

          <p className="font-semibold">
            {order.status}
          </p>

          <p className="text-sm text-gray-500 mt-4">
            Amount Paid
          </p>

          <p className="font-semibold text-lg">
            {Number(order.totalPrice).toFixed(2)} ETB
          </p>

          {order.payment?.transactionId && (
            <>
              <p className="text-sm text-gray-500 mt-4">
                Transaction Reference
              </p>

              <p className="font-medium break-all text-sm">
                {order.payment.transactionId}
              </p>
            </>
          )}
        </div>

        {/* Purchased Items */}
        {order.items && order.items.length > 0 && (
          <div className="mt-6 bg-gray-50 rounded-lg p-5 text-left">

            <h2 className="font-semibold mb-4">
              Order Items
            </h2>

            <div className="space-y-4">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3"
                >
                  {item.product.images?.[0] && (
                    <img
                      src={item.product.images[0].imageUrl}
                      alt={item.product.name}
                      className="w-14 h-14 object-cover rounded"
                    />
                  )}

                  <div className="flex-1">
                    <p className="font-medium">
                      {item.product.name}
                    </p>

                    <p className="text-sm text-gray-500">
                      Qty: {item.quantity}
                    </p>
                  </div>

                  <p className="font-semibold">
                    {(
                      Number(item.price) * item.quantity
                    ).toFixed(2)}{" "}
                    ETB
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Buttons */}
        <div className="flex flex-col gap-3 mt-8">

          <Link
            to="/orders"
            className="bg-black text-white py-3 rounded-lg hover:bg-gray-900 transition"
          >
            View My Orders
          </Link>

          <Link
            to="/products"
            className="border border-gray-300 py-3 rounded-lg hover:bg-gray-50 transition"
          >
            Continue Shopping
          </Link>

        </div>
      </div>
    </div>
  );
}

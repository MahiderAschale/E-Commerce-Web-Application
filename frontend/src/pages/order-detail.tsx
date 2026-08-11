import{ useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Navbar from "@/component/Navbar";
import { getOrder, cancelOrder } from "../services/order.service";

type Product = {
  id: string;
  name: string;
  price: string | number;
};

type OrderItem = {
  id: string;
  quantity: number;
  price: string | number;
  product: Product;
};

type Address = {
  id: string;
  fullName: string;
  phone: string;
  country: string;
  city: string;
  subCity: string;
  woreda?: string;
  houseNumber?: string;
};

type Payment = {
  id: string;
  method: string;
  status: string;
  transactionId?: string | null;
};

type Order = {
  id: string;
  status: string;
  paymentStatus: string;
  totalPrice: string | number;
  createdAt: string;
  address: Address | null;
  payment: Payment | null;
  items: OrderItem[];
};

export default function OrderDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) {
      setError("Order ID is missing.");
      setLoading(false);
      return;
    }

    const loadOrder = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getOrder(id);

        setOrder(response.data);
      } catch (err: any) {
        console.error("Failed to load order:", err);

        setError(
          err.response?.data?.message ||
            "Failed to load order details."
        );
      } finally {
        setLoading(false);
      }
    };

    loadOrder();
  }, [id]);

  const handleCancelOrder = async () => {
    if (!id || !order) return;

    const confirmed = window.confirm(
      "Are you sure you want to cancel this order?"
    );

    if (!confirmed) return;

    try {
      setCancelling(true);
      setError("");

      const response = await cancelOrder(id);

      setOrder(response.data);

      alert("Order cancelled successfully.");
    } catch (err: any) {
      console.error("Failed to cancel order:", err);

      setError(
        err.response?.data?.message ||
          "Failed to cancel order."
      );
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />

        <div className="min-h-screen flex items-center justify-center">
          <p className="text-gray-600">
            Loading order details...
          </p>
        </div>
      </>
    );
  }

  if (error && !order) {
    return (
      <>
        <Navbar />

        <div className="min-h-screen flex items-center justify-center px-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600">
              Unable to Load Order
            </h1>

            <p className="text-gray-600 mt-3">
              {error}
            </p>

            <Link
              to="/orders"
              className="inline-block mt-6 bg-black text-white px-6 py-3 rounded-lg"
            >
              Back to Orders
            </Link>
          </div>
        </div>
      </>
    );
  }

  if (!order) {
    return null;
  }

  const subtotal = order.items.reduce(
    (sum, item) =>
      sum +
      Number(item.price) * item.quantity,
    0
  );

  const shipping =
    Number(order.totalPrice) - subtotal;

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gray-50 py-10 px-4">
        <div className="max-w-5xl mx-auto">

          {/* Back */}
          <button
            onClick={() => navigate("/orders")}
            className="text-gray-600 hover:text-black mb-6"
          >
            ← Back to Orders
          </button>

          {/* Header */}
          <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

              <div>
                <p className="text-sm text-gray-500">
                  Order ID
                </p>

                <h1 className="font-bold text-lg break-all">
                  {order.id}
                </h1>

                <p className="text-sm text-gray-500 mt-2">
                  Placed on{" "}
                  {new Date(
                    order.createdAt
                  ).toLocaleString()}
                </p>
              </div>

              <div className="flex gap-3 flex-wrap">
                <span
                  className={`px-4 py-2 rounded-full text-sm font-medium ${
                    order.status === "CONFIRMED"
                      ? "bg-green-100 text-green-700"
                      : order.status === "CANCELLED"
                      ? "bg-red-100 text-red-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {order.status}
                </span>

                <span
                  className={`px-4 py-2 rounded-full text-sm font-medium ${
                    order.paymentStatus === "PAID"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  Payment: {order.paymentStatus}
                </span>
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 mb-6">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">

              {/* Products */}
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h2 className="text-xl font-semibold mb-5">
                  Order Items
                </h2>

                <div className="space-y-5">
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between gap-4 border-b last:border-b-0 pb-5 last:pb-0"
                    >
                      <div>
                        <h3 className="font-medium">
                          {item.product.name}
                        </h3>

                        <p className="text-sm text-gray-500 mt-1">
                          Quantity: {item.quantity}
                        </p>

                        <p className="text-sm text-gray-500">
                          Unit price:{" "}
                          {Number(
                            item.price
                          ).toFixed(2)}{" "}
                          ETB
                        </p>
                      </div>

                      <p className="font-semibold whitespace-nowrap">
                        {(
                          Number(item.price) *
                          item.quantity
                        ).toFixed(2)}{" "}
                        ETB
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h2 className="text-xl font-semibold mb-5">
                  Order Summary
                </h2>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      Subtotal
                    </span>

                    <span>
                      {subtotal.toFixed(2)} ETB
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      Shipping
                    </span>

                    <span>
                      {shipping.toFixed(2)} ETB
                    </span>
                  </div>

                  <div className="border-t pt-3 flex justify-between">
                    <span className="font-semibold">
                      Total
                    </span>

                    <span className="font-bold text-lg">
                      {Number(
                        order.totalPrice
                      ).toFixed(2)}{" "}
                      ETB
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">

              {/* Payment */}
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h2 className="text-lg font-semibold mb-4">
                  Payment
                </h2>

                {order.payment ? (
                  <div className="space-y-3 text-sm">
                    <div>
                      <p className="text-gray-500">
                        Method
                      </p>

                      <p className="font-medium">
                        {order.payment.method}
                      </p>
                    </div>

                    <div>
                      <p className="text-gray-500">
                        Status
                      </p>

                      <p
                        className={
                          order.payment.status ===
                          "PAID"
                            ? "font-medium text-green-600"
                            : "font-medium text-yellow-600"
                        }
                      >
                        {order.payment.status}
                      </p>
                    </div>

                    {order.payment.transactionId && (
                      <div>
                        <p className="text-gray-500">
                          Transaction Reference
                        </p>

                        <p className="font-medium break-all">
                          {
                            order.payment
                              .transactionId
                          }
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-500">
                    No payment information available.
                  </p>
                )}
              </div>

              {/* Shipping Address */}
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h2 className="text-lg font-semibold mb-4">
                  Shipping Address
                </h2>

                {order.address ? (
                  <div className="text-sm space-y-1">
                    <p className="font-medium">
                      {order.address.fullName}
                    </p>

                    <p>
                      {order.address.phone}
                    </p>

                    <p>
                      {order.address.country}
                    </p>

                    <p>
                      {order.address.city},{" "}
                      {order.address.subCity}
                    </p>

                    {order.address.woreda && (
                      <p>
                        Woreda{" "}
                        {order.address.woreda}
                      </p>
                    )}

                    {order.address.houseNumber && (
                      <p>
                        House{" "}
                        {order.address.houseNumber}
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-500">
                    No shipping address available.
                  </p>
                )}
              </div>

              {/* Actions */}
              {order.status === "PENDING" && (
                <div className="bg-white rounded-xl shadow-sm border p-6">
                  <button
                    onClick={handleCancelOrder}
                    disabled={cancelling}
                    className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-300 text-white py-3 rounded-lg transition"
                  >
                    {cancelling
                      ? "Cancelling..."
                      : "Cancel Order"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

import { useEffect, useState } from "react";
import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  getOrder,
  cancelOrder,
} from "../services/order.service";

type OrderItem = {
  id: string;
  quantity: number;
  price: string | number;
  product: {
    id: string;
    name: string;
    price: string | number;
    images?: {
      imageUrl: string;
    }[];
  };
};

type Order = {
  id: string;
  status: string;
  paymentStatus: string;
  totalPrice: string | number;
  createdAt: string;

  address?: {
    fullName: string;
    phone: string;
    country: string;
    city: string;
    subCity: string;
    woreda?: string;
    houseNumber?: string;
  };

  payment?: {
    method: string;
    status: string;
    transactionId?: string | null;
  };

  items: OrderItem[];
};

export default function OrderDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] =
    useState<Order | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [cancelling, setCancelling] =
    useState(false);

  useEffect(() => {
    if (id) {
      fetchOrder();
    }
  }, [id]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getOrder(id!);

      setOrder(response.data);
    } catch (err: any) {
      console.error(
        "Failed to load order:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Failed to load order."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!order) return;

    const confirmed = window.confirm(
      "Are you sure you want to cancel this order?"
    );

    if (!confirmed) return;

    try {
      setCancelling(true);

      const response =
        await cancelOrder(order.id);

      setOrder(response.data);

      alert("Order cancelled successfully.");
    } catch (err: any) {
      console.error(
        "Failed to cancel order:",
        err
      );

      alert(
        err.response?.data?.message ||
          "Failed to cancel order."
      );
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">
          Loading order...
        </p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50 px-6 py-12">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow p-8">

          <h1 className="text-2xl font-bold text-black">
            Order Not Found
          </h1>

          <p className="text-gray-500 mt-2">
            {error || "This order could not be found."}
          </p>

          <Link
            to="/orders"
            className="inline-block mt-6 bg-black text-white px-6 py-3 rounded-lg"
          >
            Back to Orders
          </Link>

        </div>
      </div>
    );
  }

  const subtotal = order.items.reduce(
    (sum, item) =>
      sum +
      Number(item.price) *
        item.quantity,
    0
  );

  const shipping = Number(
    order.totalPrice
  ) - subtotal;

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">

      <div className="max-w-5xl mx-auto">

        {/* Back */}
        <button
          onClick={() => navigate("/orders")}
          className="text-sm text-gray-600 hover:text-black mb-6"
        >
          ← Back to Orders
        </button>

        {/* Header */}
        <div className="bg-white rounded-2xl shadow p-6 mb-6">

          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">

            <div>
              <h1 className="text-2xl font-bold text-black">
                Order Details
              </h1>

              <p className="text-sm text-gray-500 mt-2 break-all">
                Order ID: {order.id}
              </p>

              <p className="text-sm text-gray-500">
                {new Date(
                  order.createdAt
                ).toLocaleString()}
              </p>
            </div>

            <div className="flex gap-3">

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
                  order.paymentStatus ===
                  "PAID"
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {order.paymentStatus}
              </span>

            </div>

          </div>

        </div>

        {/* Order Items */}
        <div className="bg-white rounded-2xl shadow p-6 mb-6">

          <h2 className="text-xl font-semibold text-black mb-6">
            Order Items
          </h2>

          <div className="space-y-5">

            {order.items.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 border-b pb-5 last:border-b-0 last:pb-0"
              >

                {item.product.images?.[0]
                  ?.imageUrl ? (
                  <img
                    src={
                      item.product
                        .images[0]
                        .imageUrl
                    }
                    alt={item.product.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-20 h-20 bg-gray-100 rounded-lg" />
                )}

                <div className="flex-1">

                  <h3 className="font-semibold text-black">
                    {item.product.name}
                  </h3>

                  <p className="text-sm text-gray-500 mt-1">
                    Quantity: {item.quantity}
                  </p>

                  <p className="text-sm text-gray-500">
                    Unit Price:{" "}
                    {Number(
                      item.price
                    ).toFixed(2)}{" "}
                    ETB
                  </p>

                </div>

                <p className="font-bold text-black">
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

        {/* Shipping Address */}
        {order.address && (
          <div className="bg-white rounded-2xl shadow p-6 mb-6">

            <h2 className="text-xl font-semibold text-black mb-5">
              Shipping Address
            </h2>

            <div className="text-gray-600 space-y-1">

              <p className="font-semibold text-black">
                {order.address.fullName}
              </p>

              <p>
                {order.address.phone}
              </p>

              <p>
                {order.address.country},{" "}
                {order.address.city}
              </p>

              <p>
                {order.address.subCity}
                {order.address.woreda &&
                  `, Woreda ${order.address.woreda}`}
              </p>

              {order.address.houseNumber && (
                <p>
                  House Number:{" "}
                  {order.address.houseNumber}
                </p>
              )}

            </div>

          </div>
        )}

        {/* Payment */}
        {order.payment && (
          <div className="bg-white rounded-2xl shadow p-6 mb-6">

            <h2 className="text-xl font-semibold text-black mb-5">
              Payment Information
            </h2>

            <div className="space-y-3">

              <div className="flex justify-between">
                <span className="text-gray-500">
                  Method
                </span>

                <span className="font-medium text-black">
                  {order.payment.method}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">
                  Status
                </span>

                <span className="font-medium text-green-600">
                  {order.payment.status}
                </span>
              </div>

              {order.payment
                .transactionId && (
                <div className="flex flex-col mt-3">
                  <span className="text-gray-500 text-sm">
                    Transaction Reference
                  </span>

                  <span className="font-medium text-black break-all">
                    {
                      order.payment
                        .transactionId
                    }
                  </span>
                </div>
              )}

            </div>

          </div>
        )}

        {/* Price Summary */}
        <div className="bg-white rounded-2xl shadow p-6 mb-6">

          <h2 className="text-xl font-semibold text-black mb-5">
            Order Summary
          </h2>

          <div className="space-y-3">

            <div className="flex justify-between">
              <span className="text-gray-500">
                Subtotal
              </span>

              <span className="text-black">
                {subtotal.toFixed(2)} ETB
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-500">
                Shipping
              </span>

              <span className="text-black">
                {shipping.toFixed(2)} ETB
              </span>
            </div>

            <div className="border-t pt-3 flex justify-between">
              <span className="font-bold text-black">
                Total
              </span>

              <span className="font-bold text-black text-xl">
                {Number(
                  order.totalPrice
                ).toFixed(2)}{" "}
                ETB
              </span>
            </div>

          </div>

        </div>

        {/* Actions */}
        <div className="flex flex-col md:flex-row gap-4">

          {order.status === "PENDING" && (
            <button
              onClick={handleCancel}
              disabled={cancelling}
              className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition disabled:opacity-50"
            >
              {cancelling
                ? "Cancelling..."
                : "Cancel Order"}
            </button>
          )}

          <Link
            to="/orders"
            className="border border-gray-300 text-black px-6 py-3 rounded-lg text-center hover:bg-gray-50 transition"
          >
            Back to Orders
          </Link>

          <Link
            to="/products"
            className="bg-black text-white px-6 py-3 rounded-lg text-center hover:bg-gray-900 transition"
          >
            Continue Shopping
          </Link>

        </div>

      </div>
    </div>
  );
}
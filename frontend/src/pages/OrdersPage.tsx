import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getOrders } from "../services/order.service";
import Navbar from "@/component/Navbar";

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

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadOrders = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getOrders();

        setOrders(response.data || []);
      } catch (err: any) {
        console.error("Failed to load orders:", err);

        setError(
          err.response?.data?.message ||
            "Failed to load your orders."
        );
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  if (loading) {
    return (
      <>
        <Navbar />

        <div className="min-h-screen flex items-center justify-center">
          <p className="text-gray-600">
            Loading your orders...
          </p>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />

        <div className="min-h-screen flex items-center justify-center px-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600">
              Failed to Load Orders
            </h1>

            <p className="mt-3 text-gray-600">
              {error}
            </p>

            <Link
              to="/products"
              className="inline-block mt-6 bg-black text-white px-6 py-3 rounded-lg"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gray-50 py-10 px-4">
        <div className="max-w-6xl mx-auto">

          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold">
                My Orders
              </h1>

              <p className="text-gray-600 mt-2">
                View and manage your orders.
              </p>
            </div>

            <Link
              to="/products"
              className="bg-black text-white px-5 py-3 rounded-lg"
            >
              Continue Shopping
            </Link>
          </div>

          {orders.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-10 text-center">
              <h2 className="text-xl font-semibold">
                No Orders Yet
              </h2>

              <p className="text-gray-600 mt-2">
                You haven't placed any orders yet.
              </p>

              <Link
                to="/products"
                className="inline-block mt-6 bg-black text-white px-6 py-3 rounded-lg"
              >
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white rounded-xl shadow-sm border p-6"
                >
                  {/* Order Header */}
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b pb-5">
                    <div>
                      <p className="text-sm text-gray-500">
                        Order ID
                      </p>

                      <p className="font-semibold break-all">
                        {order.id}
                      </p>

                      <p className="text-sm text-gray-500 mt-2">
                        {new Date(
                          order.createdAt
                        ).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="flex gap-3">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
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
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          order.paymentStatus === "PAID"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {order.paymentStatus}
                      </span>
                    </div>
                  </div>

                  {/* Items */}
                  <div className="py-5 space-y-4">
                    {order.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between gap-4"
                      >
                        <div>
                          <p className="font-medium">
                            {item.product.name}
                          </p>

                          <p className="text-sm text-gray-500">
                            Qty: {item.quantity}
                          </p>
                        </div>

                        <p className="font-semibold">
                          {(
                            Number(item.price) *
                            item.quantity
                          ).toFixed(2)}{" "}
                          ETB
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Address */}
                  {order.address && (
                    <div className="border-t pt-5">
                      <p className="text-sm text-gray-500">
                        Shipping Address
                      </p>

                      <p className="font-medium mt-1">
                        {order.address.fullName}
                      </p>

                      <p className="text-sm text-gray-600">
                        {order.address.city},{" "}
                        {order.address.subCity}
                        {order.address.woreda
                          ? `, Woreda ${order.address.woreda}`
                          : ""}
                      </p>

                      <p className="text-sm text-gray-600">
                        {order.address.phone}
                      </p>
                    </div>
                  )}

                  {/* Footer */}
                  <div className="border-t mt-5 pt-5 flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">
                        Total
                      </p>

                      <p className="text-xl font-bold">
                        {Number(
                          order.totalPrice
                        ).toFixed(2)}{" "}
                        ETB
                      </p>
                    </div>

                    {order.payment && (
                      <div className="text-right">
                        <p className="text-sm text-gray-500">
                          Payment
                        </p>

                        <p className="font-medium">
                          {order.payment.method}
                        </p>

                        <p
                          className={
                            order.payment.status === "PAID"
                              ? "text-green-600 font-medium"
                              : "text-yellow-600 font-medium"
                          }
                        >
                          {order.payment.status}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}

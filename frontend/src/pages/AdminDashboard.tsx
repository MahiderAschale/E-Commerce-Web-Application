import { useEffect, useState } from "react";
import { getAdminDashboard } from "../services/admin.service";
import { Link } from "react-router-dom";
interface DashboardData {
  totalProducts: number;
  totalCategories: number;
  totalCustomers: number;
  totalOrders: number;
  pendingOrders: number;
  paidOrders: number;
  revenue: number;
  recentOrders: any[];
}

export default function AdminDashboard() {
  const [dashboard, setDashboard] =
    useState<DashboardData | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const response = await getAdminDashboard();

        setDashboard(response.data);
      } catch (err: any) {
        console.error("Failed to load dashboard:", err);

        setError(
          err.response?.data?.message ||
            "Failed to load admin dashboard."
        );
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-gray-200 border-t-black rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-sm border p-8 text-center max-w-md w-full">
          <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
            <span className="text-red-600 text-2xl">!</span>
          </div>
  
          <h2 className="text-xl font-bold text-gray-900">
            Something went wrong
          </h2>
  
          <p className="text-red-600 mt-2">
            {error}
          </p>
        </div>
      </div>
    );
  }
  
  if (!dashboard) {
    return null;
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
  
      {/* ================================
          HEADER
      ================================= */}
  
      <header className="bg-black text-white">
        <div className="max-w-7xl mx-auto px-6 py-6">
  
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
  
            <div>
              <p className="text-sm text-gray-400 mb-1">
                Administration
              </p>
  
              <h1 className="text-3xl font-bold">
                Admin Dashboard
              </h1>
  
              <p className="text-gray-400 mt-1">
                Manage your store and monitor activity
              </p>
            </div>
  
            <Link
              to="/"
              className="inline-flex items-center justify-center px-5 py-3 rounded-lg bg-white text-black font-medium hover:bg-gray-100 transition"
            >
              View Store
            </Link>
  
          </div>
  
        </div>
      </header>
  
  
      {/* ================================
          MAIN
      ================================= */}
  
      <main className="max-w-7xl mx-auto px-6 py-8">
  
  
        {/* ================================
            QUICK ACTIONS
        ================================= */}
  
        <section className="mb-10">
  
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Quick Actions
              </h2>
  
              <p className="text-gray-500 text-sm mt-1">
                Manage your store
              </p>
            </div>
          </div>
  
  
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
  
            {/* Products */}
  
            <Link
              to="/admin/products"
              className="group bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg hover:-translate-y-1 transition-all"
            >
              <div className="flex items-center justify-between">
  
                <div className="w-12 h-12 rounded-xl bg-black text-white flex items-center justify-center text-xl">
                  📦
                </div>
  
                <span className="text-gray-400 group-hover:text-black transition">
                  →
                </span>
  
              </div>
  
              <h3 className="font-bold text-lg mt-5">
                Products
              </h3>
  
              <p className="text-gray-500 text-sm mt-1">
                Add, edit and manage products
              </p>
            </Link>
  
  
            {/* Categories */}
  
            <Link
              to="/admin/categories"
              className="group bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg hover:-translate-y-1 transition-all"
            >
              <div className="flex items-center justify-between">
  
                <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center text-xl">
                  🏷️
                </div>
  
                <span className="text-gray-400 group-hover:text-black transition">
                  →
                </span>
  
              </div>
  
              <h3 className="font-bold text-lg mt-5">
                Categories
              </h3>
  
              <p className="text-gray-500 text-sm mt-1">
                Organize your products
              </p>
            </Link>
  
  
            {/* Orders */}
  
            <Link
              to="/admin/orders"
              className="group bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg hover:-translate-y-1 transition-all"
            >
              <div className="flex items-center justify-between">
  
                <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center text-xl">
                  🛒
                </div>
  
                <span className="text-gray-400 group-hover:text-black transition">
                  →
                </span>
  
              </div>
  
              <h3 className="font-bold text-lg mt-5">
                Orders
              </h3>
  
              <p className="text-gray-500 text-sm mt-1">
                View and manage orders
              </p>
            </Link>
  
  
            {/* Customers */}
  
            <div className="bg-white border border-gray-200 rounded-2xl p-6">
  
              <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center text-xl">
                👥
              </div>
  
              <h3 className="font-bold text-lg mt-5">
                Customers
              </h3>
  
              <p className="text-gray-500 text-sm mt-1">
                {dashboard.totalCustomers} registered customers
              </p>
  
            </div>
  
          </div>
  
        </section>
  
  
        {/* ================================
            STATISTICS
        ================================= */}
  
        <section>
  
          <div className="mb-5">
            <h2 className="text-xl font-bold">
              Store Overview
            </h2>
  
            <p className="text-gray-500 text-sm mt-1">
              Important statistics about your store
            </p>
          </div>
  
  
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
  
  
            {/* Products */}
  
            <div className="bg-white border border-gray-200 rounded-2xl p-6">
  
              <div className="flex items-center justify-between">
  
                <p className="text-gray-500 text-sm">
                  Total Products
                </p>
  
                <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                  📦
                </div>
  
              </div>
  
              <p className="text-3xl font-bold mt-4">
                {dashboard.totalProducts}
              </p>
  
              <p className="text-xs text-gray-400 mt-2">
                Products in store
              </p>
  
            </div>
  
  
            {/* Categories */}
  
            <div className="bg-white border border-gray-200 rounded-2xl p-6">
  
              <div className="flex items-center justify-between">
  
                <p className="text-gray-500 text-sm">
                  Categories
                </p>
  
                <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                  🏷️
                </div>
  
              </div>
  
              <p className="text-3xl font-bold mt-4">
                {dashboard.totalCategories}
              </p>
  
              <p className="text-xs text-gray-400 mt-2">
                Product categories
              </p>
  
            </div>
  
  
            {/* Customers */}
  
            <div className="bg-white border border-gray-200 rounded-2xl p-6">
  
              <div className="flex items-center justify-between">
  
                <p className="text-gray-500 text-sm">
                  Customers
                </p>
  
                <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                  👥
                </div>
  
              </div>
  
              <p className="text-3xl font-bold mt-4">
                {dashboard.totalCustomers}
              </p>
  
              <p className="text-xs text-gray-400 mt-2">
                Registered buyers
              </p>
  
            </div>
  
  
            {/* Orders */}
  
            <div className="bg-white border border-gray-200 rounded-2xl p-6">
  
              <div className="flex items-center justify-between">
  
                <p className="text-gray-500 text-sm">
                  Orders
                </p>
  
                <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                  🛍️
                </div>
  
              </div>
  
              <p className="text-3xl font-bold mt-4">
                {dashboard.totalOrders}
              </p>
  
              <p className="text-xs text-gray-400 mt-2">
                Total orders
              </p>
  
            </div>
  
          </div>
  
        </section>
  
  
        {/* ================================
            SALES
        ================================= */}
  
        <section className="mt-8">
  
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
  
  
            {/* Paid */}
  
            <div className="bg-white border border-gray-200 rounded-2xl p-6">
  
              <p className="text-sm text-gray-500">
                Paid Orders
              </p>
  
              <p className="text-3xl font-bold text-green-600 mt-3">
                {dashboard.paidOrders}
              </p>
  
              <div className="mt-4 h-1.5 bg-green-100 rounded-full">
                <div className="h-full bg-green-500 rounded-full w-3/4" />
              </div>
  
            </div>
  
  
            {/* Pending */}
  
            <div className="bg-white border border-gray-200 rounded-2xl p-6">
  
              <p className="text-sm text-gray-500">
                Pending Orders
              </p>
  
              <p className="text-3xl font-bold text-yellow-600 mt-3">
                {dashboard.pendingOrders}
              </p>
  
              <div className="mt-4 h-1.5 bg-yellow-100 rounded-full">
                <div className="h-full bg-yellow-500 rounded-full w-1/3" />
              </div>
  
            </div>
  
  
            {/* Revenue */}
  
            <div className="bg-black text-white rounded-2xl p-6">
  
              <p className="text-sm text-gray-400">
                Total Revenue
              </p>
  
              <p className="text-3xl font-bold mt-3">
                {dashboard.revenue.toFixed(2)} ETB
              </p>
  
              <p className="text-sm text-gray-400 mt-4">
                Revenue from paid orders
              </p>
  
            </div>
  
          </div>
  
        </section>
  
  
        {/* ================================
            RECENT ORDERS
        ================================= */}
  
        <section className="bg-white border border-gray-200 rounded-2xl mt-8 overflow-hidden">
  
          <div className="px-6 py-5 border-b flex items-center justify-between">
  
            <div>
              <h2 className="text-xl font-bold">
                Recent Orders
              </h2>
  
              <p className="text-sm text-gray-500 mt-1">
                Latest activity in your store
              </p>
            </div>
  
            <Link
              to="/admin/orders"
              className="text-sm font-medium hover:underline"
            >
              View all
            </Link>
  
          </div>
  
  
          {dashboard.recentOrders.length === 0 ? (
  
            <div className="p-10 text-center">
              <p className="text-gray-500">
                No orders yet.
              </p>
            </div>
  
          ) : (
  
            <div>
  
              {dashboard.recentOrders.map((order) => (
  
                <div
                  key={order.id}
                  className="px-6 py-5 border-b last:border-b-0 hover:bg-gray-50 transition"
                >
  
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
  
                    <div>
  
                      <p className="font-semibold">
                        {order.user?.fullName || "Customer"}
                      </p>
  
                      <p className="text-sm text-gray-500">
                        {order.user?.email}
                      </p>
  
                    </div>
  
  
                    <div className="sm:text-right">
  
                      <p className="font-bold">
                        {Number(order.totalPrice).toFixed(2)} ETB
                      </p>
  
                      <span
                        className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-medium ${
                          order.paymentStatus === "PAID"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {order.paymentStatus}
                      </span>
  
                    </div>
  
                  </div>
  
                </div>
  
              ))}
  
            </div>
  
          )}
  
        </section>
  
      </main>
  
    </div>
  );}
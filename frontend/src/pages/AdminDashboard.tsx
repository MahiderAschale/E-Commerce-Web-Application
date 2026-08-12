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
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (!dashboard) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">

        <h1 className="text-3xl font-bold mb-8">
          Admin Dashboard
        </h1>
       

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

<Link
  to="/admin/products"
  className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition"
>
  <h2 className="text-xl font-bold">
    Products
  </h2>

  <p className="text-gray-500 mt-2">
    Add, edit and delete products
  </p>
</Link>

</div>

        {/* Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

          <div className="bg-white rounded-xl p-6 shadow">
            <p className="text-gray-500">
              Products
            </p>

            <p className="text-3xl font-bold mt-2">
              {dashboard.totalProducts}
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow">
            <p className="text-gray-500">
              Categories
            </p>

            <p className="text-3xl font-bold mt-2">
              {dashboard.totalCategories}
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow">
            <p className="text-gray-500">
              Customers
            </p>

            <p className="text-3xl font-bold mt-2">
              {dashboard.totalCustomers}
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow">
            <p className="text-gray-500">
              Orders
            </p>

            <p className="text-3xl font-bold mt-2">
              {dashboard.totalOrders}
            </p>
          </div>

        </div>

        {/* Orders / Revenue */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">

          <div className="bg-white rounded-xl p-6 shadow">
            <p className="text-gray-500">
              Paid Orders
            </p>

            <p className="text-3xl font-bold text-green-600 mt-2">
              {dashboard.paidOrders}
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow">
            <p className="text-gray-500">
              Pending Orders
            </p>

            <p className="text-3xl font-bold text-yellow-600 mt-2">
              {dashboard.pendingOrders}
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow">
            <p className="text-gray-500">
              Revenue
            </p>

            <p className="text-3xl font-bold mt-2">
              {dashboard.revenue.toFixed(2)} ETB
            </p>
          </div>

        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-xl shadow mt-8 p-6">

          <h2 className="text-xl font-bold mb-4">
            Recent Orders
          </h2>

          {dashboard.recentOrders.length === 0 ? (
            <p className="text-gray-500">
              No orders yet.
            </p>
          ) : (
            <div className="space-y-4">

              {dashboard.recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="border-b pb-4"
                >
                  <div className="flex justify-between">

                    <div>
                      <p className="font-semibold">
                        {order.user?.fullName}
                      </p>

                      <p className="text-sm text-gray-500">
                        {order.user?.email}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="font-semibold">
                        {Number(order.totalPrice).toFixed(2)} ETB
                      </p>

                      <p className="text-sm">
                        {order.paymentStatus}
                      </p>
                    </div>

                  </div>
                </div>
              ))}

            </div>
          )}

        </div>

      </div>
    </div>
  );
}
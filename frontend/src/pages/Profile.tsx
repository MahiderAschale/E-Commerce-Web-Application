import { User, Mail, Phone, Pencil } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../component/Navbar"

export default function ProfilePage() {
  const { user } = useAuth();

  return (
    <div className=" bg-gray-50 flex flex-col ">
        <Navbar/>
      <div className="min-h-screen w-full max-w-2xl items-center justify-center px-4 py-10">

      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-black">
            My Profile
          </h1>

          <p className="text-gray-500 mt-2">
            View your personal information.
          </p>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">

          {/* Top Section */}
          <div className="px-8 py-10 border-b flex flex-col items-center">

            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user.fullName}
                className="w-28 h-28 rounded-full object-cover border-4 border-gray-200"
              />
            ) : (
              <div className="w-28 h-28 rounded-full bg-gray-100 flex items-center justify-center border-4 border-gray-200">
                <User size={45} className="text-gray-400" />
              </div>
            )}

            <h2 className="mt-5 text-2xl font-bold text-black">
              {user?.fullName}
            </h2>

            <p className="text-gray-500">
              Registered User
            </p>

          </div>

          {/* Information */}
          <div className="p-8 space-y-6">

            <div className="flex items-center justify-between border-b pb-4">
              <div className="flex items-center gap-3">
                <User className="text-gray-400" size={20} />

                <div>
                  <p className="text-sm text-gray-500">
                    Full Name
                  </p>

                  <p className="font-medium text-black">
                    {user?.fullName}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between border-b pb-4">
              <div className="flex items-center gap-3">
                <Mail className="text-gray-400" size={20} />

                <div>
                  <p className="text-sm text-gray-500">
                    Email
                  </p>

                  <p className="font-medium text-black">
                    {user?.email}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Phone className="text-gray-400" size={20} />

                <div>
                  <p className="text-sm text-gray-500">
                    Phone
                  </p>

                  <p className="font-medium text-black">
                    {user?.phone || "Not provided"}
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* Footer */}
          <div className="px-8 py-6 bg-gray-50 border-t">

            <Link
              to="/"
              className="inline-flex items-center gap-2 bg-black text-white px-5 py-3 rounded-lg hover:bg-gray-900 transition"
            >
              <Pencil size={18} />
              Edit Profile
            </Link>

          </div>

        </div>

      </div>
</div>
    </div>
  );
}
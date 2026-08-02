import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  UserPlus,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";

export default function AccountPage() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName || !email || !password) {
      alert("Please fill out all fields.");
      return;
    }

    try {
      setLoading(true);

      await register({
        fullName,
        email,
        password,
      });

      alert("Account created successfully!");

      navigate("/");
    } catch (error: any) {
      console.error(error);

      alert(
        error?.response?.data?.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex  bg-gray-50">

      
          {/* Left Side - Full Image */}
  <div className="hidden lg:block w-3/5">
    <img
      src="/login.jpg" // Replace with your image
      alt="Login"
      className="w-full h-screen object-cover"
    />
  </div>

        {/* Right Side */}
        <div className="w-full lg:w-3/5 flex items-center justify-center px-6 py-10">

          <div className="w-full max-w-md">

            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-black mb-4">
                <UserPlus className="w-6 h-6 text-white" />
              </div>

              <h1 className="text-3xl font-bold text-black">
                Create Account
              </h1>

              <p className="mt-2 text-sm text-black">
                Create your account to get started.
              </p>
            </div>

            {/* Card */}
            <div className="bg-white rounded-2xl shadow-lg p-8">

              <form
                onSubmit={handleSubmit}
                className="space-y-5"
              >

                {/* Full Name */}
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Full Name
                  </label>

                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />

                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) =>
                        setFullName(e.target.value)
                      }
                      placeholder="John Doe"
                      className="w-full h-11 pl-10 pr-4 rounded-lg border border-gray-200 bg-gray-100 text-black placeholder:text-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-black"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Email Address
                  </label>

                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />

                    <input
                      type="email"
                      value={email}
                      onChange={(e) =>
                        setEmail(e.target.value)
                      }
                      placeholder="you@example.com"
                      className="w-full h-11 pl-10 pr-4 rounded-lg border border-gray-200 bg-gray-100 text-black placeholder:text-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-black"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Password
                  </label>

                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />

                    <input
                      type={
                        showPassword
                          ? "text"
                          : "password"
                      }
                      value={password}
                      onChange={(e) =>
                        setPassword(e.target.value)
                      }
                      placeholder="••••••••"
                      className="w-full h-11 pl-10 pr-10 rounded-lg border border-gray-200 bg-gray-100 text-black placeholder:text-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-black"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(
                          !showPassword
                        )
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                </div>

                {/* Create Account Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-11 rounded-lg bg-black text-white font-medium hover:bg-gray-900 transition disabled:opacity-50"
                >
                  {loading
                    ? "Creating Account..."
                    : "Create Account"}
                </button>

                {/* Divider */}
                <div className="relative py-2">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>

                  <div className="relative flex justify-center">
                    <span className="bg-white px-3 text-sm text-gray-500">
                      Already have an account?
                    </span>
                  </div>
                </div>

                {/* Login */}
                <p className="text-center text-sm text-black">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="font-medium text-blue-600 hover:text-blue-700"
                  >
                    Sign In
                  </Link>
                </p>

              </form>

            </div>

          </div>

        </div>

      

    </div>
  );
}
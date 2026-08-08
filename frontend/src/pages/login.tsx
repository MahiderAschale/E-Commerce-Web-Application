import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, CheckCircle2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";


export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] =useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      setLoading(true);

      await login({
        email,
        password,
      });


      navigate("/");
    } catch (error: any) {
      console.error(error);

      alert(
        error?.response?.data?.message ||
          "Invalid email or password."
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    
       <div className="min-h-screen flex bg-gray-50">
  
         {/* Left Side - Full Image */}
  <div className="hidden lg:block w-3/5">
    <img
      src="/login.jpg" // Replace with your image
      alt="Login"
      className="w-full h-screen object-cover"
    />
  </div>
          
      {/* Right Side  */}
      <div className="w-full lg:w-3/5 flex items-center justify-center px-6 py-10">
        <div className="w-full max-w-md">
  
          {/* Logo */}
          <div className="mb-8 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-black mb-4">
              <CheckCircle2 className="w-6 h-6 text-white" />
            </div>
  
            <h1 className="text-3xl font-bold text-black">
              Welcome Back
            </h1>
  
            <p className="text-sm text-black mt-2">
              Sign in to continue to your account.
            </p>
          </div>
  
          
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8">

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Email Address
              </label>

              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-black w-5 h-5" />

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full h-11 pl-10 pr-4 text-black rounded-lg border border-gray-200 bg-white focus:bg-white focus:outline-none focus:ring-2 focus:ring-black transition"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Password
              </label>

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-black w-5 h-5" />

                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-11 pl-10 pr-10 text-black rounded-lg border border-gray-200 bg-gray-100 focus:bg-white focus:outline-none focus:ring-2 focus:ring-black transition"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-black hover:text-black"
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

               {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 rounded-lg bg-black text-white font-medium hover:bg-gray-900 transition disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>

            {/* Divider */}
            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>

              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-3 text-gray-500">
                  New here?
                </span>
              </div>
            </div>

            {/* Register */}
            <p className="text-center text-sm text-gray-900">
              Don't have an account?{" "}
              <Link
                to="/account"
                className="font-medium text-blue-600 hover:text-blue-700"
              >
                Register
              </Link>
            </p>

          </form>
        </div> 
        </div>
      </div>
    
    </div>
  );
}
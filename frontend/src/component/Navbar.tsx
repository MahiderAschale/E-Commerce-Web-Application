"use client";

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ShoppingBag,
  User,
  Menu,
  X,
  LogOut,
  LayoutDashboard,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cartCount] = useState(3);

  const navigate = useNavigate();

  const {
    user,
    logout,
    isAuthenticated,
    isAdmin,
  } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 relative z-10">
      <div className="container mx-auto px-4 py-4">

        <div className="flex items-center justify-between">

          {/* Logo */}

          <Link to="/" className="text-2xl font-bold">
            EFUYE TELETE
          </Link>

          {/* Desktop Navigation */}

          <nav className="hidden md:flex space-x-8">
            <Link to="/">HOME</Link>

            <Link to="/products">SHOP</Link>

            <Link to="/men">MEN</Link>

            <Link to="/women">WOMEN</Link>

            {isAdmin && (
              <Link
                to="/admin"
                className="font-medium text-red-600"
              >
                ADMIN
              </Link>
            )}
          </nav>

          {/* Desktop Right Side */}

          <div className="hidden md:flex items-center space-x-5">

            {isAuthenticated ? (
              <>
                <Link
                  to="/profile"
                  className="flex items-center gap-2"
                >
                  <User size={20} />
                  <span>{user?.fullName}</span>
                </Link>

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-red-500 hover:text-red-700"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login">
                  Login
                </Link>

                <Link to="/account">
                  Register
                </Link>
              </>
            )}

            {isAdmin && (
              <Link to="/admin">
                <LayoutDashboard size={20} />
              </Link>
            )}

            <Link
              to="/cart"
              className="relative"
            >
              <ShoppingBag size={22} />

              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-black text-white text-xs flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

          </div>

          {/* Mobile Menu Button */}

          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X size={24} />
            ) : (
              <Menu size={24} />
            )}
          </button>

        </div>

        {/* Mobile Menu */}

        {isMenuOpen && (
          <div className="md:hidden mt-6">

            <nav className="flex flex-col gap-4">

              <Link to="/">HOME</Link>

              <Link to="/products">SHOP</Link>

              <Link to="/men">MEN</Link>

              <Link to="/women">WOMEN</Link>

              {isAdmin && (
                <Link to="/dashboard">
                  ADMIN DASHBOARD
                </Link>
              )}

              {isAuthenticated ? (
                <>
                  <Link to="/profile">
                    My Profile
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="text-left text-red-600"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login">
                    Login
                  </Link>

                  <Link to="/account">
                    Register
                  </Link>
                </>
              )}

              <Link to="/cart">
                Cart ({cartCount})
              </Link>

            </nav>

          </div>
        )}

      </div>
    </header>
  );
};

export default Navbar;
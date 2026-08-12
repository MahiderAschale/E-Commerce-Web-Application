"use client";

import { useEffect, useState } from "react";
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
import { getCart } from "../services/cart.service";

const BURGUNDY = "#800020";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  const navigate = useNavigate();

  const {
    user,
    logout,
    isAuthenticated,
    isAdmin,
  } = useAuth();

  // ==========================================
  // Load cart count
  // ==========================================

  const loadCartCount = async () => {
    if (!isAuthenticated) {
      setCartCount(0);
      return;
    }

    try {
      const response = await getCart();

      const items = response.data?.items || [];

      const totalQuantity = items.reduce(
        (total: number, item: any) =>
          total + Number(item.quantity || 0),
        0
      );

      setCartCount(totalQuantity);
    } catch (error) {
      console.error("Failed to load cart:", error);
      setCartCount(0);
    }
  };

  useEffect(() => {
    loadCartCount();
  }, [isAuthenticated]);

  // ==========================================
  // Logout
  // ==========================================

  const handleLogout = async () => {
    try {
      await logout();
      setCartCount(0);
      navigate("/login");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 relative z-10">
      <div className="container mx-auto px-4 py-4">

        <div className="flex items-center justify-between">

          {/* ======================================
              Logo
          ====================================== */}

          <Link
            to="/"
            className="text-2xl font-bold tracking-tight"
            style={{ color: BURGUNDY }}
          >
            RUuby Store
          </Link>

          {/* ======================================
              Desktop Navigation
          ====================================== */}

          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium">

            <Link
              to="/"
              className="hover:text-[#800020] transition"
            >
              HOME
            </Link>

            <Link
              to="/products"
              className="hover:text-[#800020] transition"
            >
              SHOP
            </Link>

          
            {isAdmin && (
              <Link
                to="/admin/dashboard"
                className="font-semibold"
                style={{ color: BURGUNDY }}
              >
                ADMIN
              </Link>
            )}

          </nav>

          {/* ======================================
              Desktop Right Side
          ====================================== */}

          <div className="hidden md:flex items-center space-x-5">

            {isAuthenticated ? (
              <>
                <Link
                  to="/profile"
                  className="flex items-center gap-2 hover:text-[#800020] transition"
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
                <Link
                  to="/login"
                  className="hover:text-[#800020] transition"
                >
                  Login
                </Link>

                <Link
                  to="/account"
                  className="hover:text-[#800020] transition"
                >
                  Register
                </Link>
              </>
            )}

            {/* Admin Dashboard */}

            {isAdmin && (
              <Link
                to="/admin/dashboard"
                className="hover:text-[#800020] transition"
              >
                <LayoutDashboard size={20} />
              </Link>
            )}

            {/* ======================================
                Cart
            ====================================== */}

            <Link
              to="/cart"
              className="relative"
            >
              <ShoppingBag
                size={22}
                className="hover:text-[#800020] transition"
              />

              {cartCount > 0 && (
                <span
                  className="absolute -top-2 -right-2 w-5 h-5 rounded-full text-white text-xs flex items-center justify-center"
                  style={{ backgroundColor: BURGUNDY }}
                >
                  {cartCount}
                </span>
              )}
            </Link>

          </div>

          {/* ======================================
              Mobile Menu Button
          ====================================== */}

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

        {/* ======================================
            Mobile Menu
        ====================================== */}

        {isMenuOpen && (
          <div className="md:hidden mt-6 border-t pt-5">

            <nav className="flex flex-col gap-4 text-sm font-medium">

              <Link
                to="/"
                onClick={() => setIsMenuOpen(false)}
              >
                HOME
              </Link>

              <Link
                to="/products"
                onClick={() => setIsMenuOpen(false)}
              >
                SHOP
              </Link>

              <Link
                to="/men"
                onClick={() => setIsMenuOpen(false)}
              >
                MEN
              </Link>

              <Link
                to="/women"
                onClick={() => setIsMenuOpen(false)}
              >
                WOMEN
              </Link>

              {isAdmin && (
                <Link
                  to="/admin/dashboard"
                  onClick={() => setIsMenuOpen(false)}
                  style={{ color: BURGUNDY }}
                >
                  ADMIN DASHBOARD
                </Link>
              )}

              {isAuthenticated ? (
                <>
                  <Link
                    to="/profile"
                    onClick={() => setIsMenuOpen(false)}
                  >
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
                  <Link
                    to="/login"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>

                  <Link
                    to="/account"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Register
                  </Link>
                </>
              )}

              {/* Mobile Cart */}

              <Link
                to="/cart"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-2"
              >
                <ShoppingBag size={18} />

                <span>
                  Cart
                  {cartCount > 0 && ` (${cartCount})`}
                </span>
              </Link>

            </nav>

          </div>
        )}

      </div>
    </header>
  );
};

export default Navbar;
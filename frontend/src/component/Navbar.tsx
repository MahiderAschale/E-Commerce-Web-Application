"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { ShoppingBag, User, Search, Menu, X } from "lucide-react"

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [cartCount, setCartCount] = useState(3)

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
            <Link to="/" className="font-medium">
              HOME
            </Link>
            <Link to="/products" className="font-medium">
              SHOP
            </Link>
            <Link to="/men" className="font-medium">
              MEN
            </Link>
            <Link to="/women" className="font-medium">
              WOMEN
            </Link>
           
          </nav>

          {/* Desktop Icons */}
          <div className="hidden md:flex items-center space-x-6">
           
            <Link to="/account" aria-label="Account" className="p-1">
              <User size={20} />
            </Link>
            <Link to="/cart" aria-label="Cart" className="p-1 relative">
              <ShoppingBag size={20} />
              {cartCount > 3 && (
                <span className="absolute -top-1 -right-1 bg-black text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden p-1" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle menu">
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4">
            <nav className="flex flex-col space-y-4">
              <Link to="/" className="font-medium">
                HOME
              </Link>
              <Link to="/products" className="font-medium">
                SHOP
              </Link>
              <Link to="/men" className="font-medium">
                MEN
              </Link>
              <Link to="/women" className="font-medium">
                WOMEN
              </Link>
            </nav>
            <div className="flex items-center space-x-6 mt-4">
            
              <Link to="/account" aria-label="Account" className="p-1">
                <User size={20} />
              </Link>
              <Link to="/cart" aria-label="Cart" className="p-1 relative">
                <ShoppingBag size={20} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-black text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

export default Navbar

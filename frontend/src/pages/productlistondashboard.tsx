"use client";

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProducts } from "../services/product.service";

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  status: "ACTIVE" | "INACTIVE";
  featured: boolean;
  images?: {
    id?: string;
    url?: string;
    imageUrl?: string;
    isPrimary?: boolean;
  }[];
  category?: {
    id: string;
    name: string;
  };
}

const ProductListPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getProducts({
        page: 1,
        limit: 8,
      });

      const productsData = response.data.products || [];

      const formattedProducts = productsData.map(
        (product: any) => ({
          ...product,
          price: Number(product.price),
        })
      );

      setProducts(formattedProducts);
    } catch (error: any) {
      console.error("Failed to load products:", error);

      setError(
        error.response?.data?.message ||
          "Failed to load products."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // Loading
  // =========================

  if (loading) {
    return (
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-6">

          <div className="mb-10">
            <div className="h-4 w-24 bg-gray-200 rounded animate-pulse mb-4" />

            <div className="h-10 w-64 bg-gray-200 rounded animate-pulse" />
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="bg-white rounded-2xl border overflow-hidden"
              >
                <div className="aspect-square bg-gray-100 animate-pulse" />

                <div className="p-5 space-y-3">
                  <div className="h-3 w-20 bg-gray-200 rounded animate-pulse" />

                  <div className="h-5 w-full bg-gray-200 rounded animate-pulse" />

                  <div className="h-5 w-24 bg-gray-200 rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>
    );
  }

  // =========================
  // Error
  // =========================

  if (error) {
    return (
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">

          <div className="max-w-md mx-auto">
            <div className="w-14 h-14 mx-auto mb-5 rounded-full bg-red-50 flex items-center justify-center">
              <span className="text-red-500 text-2xl">
                !
              </span>
            </div>

            <h2 className="text-xl font-bold text-gray-900">
              Unable to load products
            </h2>

            <p className="text-gray-500 mt-2">
              {error}
            </p>

            <button
              onClick={fetchProducts}
              className="mt-6 px-6 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition"
            >
              Try Again
            </button>
          </div>

        </div>
      </section>
    );
  }

  return (
    <section className="bg-white py-16 sm:py-20">

      <div className="max-w-7xl mx-auto px-6">

        {/* =================================
            Section Header
        ================================= */}

        <div className="flex items-end justify-between mb-10">

          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-gray-500 mb-2">
              Our Collection
            </p>

            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">
              Featured Products
            </h2>

            <p className="text-gray-500 mt-3 max-w-xl">
              Discover our latest products, carefully selected
              for quality, style, and value.
            </p>
          </div>

          <Link
            to="/products"
            className="hidden sm:inline-flex items-center gap-2 text-sm font-semibold text-gray-900 hover:text-gray-500 transition"
          >
            View All

            <span className="text-lg">
              →
            </span>
          </Link>

        </div>

        {/* =================================
            Products
        ================================= */}

        {products.length === 0 ? (
          <div className="py-16 text-center border rounded-2xl">
            <p className="text-gray-500">
              No products available right now.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-10">

            {products.map((product) => {

              const primaryImage =
                product.images?.find(
                  (image) => image.isPrimary
                );

              const image =
                primaryImage?.imageUrl ||
                primaryImage?.url ||
                product.images?.[0]?.imageUrl ||
                product.images?.[0]?.url ||
                "/placeholder.svg";

              const isOutOfStock =
                product.stock <= 0;

              return (
                <Link
                  key={product.id}
                  to={`/product/${product.id}`}
                  className="group"
                >

                  {/* =================================
                      Image
                  ================================= */}

                  <div className="relative aspect-square overflow-hidden rounded-2xl bg-gray-100">

                    <img
                      src={image}
                      alt={product.name}
                      className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
                      onError={(e) => {
                        e.currentTarget.src =
                          "/placeholder.svg";
                      }}
                    />

                    {/* Category */}
                    {product.category?.name && (
                      <div className="absolute top-3 left-3">
                        <span className="bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-medium text-gray-700 shadow-sm">
                          {product.category.name}
                        </span>
                      </div>
                    )}

                    {/* Stock */}
                    {isOutOfStock && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <span className="bg-white text-gray-900 px-4 py-2 rounded-full text-sm font-semibold">
                          Out of Stock
                        </span>
                      </div>
                    )}

                    {/* Hover action */}
                    {!isOutOfStock && (
                      <div className="absolute bottom-4 left-4 right-4 translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                        <div className="w-full bg-white text-gray-900 text-center py-3 rounded-xl font-semibold shadow-lg">
                          View Product
                        </div>
                      </div>
                    )}

                  </div>

                  {/* =================================
                      Product Information
                  ================================= */}

                  <div className="pt-4">

                    {/* Rating */}
                    <div className="flex items-center gap-1 mb-2">

                      <div className="flex text-yellow-500 text-sm">
                        ★★★★★
                      </div>

                      <span className="text-xs text-gray-400">
                        5.0
                      </span>

                    </div>

                    {/* Product name */}
                    <h3 className="font-semibold text-gray-900 text-base sm:text-lg line-clamp-1 group-hover:text-gray-600 transition">
                      {product.name}
                    </h3>

                    {/* Price + Stock */}
                    <div className="flex items-center justify-between mt-2">

                      <p className="font-bold text-lg text-gray-900">
                        {product.price.toLocaleString(
                          "en-US",
                          {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          }
                        )}{" "}
                        <span className="text-sm font-medium">
                          ETB
                        </span>
                      </p>

                      {!isOutOfStock && (
                        <span className="text-xs text-green-600 font-medium">
                          In stock
                        </span>
                      )}

                    </div>

                  </div>

                </Link>
              );
            })}

          </div>
        )}

        {/* =================================
            Mobile View All
        ================================= */}

        <div className="mt-10 text-center sm:hidden">

          <Link
            to="/products"
            className="inline-flex items-center gap-2 border border-gray-300 px-6 py-3 rounded-xl font-semibold text-sm hover:bg-gray-50 transition"
          >
            View All Products
            <span>→</span>
          </Link>

        </div>

      </div>
    </section>
  );
};

export default ProductListPage;
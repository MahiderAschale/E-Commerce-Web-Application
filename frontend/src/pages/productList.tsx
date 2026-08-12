"use client";

import { useEffect, useState } from "react";
import { Filter } from "lucide-react";
import ProductCard from "../component/productCard";
import { getProducts } from "../services/product.service";
import { getCategories } from "../services/category.service";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Link, useSearchParams } from "react-router-dom";
import Navbar from "@/component/Navbar";

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
}

const ProductListPage = () => {
  const [viewMode] = useState<"grid" | "list">("grid");

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // ==============================
  // Categories
  // ==============================

  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  const [searchParams] = useSearchParams();

  const selectedCategory = searchParams.get("category");

  // ==============================
  // Fetch Categories
  // ==============================

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setCategoriesLoading(true);

      const response = await getCategories();

      setCategories(response.data);
    } catch (error) {
      console.error("Failed to load categories:", error);
    } finally {
      setCategoriesLoading(false);
    }
  };

  // ==============================
  // Fetch Products
  // ==============================

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory]);

  const fetchProducts = async () => {
    try {
      setLoading(true);

      const response = await getProducts({
        category: selectedCategory || undefined,
      });

      const formattedProducts = response.data.products.map(
        (product: any) => ({
          id: product.id,
          name: product.name,
          price: Number(product.price),

          image:
            product.images.length > 0
              ? product.images[0].url
              : "/placeholder.svg",

          rating: 5,
          reviewCount: 0,

          category: product.category.name,
        })
      );

      setProducts(formattedProducts);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // ==============================
  // Filter Content
  // ==============================

  const FilterContent = () => (
    <div className="space-y-6">

      <div>

        <h3 className="font-medium text-black mb-4">
          Category
        </h3>

        <div className="space-y-3">

          {/* All Products */}
          <div className="flex items-center space-x-2">
            <Link
              to="/products"
              className={`font-medium ${
                !selectedCategory
                  ? "text-black"
                  : "text-gray-600 hover:text-black"
              }`}
            >
              All Products
            </Link>
          </div>

          {/* Categories from Database */}
          {categoriesLoading ? (

            <p className="text-sm text-gray-400">
              Loading categories...
            </p>

          ) : categories.length === 0 ? (

            <p className="text-sm text-gray-400">
              No categories found.
            </p>

          ) : (

            categories.map((category) => (

              <div
                key={category.id}
                className="space-y-3"
              >

                <Link
                  to={`/products?category=${category.slug}`}
                  className={`font-medium ${
                    selectedCategory === category.slug
                      ? "text-black"
                      : "text-gray-600 hover:text-black"
                  }`}
                >
                  {category.name}
                </Link>

              </div>

            ))

          )}

        </div>

      </div>

    </div>
  );

  // ==============================
  // Loading
  // ==============================

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <h2 className="text-xl text-black font-semibold">
          Loading products...
        </h2>
      </div>
    );
  }

  // ==============================
  // UI
  // ==============================

  return (
    <div className="min-h-screen bg-gray-100">

      <Navbar />

      <div className="container mx-auto px-6 py-8">

        <h1 className="text-3xl font-bold text-black mb-8">
          {selectedCategory
            ? categories.find(
                (category) =>
                  category.slug === selectedCategory
              )?.name || "Products"
            : "All Products"}
        </h1>

        <div className="flex flex-col md:flex-row gap-8">

          {/* Go to - for Mobile Toggle */}

          <Sheet>

            <SheetTrigger asChild>

              <Button
                variant="outline"
                className="md:hidden flex items-center gap-2 mb-4"
              >
                <Filter className="h-4 w-4" />
              </Button>

            </SheetTrigger>

            <SheetContent side="left">

              <h2 className="font-bold text-lg text-black mb-6">
                Go to
              </h2>

              <FilterContent/>

            </SheetContent>

          </Sheet>


          {/* Filters Sidebar */}

          <div className="hidden md:block w-64 flex-shrink-0">

            <Card>

              <CardContent className="p-6">

                <h2 className="font-bold text-lg text-black mb-6">
                  Go to
                </h2>

                <FilterContent />

              </CardContent>

            </Card>

          </div>


          {/* Product Grid */}

          {viewMode === "grid" ? (

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

              {products.map((product) => (

                <ProductCard
                  key={product.id}
                  product={product}
                />

              ))}

            </div>

          ) : (

            <div className="space-y-6">

              {products.map((product) => (

                <Card key={product.id}>

                  <CardContent className="p-0">

                    <div className="flex flex-col sm:flex-row">

                      <div className="sm:w-1/3">

                        <img
                          src={
                            product.image ||
                            "/placeholder.svg"
                          }
                          alt={product.name}
                          className="w-full h-full object-cover rounded-t-lg sm:rounded-l-lg sm:rounded-t-none"
                        />

                      </div>

                      <div className="sm:w-2/3 p-6 flex flex-col">

                        <h3 className="text-lg font-medium mb-2">
                          {product.name}
                        </h3>

                        <div className="flex items-center mb-2">

                          <span className="text-yellow-500">
                            ★
                          </span>

                          <span className="text-sm ml-1">
                            {product.rating}
                          </span>

                          <span className="text-xs text-gray-500 ml-1">
                            ({product.reviewCount})
                          </span>

                        </div>

                        <p className="font-bold mb-4">
                          {product.price.toFixed(2)}
                        </p>

                      </div>

                    </div>

                  </CardContent>

                </Card>

              ))}

            </div>

          )}

        </div>

      </div>

    </div>
  );
};

export default ProductListPage;
"use client"
import { Link } from "react-router-dom"
import ProductCard from "./productCard"
import { Tabs} from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import type { Product } from "../type"

const BestSellers = () => {
  const products: Product[] = [
    {id: 1,
      name: "Modern habsha",
      price: 8900,
      image: "/image/women-1.jpg",
      rating:4.7,
      reviewCount: 131,
      category: "women",
    },
    {
      id: 2,
      name: "Classic Habsha",
      price: 7200,
      image: "/image/women-2.jpg",
      rating: 4.5,
      reviewCount: 98,
      category: "women",
    },
    {
      id: 5,
      name: "Modern Ethiopian Suit",
      price: 9500,
      image: "/image/men-1.jpg",
      rating: 4.7,
      reviewCount: 72,
      category: "men",
    },
    {
      id: 6,
      name: "White Traditional Shirt",
      price: 6900,
      image: "/image/men-2.jpg",
      rating: 4.2,
      reviewCount: 54,
      category: "men",
    
    },
  ]

  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-blue-600">BESTSELLERS</h2>
          <Tabs defaultValue="for-you" className="w-auto">
            <div className="ml-4 inline-block">
              <Button variant="link" asChild>
                <Link to="/products">SEE ALL</Link>
              </Button>
            </div>
          </Tabs>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default BestSellers

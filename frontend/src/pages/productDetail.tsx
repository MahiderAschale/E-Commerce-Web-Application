"use client"
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { ShoppingBag, Star, Minus, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group"
import { Label } from "../components/ui/label"
import { getProductById } from "../services/product.service";
import { addToCart } from "../services/cart.service";
import Navbar from "@/component/Navbar";

export default function ProductDetailPage () {
  const { id } = useParams<{ id: string} >()
  const [selectedSize, setSelectedSize] = useState("")
  const [quantity, setQuantity] = useState(1)
   const navigate = useNavigate();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  if (id) {
    fetchProduct();
  }
}, [id]);

const fetchProduct = async () => {
  try {
    setLoading(true);

    const response = await getProductById(id!);

    const p = response.data;

    setProduct({
      id: p.id,
      name: p.name,
      price: Number(p.price),
      description: p.description,
      stock: p.stock,
      category: p.category,
      images:
        p.images.length > 0
          ? p.images.map((img: any) => img.url)
          : ["/placeholder.svg"],

      rating: 5,
      reviewCount: 0,

      sizes: ["S", "M", "L", "XL"],

      features: [
        "Premium Quality",
        "Traditional Ethiopian Design",
        "Comfortable Fit",
      ] as string[],
    });
  } catch (err) {
    console.error(err);
  } finally {
    setLoading(false);
  }
};
const [mainImage, setMainImage] = useState("");

useEffect(() => {
  if (product) {
    setMainImage(product.images[0]);
  }
}, [product]);


const handleAddToCart = async () => {
  try {
    await addToCart(product.id, quantity);

    navigate("/cart");
  } catch (error) {
    console.error(error);
    alert("Failed to add product to cart.");
  }
};

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1)
    }
  }

  const increaseQuantity = () => {
    setQuantity(quantity + 1)
  }



  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <h2 className="text-xl text-black font-semibold">Loading products...</h2>
      </div>
    ); 
  }
  if (!product) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <h2 className="text-xl tefont-semibold text-red-500">
          Product not found.
        </h2>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
  
      <div className="container mx-auto px-6 py-8">
  
        <div className="bg-white rounded-2xl shadow-lg p-8">
  
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
  
            {/* Images */}
            <div>
  
              <div className="mb-5 rounded-2xl overflow-hidden border border-gray-200 bg-gray-50">
                <img
                  src={mainImage || "/placeholder.svg"}
                  alt={product.name}
                  className="w-full h-[500px] object-cover"
                />
              </div>
  
              <div className="grid grid-cols-4 gap-3">
  
                {product.images.map((image: string, index: number) => (
  
                  <Button
                    key={index}
                    variant="ghost"
                    onClick={() => setMainImage(image)}
                    className={`p-0 h-24 rounded-xl overflow-hidden border transition-all ${
                      mainImage === image
                        ? "border-black ring-2 ring-black"
                        : "border-gray-200"
                    }`}
                  >
                    <img
                      src={image || "/placeholder.svg"}
                      alt={`${product.name}-${index}`}
                      className="w-full h-full object-cover"
                    />
                  </Button>
  
                ))}
  
              </div>
  
            </div>
  
            {/* Product Details */}
            <div className="flex flex-col">
  
              <h1 className="text-4xl font-bold text-black mb-3">
                {product.name}
              </h1>
  
              <div className="flex items-center mb-4">
  
                <div className="flex mr-3">
  
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={18}
                      className={
                        i < Math.floor(product.rating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }
                    />
                  ))}
  
                </div>
  
                <span className="text-gray-600">
                  {product.rating} ({product.reviewCount} reviews)
                </span>
  
              </div>
  
              <p className="text-3xl font-bold text-black mb-6">
                {product.price.toFixed(2)} ETB
              </p>
  
              <p className="text-gray-600 leading-7 mb-8">
                {product.description}
              </p>
  
              {/* Sizes */}
  
              <div className="mb-8">
  
                <h3 className="text-lg font-semibold text-black mb-3">
                  Select Size
                </h3>
  
                <RadioGroup
                  value={selectedSize}
                  onValueChange={setSelectedSize}
                  className="grid grid-cols-4 gap-3"
                >
  
                  {product.sizes.map((size: string) => (
  
                    <div key={size}>
  
                      <RadioGroupItem
                        value={size}
                        id={`size-${size}`}
                        className="peer sr-only"
                      />
  
                      <Label
                        htmlFor={`size-${size}`}
                        className="flex h-12 items-center justify-center rounded-xl border border-gray-300 bg-gray-100 text-black cursor-pointer transition hover:bg-gray-200 peer-data-[state=checked]:bg-black peer-data-[state=checked]:text-white peer-data-[state=checked]:border-black"
                      >
                        {size}
                      </Label>
  
                    </div>
  
                  ))}
  
                </RadioGroup>
  
              </div>
  
              {/* Quantity */}
  
              <div className="mb-8">
  
                <h3 className="text-lg font-semibold text-black mb-3">
                  Quantity
                </h3>
  
                <div className="flex items-center w-36 rounded-xl border border-gray-300 overflow-hidden">
  
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={decreaseQuantity}
                    disabled={quantity <= 1}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
  
                  <div className="flex-1 text-center font-medium text-black">
                    {quantity}
                  </div>
  
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={increaseQuantity}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
  
                </div>
  
              </div>
  
              {/* Add to Cart */}
  
              <Button
                onClick={handleAddToCart}
                size="lg"
                className="h-12 bg-black hover:bg-gray-900 text-white rounded-xl"
              >
                <ShoppingBag className="w-5 h-5 mr-2" />
                Add to Cart
              </Button>
  
            </div>
  
          </div>
  
        </div>
  
      </div>
    </div>
  );}
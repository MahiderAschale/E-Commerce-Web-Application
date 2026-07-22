"use client"
import { useNavigate } from "react-router-dom";
import { useState } from "react"
import { useParams } from "react-router-dom"
import { Heart, ShoppingBag, Star, Minus, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group"
import { Label } from "../components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { Separator } from "../components/ui/separator"
import BestSellers from "../component/BestSellers"
import { product} from "../product"
import { useCart } from "../component/CartContext"

export default function ProductDetailPage () {
  const { id } = useParams<{ id: string} >()
  const [selectedSize, setSelectedSize] = useState("")
  const [quantity, setQuantity] = useState(1)
  const { addToCart } = useCart()
  const navigate = useNavigate();


  // Mock product data
  const products = product.find((p) => p.id === Number(id))
  if (!products) {
    return <div className="text-center py-10 text-red-500">Product not found.</div>
  
  }


  const [mainImage, setMainImage] = useState(products.images[0])
  
  const handleAddToCart = () => {
    addToCart({
        id: products.id,
        name: products.name,
        price: products.price,
        images: products.images,
        size: selectedSize,
        quantity,
      })
   
    navigate("/cart");
  }
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1)
    }
  }

  const increaseQuantity = () => {
    setQuantity(quantity + 1)
  }
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
       {/* Product Images */}
       <div>
          <div className="mb-4 rounded-lg overflow-hidden">
            <img src={mainImage || "/placeholder.svg"} alt={products.name} className="w-full h-auto" />
          </div>
          <div className="grid grid-cols-4 gap-2">
            {products.images.map((image, index) => (
              <Button
                key={index}
                variant="ghost"
                className={`p-0 rounded-md overflow-hidden ${mainImage === image ? "ring-2 ring-black" : ""}`}
                onClick={() => setMainImage(image)}
              >
                <img
                  src={image || "/placeholder.svg"}
                  alt={`${products.name} view ${index + 1}`}
                  className="w-full h-auto"
                />
              </Button>
            ))}
          </div>
        </div>
        {/* Product Details */}
        <div>
          <h1 className="text-3xl font-bold mb-2">{products.name}</h1>

          <div className="flex items-center mb-4">
            <div className="flex mr-2">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={18}
                  className={i < Math.floor(products.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
                />
              ))}
            </div>
            <span className="text-sm">
              {products.rating} ({products.reviewCount} reviews)
            </span>
          </div>

          <p className="text-2xl font-bold mb-4">{products.price.toFixed(2)} ETB</p>

          <p className="text-gray-600 mb-6">{products.description}</p>

        

          {/* Size Selection */}
          <RadioGroup value={selectedSize} onValueChange={setSelectedSize} className="grid grid-cols-4 gap-2">
                    {products.sizes.map((size) => (
            <div key={size}>
         <RadioGroupItem value={size} id={`size-${size}`} className="peer sr-only" />
           <Label
             htmlFor={`size-${size}`}
               className="flex h-10 w-full items-center justify-center rounded-md border border-muted bg-popover p-2 hover:bg-muted hover:text-muted-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary peer-data-[state=checked]:text-primary-foreground cursor-pointer">
                 {size}
          </Label>
            </div>
                     ))}
         </RadioGroup>


          {/* Quantity */}
          <div className="mb-6">
            <h3 className="font-medium mb-2">Quantity</h3>
            <div className="flex items-center border rounded-md w-32">
              <Button variant="ghost" size="icon" onClick={decreaseQuantity} disabled={quantity <= 1}>
                <Minus className="h-4 w-4" />
              </Button>
              <div className="flex-1 text-center">{quantity}</div>
              <Button variant="ghost" size="icon" onClick={increaseQuantity}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Add to Cart */}
          <div className="flex flex-col sm:flex-row gap-2 mb-8">
            <Button onClick={handleAddToCart} className="flex-1 gap-2" size="lg">
              <ShoppingBag className="h-4 w-4" />
              Add to Cart
            </Button>
           
          </div>

          {/* Product Info Tabs */}
          <Tabs defaultValue="features" className="mt-8">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="features">Features</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="shipping">Shipping</TabsTrigger>
            </TabsList>
            <TabsContent value="features" className="mt-4">
              <Card>
                <CardContent className="pt-6">
                  <ul className="list-disc pl-5 space-y-1">
                    {products.features.map((feature, index) => (
                      <li key={index} className="text-gray-600">
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="details" className="mt-4">
              <Card>
                <CardContent className="pt-6">
                  <p className="text-gray-600">
                    Material: 100% Cotton
                    <br />
                    Care: Machine wash cold, tumble dry low
                    <br />
                    Imported
                    <br />
                    Model is 6'0" and wearing size M
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="shipping" className="mt-4">
              <Card>
                <CardContent className="pt-6">
                  <p className="text-gray-600">
                    Free standard shipping on all orders over $100.
                    <br />
                    Standard delivery: 3-5 business days
                    <br />
                    Express delivery: 1-2 business days
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <Separator className="my-12" />

      {/* Related Products */}
      <div>
        <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>
        <BestSellers />
      </div>
    </div>
  )}


import { Link } from "react-router-dom"

const HeroSection = () => {
  return (
    <section className="bg-green-600 text-white relative overflow-hidden">
      <div className="container mx-auto px-4 py-16 md:py-24 lg:py-32 relative z-10">
        <div className="max-w-xl">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6">
             MY IDENTITY 
              <br />
              MY FABRIC</h1>
          <Link
            to="/products"
            className="inline-block bg-white text-black px-6 py-3 font-medium hover:bg-gray-100 transition-colors"
          >
          STEP INTO TRADITION
          </Link>
        </div>
      </div>
      <div className="absolute inset-0 z-0">
        <img src= "/image/bg-1.jpg" alt="" className="w-full h-full object-cover opacity-90" />
      </div>
    </section>
  )
}

export default HeroSection

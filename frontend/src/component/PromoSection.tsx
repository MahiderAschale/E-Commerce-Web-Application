import { Link } from "react-router-dom"

const PromoSection = () => {
  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Discount Promo */}
          <div className="bg-white p-6 flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-6 md:mb-0">
              <img src="/image/golden-bgg.jpg" alt="Model wearing discounted items" className="w-full h-auto" />
            </div>
            <div className="md:w-1/2 md:pl-8">
              <h3 className="text-3xl font-bold mb-2 text-yellow-500" >UP TO 30% DISCOUNT</h3>
              <p className="text-blue-600 mb-4">Top quality, fair price. Always.</p>
              <div className="flex space-x-2">
                <Link to="/products" className="btn btn-primary">
                  SHOP
                </Link>
              </div>
            </div>
          </div>

          {/* autumn Collection Promo */}
          <div className="relative overflow-hidden">
            <img src="/image/golden-bgg.jpg" alt="Winter collection" className="w-full h-auto " />
            <div className="absolute inset-0 bg-black bg-opacity-30 flex flex-col justify-center p-8 text-yellow-500">
              <h3 className="text-3xl font-bold mb-2">Fall into tradition—</h3>
              <p className="mb-4">our autumn collection is here to warm your soul and your style</p>
              <Link to="/autumncollection" className="btn btn-primary self-start text-yellow-500">
                SHOP
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default PromoSection

import HeroSection from "@/component/HeroSection"
import PromoSection from "@/component/PromoSection"
import Footer from "@/component/Footer"
import CategoryGrid from "@/component/CategoryGrid"
import Navbar from "@/component/Navbar"
import Productlist from "../pages/productlistondashboard"
const HomePage = () => {
  return (
    <div>
      <Navbar/>
      <HeroSection />
      <Productlist/>
      <PromoSection />
      <CategoryGrid />
      <Footer/>
    </div>
  )
}

export default HomePage

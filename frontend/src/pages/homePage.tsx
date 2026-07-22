import HeroSection from "@/component/HeroSection"
import BestSellers from "@/component/BestSellers"
import PromoSection from "@/component/PromoSection"
import Footer from "@/component/Footer"
import CategoryGrid from "@/component/CategoryGrid"
import Navbar from "@/component/Navbar"
const HomePage = () => {
  return (
    <div>
      <Navbar/>
      <HeroSection />
      <BestSellers />
      <PromoSection />
      <CategoryGrid />
      <Footer/>
    </div>
  )
}

export default HomePage

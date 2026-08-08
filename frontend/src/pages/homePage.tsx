import HeroSection from "@/component/HeroSection"

import PromoSection from "@/component/PromoSection"
import Footer from "@/component/Footer"
import CategoryGrid from "@/component/CategoryGrid"
import Navbar from "@/component/Navbar"
const HomePage = () => {
  return (
    <div>
      <Navbar/>
      <HeroSection />
      
      <PromoSection />
      <CategoryGrid />
      <Footer/>
    </div>
  )
}

export default HomePage

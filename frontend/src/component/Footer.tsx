import { Link } from "react-router-dom"
import { FaFacebook, FaInstagram, FaTwitter ,FaYoutube} from "react-icons/fa"

const Footer = () => {
  return (
    <footer className="py-12 bg-gray-900 text-white w-full ">
    <div className="container mx-auto px-4">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <div className="text-2xl font-bold mb-4 md:mb-0">Efuye Telet</div>
        <div className="flex space-x-4">
          <a href="http://instagram.com" className="hover:text-gray-300">
            <FaInstagram className="w-5 h-5" />
          </a>
          <a href="http://youtube.com" className="hover:text-gray-300">
            <FaYoutube className="w-5 h-5" />
          </a>
          <a href="http://twitter.com" className="hover:text-gray-300">
            <FaTwitter className="w-5 h-5" />
          </a>
          <a href="http://facebook.com" className="hover:text-gray-300">
            <FaFacebook className="w-5 h-5" />
          </a>
          {/* social media links */}
        </div>
      </div>

      <div className="mt-12 pt-8 border-t border-gray-800 flex justify-center">
        <nav className="flex space-x-6 text-sm">
          <a href="/" className="hover:underline">
            HOME
          </a>
          <a href="/men" className="hover:underline">
           FOR  HIM
          </a>
          <a href="/women" className="hover:underline">
           FOR  HER
          </a>
       
        </nav>
      </div>

      <div className="absolute inset-0 z-0 opacity-5 flex justify-center items-center w-full">
        <div className="text-[20rem] font-bold tracking-widest">STREET</div>
      </div>
    </div>
  </footer>

)
}

export default Footer

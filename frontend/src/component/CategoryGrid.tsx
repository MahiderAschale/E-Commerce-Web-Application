import { Link } from "react-router-dom"
const CategoryGrid = () => { 
  const categories = [
    { name: "WOMEN", link: "/women" },
    { name: "MEN", link: "/men" },
    ]

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((category, index) => (
            <Link key={index} to={category.link} className="group">
              <div className="relative overflow-hidden">
                
                <div className="absolute inset-0 flex items-end p-3">
                  <span className="text-sm font-medium">{category.name}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

export default CategoryGrid

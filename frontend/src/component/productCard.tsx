import { Link } from "react-router-dom";

type Product = {
  id: number;
  name: string;
  price: number;
  image: string;
};

const ProductCard = ({ product }: { product: Product }) => {
  return (
    <Link to={`/product/${product.id}`}>
      <div className="border p-4 rounded cursor-pointer hover:shadow-lg">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-40 object-cover"
        />
        <h2 className="text-lg font-bold mt-2">{product.name}</h2>

        {/* FIX for toFixed error */}
        <p className="text-gray-600">
          ${Number(product.price).toFixed(2)}
        </p>
      </div>
    </Link>
  );
};

export default ProductCard;
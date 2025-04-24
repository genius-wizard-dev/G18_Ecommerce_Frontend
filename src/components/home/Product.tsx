import { FC } from "react";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { Card } from "../ui/card";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image: string;
  discount?: number;
}

const ProductCard: FC<ProductCardProps> = ({
  id,
  name,
  price,
  image,
  discount,
}) => {
  return (
    <Card className="overflow-hidden group shadow-sm hover:shadow-md transition-shadow">
      <div className="relative overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {discount && (
          <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-md text-xs font-bold">
            -{discount}%
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-medium text-gray-900 mb-1 truncate">{name}</h3>
        <div className="flex items-center gap-2">
          {discount ? (
            <>
              <span className="font-semibold text-red-500">
                {(price * (1 - discount / 100)).toLocaleString()}₫
              </span>
              <span className="text-gray-500 text-sm line-through">
                {price.toLocaleString()}₫
              </span>
            </>
          ) : (
            <span className="font-semibold">{price.toLocaleString()}₫</span>
          )}
        </div>
        <Button
          variant="outline"
          className="w-full mt-3 text-red-500 border-red-500 hover:bg-red-50 hover:text-red-600"
          asChild
        >
          <Link to={`/product/${id}`}>Xem chi tiết</Link>
        </Button>
      </div>
    </Card>
  );
};
const recommendedItems = [
  {
    id: "29",
    name: "ASUS Zenbook 14",
    price: 25990000,
    image:
      "https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    discount: 5,
  },
  {
    id: "30",
    name: "Acer Swift 5",
    price: 22990000,
    image:
      "https://images.pexels.com/photos/205421/pexels-photo-205421.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  },
  {
    id: "31",
    name: "Google Pixel 8",
    price: 18990000,
    image:
      "https://images.pexels.com/photos/699122/pexels-photo-699122.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    discount: 8,
  },
  {
    id: "32",
    name: "Nothing Phone 2",
    price: 15990000,
    image:
      "https://images.pexels.com/photos/47261/pexels-photo-47261.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  },
];

const newArrivals = [
  {
    id: "9",
    name: "Samsung Galaxy Tab S9 Ultra",
    price: 23990000,
    image:
      "https://images.pexels.com/photos/1334598/pexels-photo-1334598.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  },
  {
    id: "10",
    name: "OPPO Find X7 Ultra",
    price: 26990000,
    image:
      "https://images.pexels.com/photos/699122/pexels-photo-699122.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    discount: 7,
  },
  {
    id: "11",
    name: "Dell XPS 13 Plus",
    price: 31990000,
    image:
      "https://images.pexels.com/photos/205421/pexels-photo-205421.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    discount: 10,
  },
  {
    id: "12",
    name: "Sony WH-1000XM5",
    price: 8490000,
    image:
      "https://images.pexels.com/photos/3394665/pexels-photo-3394665.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  },
];

export const Product = () => {
  return (
    <section className="bg-white py-6">
      <div className="container mx-auto px-4">
        <h2 className="text-xl font-bold mb-6 text-gray-800">Gợi ý cho bạn</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {recommendedItems.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          {newArrivals.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      </div>
    </section>
  );
};

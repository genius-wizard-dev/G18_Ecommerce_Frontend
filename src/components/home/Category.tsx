import { FC } from "react";
import { Link } from "react-router-dom";

interface CategoryCardProps {
  id: string;
  name: string;
  image: string;
}
const CategoryCard: FC<CategoryCardProps> = ({ id, name, image }) => {
  return (
    <Link to={`/category/${id}`}>
      <div className="text-center h-full transition-all duration-300">
        <div className="mb-3 rounded-lg overflow-hidden relative group bg-transparent hover:bg-orange-100/90 transition-colors duration-300 w-32 h-32 flex items-center justify-center mx-auto">
          <div className="w-20 h-20 overflow-hidden">
            <img
              src={image}
              alt={name}
              className="w-full h-full object-cover transform group-hover:rotate-3 group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        </div>
        <h3 className="font-medium text-gray-900 text-sm">{name}</h3>
      </div>
    </Link>
  );
};
const featuredCategories = [
  {
    id: "1",
    name: "Điện thoại",
    image:
      "https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    id: "2",
    name: "Laptop",
    image:
      "https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    id: "3",
    name: "Tablet",
    image:
      "https://images.pexels.com/photos/1334597/pexels-photo-1334597.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    id: "4",
    name: "Đồng hồ",
    image:
      "https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    id: "5",
    name: "Tai nghe",
    image:
      "https://images.pexels.com/photos/3394665/pexels-photo-3394665.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    id: "6",
    name: "Phụ kiện",
    image:
      "https://images.pexels.com/photos/1037999/pexels-photo-1037999.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
];
export const Category = () => {
  return (
    <section className="bg-white py-6">
      <div className="container mx-auto px-4">
        <h2 className="text-lg font-bold mb-4 text-gray-800">
          Danh mục nổi bật
        </h2>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2 md:gap-4">
          {featuredCategories.map((category) => (
            <CategoryCard
              key={category.id}
              id={category.id}
              name={category.name}
              image={category.image}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

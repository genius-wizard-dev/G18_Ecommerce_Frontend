import { FC, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ProductCategory } from "../../schema/product";

interface CategoryCardProps {
  id: string;
  name: string;
  image: string;
}
const CategoryCard: FC<CategoryCardProps> = ({ id, name, image }) => {
  return (
    <Link to={`/category/${id}`} className="block">
      {" "}
      <div className="text-center h-full transition-all duration-300">
        {" "}
        <div className="mb-3 rounded-lg overflow-hidden relative group bg-transparent hover:bg-orange-100/90 transition-colors duration-300 w-32 h-32 flex items-center justify-center mx-auto">
          {" "}
          <div className="w-20 h-20 overflow-hidden">
            {" "}
            <img
              src={image}
              alt={name}
              className="w-full h-full object-cover transform group-hover:rotate-3 group-hover:scale-105 transition-transform duration-300"
            />{" "}
          </div>{" "}
        </div>{" "}
        <h3 className="font-medium text-gray-900 text-sm">{name}</h3>{" "}
      </div>{" "}
    </Link>
  );
};

const featuredCategories = [
  {
    id: ProductCategory.Mobile,
    name: "Điện thoại",
    image:
      "https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    id: ProductCategory.Computer,
    name: "Laptop",
    image:
      "https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    id: ProductCategory.Electronics,
    name: "Thiết bị điện tử",
    image:
      "https://images.pexels.com/photos/1334597/pexels-photo-1334597.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    id: ProductCategory.Watch,
    name: "Đồng hồ",
    image:
      "https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    id: ProductCategory.FashionAccessories,
    name: "Phụ kiện thời trang",
    image:
      "https://images.pexels.com/photos/3394665/pexels-photo-3394665.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    id: ProductCategory.Clothes,
    name: "Quần áo",
    image:
      "https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    id: ProductCategory.MenShoes,
    name: "Giày nam",
    image:
      "https://images.pexels.com/photos/267301/pexels-photo-267301.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    id: ProductCategory.WomenShoes,
    name: "Giày nữ",
    image:
      "https://images.pexels.com/photos/336372/pexels-photo-336372.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    id: ProductCategory.WomenBags,
    name: "Túi xách nữ",
    image:
      "https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    id: ProductCategory.Beauty,
    name: "Mỹ phẩm",
    image:
      "https://images.pexels.com/photos/3373739/pexels-photo-3373739.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    id: ProductCategory.Health,
    name: "Sức khỏe",
    image:
      "https://images.pexels.com/photos/3683074/pexels-photo-3683074.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    id: ProductCategory.HomeLiving,
    name: "Đồ gia dụng",
    image:
      "https://images.pexels.com/photos/3637740/pexels-photo-3637740.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    id: ProductCategory.Camera,
    name: "Máy ảnh",
    image:
      "https://images.pexels.com/photos/51383/photo-camera-subject-photographer-51383.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    id: ProductCategory.Grocery,
    name: "Thực phẩm",
    image:
      "https://images.pexels.com/photos/264636/pexels-photo-264636.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    id: ProductCategory.Toy,
    name: "Đồ chơi",
    image:
      "https://images.pexels.com/photos/163696/toy-car-toy-box-mini-163696.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    id: ProductCategory.MenBags,
    name: "Túi xách nam",
    image:
      "https://images.pexels.com/photos/2079249/pexels-photo-2079249.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    id: ProductCategory.BooksStationery,
    name: "Sách & Văn phòng phẩm",
    image:
      "https://images.pexels.com/photos/159866/books-book-pages-read-literature-159866.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    id: ProductCategory.Pet,
    name: "Thú cưng",
    image:
      "https://images.pexels.com/photos/406014/pexels-photo-406014.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    id: ProductCategory.ToolsHomeImprovement,
    name: "Dụng cụ & Cải thiện nhà",
    image:
      "https://images.pexels.com/photos/175039/pexels-photo-175039.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    id: ProductCategory.MomsKidsBabies,
    name: "Mẹ & Bé",
    image:
      "https://images.pexels.com/photos/265987/pexels-photo-265987.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    id: ProductCategory.SportOutdoor,
    name: "Thể thao & Ngoài trời",
    image:
      "https://images.pexels.com/photos/46798/the-ball-stadion-football-the-pitch-46798.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    id: ProductCategory.KidFashion,
    name: "Thời trang trẻ em",
    image:
      "https://images.pexels.com/photos/35188/child-childrens-baby-children-s.jpg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    id: ProductCategory.HomeCare,
    name: "Chăm sóc nhà cửa",
    image:
      "https://images.pexels.com/photos/4108715/pexels-photo-4108715.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
];

export const Category = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const firstRowRef = useRef<HTMLDivElement>(null);
  const secondRowRef = useRef<HTMLDivElement>(null);
  const [showLeftButton, setShowLeftButton] = useState(false);
  const [showRightButton, setShowRightButton] = useState(true);
  const [firstRowCategories, setFirstRowCategories] = useState<
    typeof featuredCategories
  >([]);
  const [secondRowCategories, setSecondRowCategories] = useState<
    typeof featuredCategories
  >([]);

  useEffect(() => {
    // Chia danh mục thành 2 dòng
    const midPoint = Math.ceil(featuredCategories.length / 2);
    setFirstRowCategories(featuredCategories.slice(0, midPoint));
    setSecondRowCategories(featuredCategories.slice(midPoint));
  }, []);

  const scrollAmount = 500;

  const handleScroll = () => {
    if (firstRowRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = firstRowRef.current;
      setShowLeftButton(scrollLeft > 0);
      setShowRightButton(scrollLeft + clientWidth < scrollWidth - 10);
    }
  };

  const scrollLeft = () => {
    if (firstRowRef.current && secondRowRef.current) {
      firstRowRef.current.scrollBy({
        left: -scrollAmount,
        behavior: "smooth",
      });
      secondRowRef.current.scrollBy({
        left: -scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const scrollRight = () => {
    if (firstRowRef.current && secondRowRef.current) {
      firstRowRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
      secondRowRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="bg-white py-6">
      <div className="container mx-auto px-4">
        <h2 className="text-lg font-bold mb-4 text-gray-800">
          Danh mục nổi bật
        </h2>
        <div ref={containerRef} className="relative">
          {showLeftButton && (
            <button
              onClick={scrollLeft}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white shadow-md rounded-full p-2"
              aria-label="Scroll left"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 19.5 8.25 12l7.5-7.5"
                />
              </svg>
            </button>
          )}

          <div className="space-y-6">
            {/* Dòng 1 */}
            <div
              ref={firstRowRef}
              className="flex space-x-4 overflow-x-auto scrollbar-hide pb-4"
              onScroll={handleScroll}
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {firstRowCategories.map((category) => (
                <div key={category.id} className="flex-shrink-0">
                  <CategoryCard
                    id={category.id}
                    name={category.name}
                    image={category.image}
                  />
                </div>
              ))}
            </div>

            {/* Dòng 2 */}
            <div
              ref={secondRowRef}
              className="flex space-x-4 overflow-x-auto scrollbar-hide pb-4"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {secondRowCategories.map((category) => (
                <div key={category.id} className="flex-shrink-0">
                  <CategoryCard
                    id={category.id}
                    name={category.name}
                    image={category.image}
                  />
                </div>
              ))}
            </div>
          </div>

          {showRightButton && (
            <button
              onClick={scrollRight}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white shadow-md rounded-full p-2"
              aria-label="Scroll right"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m8.25 4.5 7.5 7.5-7.5 7.5"
                />
              </svg>
            </button>
          )}
        </div>
      </div>
    </section>
  );
};

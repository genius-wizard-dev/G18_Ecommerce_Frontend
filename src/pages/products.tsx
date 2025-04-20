import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AddToCartButton } from "../components/ui/add-to-cart-button";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Separator } from "../components/ui/separator";

// Types
interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
}

// Mock data để test UI
const mockProducts: Product[] = [
  {
    id: 1,
    name: "Áo thun nam",
    price: 250000,
    description: "Áo thun nam chất liệu cotton thoáng mát",
    image: "https://picsum.photos/200/300",
    category: "Thời trang nam",
  },
  {
    id: 2,
    name: "Quần jean nữ",
    price: 450000,
    description: "Quần jean nữ dáng suông, thời trang",
    image: "https://picsum.photos/200/300",
    category: "Thời trang nữ",
  },
  {
    id: 3,
    name: "Giày thể thao",
    price: 750000,
    description: "Giày thể thao chống trơn trượt",
    image: "https://picsum.photos/200/300",
    category: "Giày dép",
  },
  {
    id: 4,
    name: "Túi xách nữ",
    price: 650000,
    description: "Túi xách nữ thời trang cao cấp",
    image: "https://picsum.photos/200/300",
    category: "Phụ kiện",
  },
  {
    id: 5,
    name: "Áo khoác nam",
    price: 850000,
    description: "Áo khoác nam chống nắng, chống gió",
    image: "https://picsum.photos/200/300",
    category: "Thời trang nam",
  },
  {
    id: 6,
    name: "Váy đầm nữ",
    price: 550000,
    description: "Váy đầm nữ dạ hội sang trọng",
    image: "https://picsum.photos/200/300",
    category: "Thời trang nữ",
  },
];

// Danh sách các danh mục để lọc
const categories = [
  "Tất cả",
  "Thời trang nam",
  "Thời trang nữ",
  "Giày dép",
  "Phụ kiện",
];

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");
  const [isLoading, setIsLoading] = useState(true);

  // Giả lập việc tải dữ liệu
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        // Trong thực tế, đây sẽ là API call
        setTimeout(() => {
          setProducts(mockProducts);
          setFilteredProducts(mockProducts);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Lọc sản phẩm khi searchTerm hoặc category thay đổi
  useEffect(() => {
    let result = products;

    // Lọc theo danh mục
    if (selectedCategory !== "Tất cả") {
      result = result.filter(
        (product) => product.category === selectedCategory
      );
    }

    // Lọc theo từ khóa tìm kiếm
    if (searchTerm) {
      const lowercasedTerm = searchTerm.toLowerCase();
      result = result.filter(
        (product) =>
          product.name.toLowerCase().includes(lowercasedTerm) ||
          product.description.toLowerCase().includes(lowercasedTerm)
      );
    }

    setFilteredProducts(result);
  }, [products, searchTerm, selectedCategory]);

  // Định dạng giá tiền VND
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Sản phẩm</h1>

      {/* Bộ lọc và tìm kiếm */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="w-full md:w-2/3">
            <Input
              placeholder="Tìm kiếm sản phẩm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="w-full md:w-1/3">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>
        <Separator className="my-4" />
      </div>

      {/* Danh sách sản phẩm */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-lg font-semibold text-gray-700 animate-pulse">
            Đang tải sản phẩm...
          </div>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg text-gray-600">
            Không tìm thấy sản phẩm nào phù hợp
          </p>
          <Button
            className="mt-4"
            onClick={() => {
              setSearchTerm("");
              setSelectedCategory("Tất cả");
            }}
          >
            Xóa bộ lọc
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <Card
              key={product.id}
              className="overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <img
                src={product.image}
                alt={product.name}
                className="h-48 w-full object-cover"
              />
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2">
                  <Link
                    to={`/product/${product.id}`}
                    className="hover:text-primary transition-colors"
                  >
                    {product.name}
                  </Link>
                </h3>
                <p className="text-red-600 font-bold text-lg mb-2">
                  {formatPrice(product.price)}
                </p>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {product.description}
                </p>
                <AddToCartButton
                  id={product.id}
                  name={product.name}
                  price={product.price}
                  image={product.image}
                  showQuantity={false}
                />
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Products;

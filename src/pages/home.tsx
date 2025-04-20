import { FC } from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";

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
    <Card className="overflow-hidden group">
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
              <span className="font-semibold text-red-600">
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
        <Button variant="outline" className="w-full mt-3" asChild>
          <Link to={`/product/${id}`}>Xem chi tiết</Link>
        </Button>
      </div>
    </Card>
  );
};

interface CategoryCardProps {
  id: string;
  name: string;
  image: string;
}

const CategoryCard: FC<CategoryCardProps> = ({ id, name, image }) => {
  return (
    <Link to={`/category/${id}`}>
      <Card className="overflow-hidden text-center group h-full">
        <div className="p-4">
          <div className="w-16 h-16 mx-auto mb-3 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-primary/10 transition-colors">
            <img src={image} alt={name} className="w-8 h-8 object-contain" />
          </div>
          <h3 className="font-medium text-gray-900">{name}</h3>
        </div>
      </Card>
    </Link>
  );
};

const HomePage: FC = () => {
  // Dữ liệu mẫu cho trang chủ
  const featuredCategories = [
    {
      id: "1",
      name: "Điện thoại",
      image: "https://cdn-icons-png.flaticon.com/512/3659/3659899.png",
    },
    {
      id: "2",
      name: "Laptop",
      image: "https://cdn-icons-png.flaticon.com/512/3659/3659982.png",
    },
    {
      id: "3",
      name: "Tablet",
      image: "https://cdn-icons-png.flaticon.com/512/3659/3659924.png",
    },
    {
      id: "4",
      name: "Đồng hồ",
      image: "https://cdn-icons-png.flaticon.com/512/3659/3659918.png",
    },
    {
      id: "5",
      name: "Tai nghe",
      image: "https://cdn-icons-png.flaticon.com/512/3659/3659921.png",
    },
    {
      id: "6",
      name: "Phụ kiện",
      image: "https://cdn-icons-png.flaticon.com/512/3659/3659926.png",
    },
  ];

  const bestSellingProducts = [
    {
      id: "1",
      name: "iPhone 15 Pro Max 256GB",
      price: 32990000,
      image:
        "https://images.unsplash.com/photo-1695048133142-1a20484bce10?q=80&w=2070&auto=format&fit=crop",
      discount: 10,
    },
    {
      id: "2",
      name: "Samsung Galaxy S24 Ultra",
      price: 29990000,
      image:
        "https://images.unsplash.com/photo-1707227156456-e5490c56f5af?q=80&w=2071&auto=format&fit=crop",
      discount: 5,
    },
    {
      id: "3",
      name: 'MacBook Pro 14" M3 Pro',
      price: 48990000,
      image:
        "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=2026&auto=format&fit=crop",
    },
    {
      id: "4",
      name: "iPad Air 5",
      price: 16990000,
      image:
        "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=2033&auto=format&fit=crop",
      discount: 15,
    },
    {
      id: "5",
      name: "Apple Watch Series 9",
      price: 10990000,
      image:
        "https://images.unsplash.com/photo-1551816230-ef5deaed4a26?q=80&w=2065&auto=format&fit=crop",
    },
    {
      id: "6",
      name: "AirPods Pro 2",
      price: 5990000,
      image:
        "https://images.unsplash.com/photo-1606741965429-8d76ff50bb2e?q=80&w=2073&auto=format&fit=crop",
      discount: 8,
    },
    {
      id: "7",
      name: "Xiaomi 14 Ultra",
      price: 23990000,
      image:
        "https://images.unsplash.com/photo-1598327105666-5b89351aff97?q=80&w=2127&auto=format&fit=crop",
    },
    {
      id: "8",
      name: "Asus ROG Phone 8 Pro",
      price: 27990000,
      image:
        "https://images.unsplash.com/photo-1662219708489-dd8f9aea9d0b?q=80&w=2127&auto=format&fit=crop",
      discount: 12,
    },
  ];

  const newArrivals = [
    {
      id: "9",
      name: "Samsung Galaxy Tab S9 Ultra",
      price: 23990000,
      image:
        "https://images.unsplash.com/photo-1589739900243-4b52cd9dd8df?q=80&w=2069&auto=format&fit=crop",
    },
    {
      id: "10",
      name: "OPPO Find X7 Ultra",
      price: 26990000,
      image:
        "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?q=80&w=2127&auto=format&fit=crop",
      discount: 7,
    },
    {
      id: "11",
      name: "Dell XPS 13 Plus",
      price: 31990000,
      image:
        "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?q=80&w=2069&auto=format&fit=crop",
      discount: 10,
    },
    {
      id: "12",
      name: "Sony WH-1000XM5",
      price: 8490000,
      image:
        "https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=2065&auto=format&fit=crop",
    },
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="relative">
        <div className="bg-gradient-to-r from-blue-700 to-indigo-900 h-[500px]">
          <div className="container mx-auto px-4 h-full flex items-center">
            <div className="max-w-xl text-white">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Khám phá công nghệ tương lai
              </h1>
              <p className="text-lg mb-8">
                Tận hưởng trải nghiệm mua sắm trực tuyến tuyệt vời với các sản
                phẩm công nghệ đa dạng và chất lượng cao
              </p>
              <div className="flex gap-4">
                <Button size="lg" asChild>
                  <Link to="/products">Mua ngay</Link>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-white text-white hover:text-white"
                  asChild
                >
                  <Link to="/promotion">Khám phá khuyến mãi</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
        {/* Absolute image to overlay on the hero section */}
        <div className="hidden md:block absolute right-[10%] bottom-0 w-[450px]">
          <img
            src="/images/hero-device.png"
            alt="Thiết bị công nghệ"
            className="w-full"
          />
        </div>
      </section>

      {/* Danh mục nổi bật */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8 text-center">
            Danh mục nổi bật
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {featuredCategories.map((category) => (
              <CategoryCard key={category.id} {...category} />
            ))}
          </div>
        </div>
      </section>

      {/* Banner quảng cáo */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="rounded-xl overflow-hidden relative group">
              <img
                src="/images/banners/banner1.jpg"
                alt="Khuyến mãi laptop"
                className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/40 p-6 flex flex-col justify-end text-white">
                <h3 className="text-xl font-bold mb-2">Laptop giảm đến 30%</h3>
                <p className="mb-4">
                  Ưu đãi đặc biệt cho sinh viên và doanh nghiệp
                </p>
                <Button
                  size="sm"
                  variant="default"
                  className="self-start"
                  asChild
                >
                  <Link to="/promotion/laptops">Xem ngay</Link>
                </Button>
              </div>
            </div>
            <div className="rounded-xl overflow-hidden relative group">
              <img
                src="/images/banners/banner2.jpg"
                alt="Ra mắt sản phẩm mới"
                className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/40 p-6 flex flex-col justify-end text-white">
                <h3 className="text-xl font-bold mb-2">Sản phẩm mới ra mắt</h3>
                <p className="mb-4">Đặt trước ngay để nhận quà tặng hấp dẫn</p>
                <Button
                  size="sm"
                  variant="default"
                  className="self-start"
                  asChild
                >
                  <Link to="/new-arrivals">Đặt trước</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sản phẩm bán chạy */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Sản phẩm bán chạy</h2>
            <Link to="/products" className="text-blue-600 hover:underline">
              Xem tất cả
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {bestSellingProducts.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        </div>
      </section>

      {/* Banner toàn màn hình */}
      <section className="py-16 bg-gradient-to-r from-orange-500 to-pink-500 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ưu đãi đặc biệt mùa hè</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Giảm giá lên đến 50% cho tất cả sản phẩm công nghệ. Cơ hội vàng chỉ
            diễn ra trong tháng này!
          </p>
          <Button
            size="lg"
            variant="outline"
            className="border-white text-white hover:text-white"
            asChild
          >
            <Link to="/summer-sale">Khám phá ngay</Link>
          </Button>
        </div>
      </section>

      {/* Sản phẩm mới */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Sản phẩm mới</h2>
            <Link to="/new-arrivals" className="text-blue-600 hover:underline">
              Xem tất cả
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {newArrivals.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        </div>
      </section>

      {/* Dịch vụ */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8 text-center">
            Dịch vụ của chúng tôi
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-6">
              <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Giao hàng miễn phí</h3>
              <p className="text-gray-600">
                Miễn phí giao hàng cho đơn hàng từ 500.000₫
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Đảm bảo chất lượng</h3>
              <p className="text-gray-600">Sản phẩm chính hãng 100%</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 mx-auto mb-4 bg-yellow-100 rounded-full flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-yellow-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Hỗ trợ 24/7</h3>
              <p className="text-gray-600">Luôn sẵn sàng phục vụ khách hàng</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 mx-auto mb-4 bg-purple-100 rounded-full flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-purple-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Thanh toán an toàn</h3>
              <p className="text-gray-600">Nhiều phương thức thanh toán</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default HomePage;

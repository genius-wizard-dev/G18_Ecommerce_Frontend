import { BsEnvelope, BsPerson, BsSearch, BsTelephone } from "react-icons/bs";
import { Link } from "react-router-dom";
import { CartIcon } from "../ui/cart-icon";

export default function Header() {
  const categories = [
    { name: "Điện thoại", path: "/category/dien-thoai" },
    { name: "Laptop", path: "/category/laptop" },
    { name: "Tablet", path: "/category/tablet" },
    { name: "Phụ kiện", path: "/category/phu-kien" },
    { name: "Smartwatch", path: "/category/smartwatch" },
    { name: "Sản phẩm", path: "/products" },
    { name: "Khuyến mãi", path: "/promotions" },
  ];

  return (
    <header className="border-b sticky top-0 bg-white z-50">
      {/* Top bar */}
      <div className="bg-black text-white text-sm py-2">
        <div className="container mx-auto px-4 flex justify-between">
          <div className="flex items-center gap-4">
            <a
              href="tel:+8418001234"
              className="flex items-center gap-1 hover:underline"
            >
              <BsTelephone className="h-4 w-4" />
              Hotline: 1800 1234
            </a>
            <a
              href="mailto:support@shoptech.vn"
              className="flex items-center gap-1 hover:underline"
            >
              <BsEnvelope className="h-4 w-4" />
              Email: support@g18ecommerce.vn
            </a>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/stores" className="hover:underline">
              Hệ thống cửa hàng
            </Link>
            <Link to="/news" className="hover:underline">
              Tin tức
            </Link>
            <Link to="/contact" className="hover:underline">
              Liên hệ
            </Link>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="py-4">
        <div className="container mx-auto px-4 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-primary">
            G18 Ecommerce
          </Link>

          {/* Search bar */}
          <div className="flex-1 max-w-2xl mx-8">
            <div className="relative">
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                className="w-full border border-gray-300 rounded-full py-2 px-4 pl-10 focus:outline-none focus:border-primary"
              />
              <BsSearch className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-5">
            <Link
              to="/profile"
              className="flex flex-col items-center text-sm font-medium text-gray-700 hover:text-primary transition-colors"
            >
              <BsPerson className="h-5 w-5" />
            </Link>

            <div className="flex flex-col items-center text-sm font-medium text-gray-700">
              <CartIcon />
            </div>
          </div>
        </div>
      </div>

      {/* Categories navbar */}
      <nav className="bg-gray-100 py-3">
        <div className="container mx-auto px-4">
          <ul className="flex items-center justify-center space-x-8">
            {categories.map((category, index) => (
              <li key={index}>
                <Link
                  to={category.path}
                  className="text-gray-700 font-medium hover:text-primary transition-colors"
                >
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </header>
  );
}

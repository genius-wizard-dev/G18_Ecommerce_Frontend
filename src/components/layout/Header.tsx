import { removeAccessToken } from "@/lib/storage";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { clearAccount } from "@/redux/slices/account";
import { logout } from "@/redux/thunks/account";
import { useEffect, useRef, useState } from "react";
import { BsEnvelope, BsPerson, BsSearch, BsTelephone } from "react-icons/bs";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { CartIcon } from "../ui/cart-icon";

export default function Header() {
  const { isAuthenticated } = useAppSelector((state) => state.account);
  const dispatch = useAppDispatch();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const { profile } = useAppSelector((state) => state.profile);

  // Handle click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setShowUserMenu(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    dispatch(logout()).then(() => {
      dispatch(clearAccount());
      setShowUserMenu(false);
      removeAccessToken();
      window.location.href = "/";
    });
  };

  // const categories = [{ name: "Sản phẩm", path: "/products" }];

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
              href="mailto:support@g18ecommerce.vn"
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
            {isAuthenticated ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex flex-col items-center text-sm font-medium text-gray-700 hover:text-primary transition-colors"
                >
                  <BsPerson className="h-5 w-5" />
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowUserMenu(false)}
                    >
                      Thông tin cá nhân
                    </Link>
                    {profile && (
                      <Link
                        to={profile.isShop ? "/dashboard" : "/register-shop"}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowUserMenu(false)}
                      >
                        {profile.isShop
                          ? "Quản lý cửa hàng"
                          : "Đăng ký mở shop"}
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1"
                >
                  <BsPerson className="h-4 w-4" />
                  Đăng nhập
                </Button>
              </Link>
            )}

            <div className="flex flex-col items-center text-sm font-medium text-gray-700">
              <CartIcon />
            </div>
          </div>
        </div>
      </div>

      {/* Categories navbar */}
      {/* <nav className="bg-gray-100 py-3">
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
      </nav> */}
    </header>
  );
}

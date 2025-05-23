import { removeAccessToken } from "@/lib/storage";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { clearAccount } from "@/redux/slices/account";
import { logout } from "@/redux/thunks/account";
import { getProducts } from "@/redux/thunks/product";
import { useEffect, useRef, useState } from "react";
import { BsEnvelope, BsPerson, BsSearch, BsTelephone } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { CartIcon } from "../ui/cart-icon";

// Product interface to match the one from products.tsx
interface Product {
  _id: number;
  name: string;
  price: number;
  description: string;
  thumbnailImage: string;
}

export default function Header() {
  const { isAuthenticated } = useAppSelector((state) => state.account);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  // Handle click outside to close dropdowns

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

      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []); // Debounce search function with suggestions
  const handleSearchInputChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    setSearchTerm(value);

    // Clear any existing timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // If search term is empty, hide suggestions
    if (!value.trim()) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }    // Set a new timeout for debounced search
    searchTimeoutRef.current = setTimeout(async () => {
      // Show loading indicator before fetching
      setIsSearchLoading(true);
      setShowSuggestions(true);
      
      try {
        // console.log("Searching for:", value);
        const res = await dispatch(getProducts({ searchTerm: value }));
        console.log(res);

        // In a real implementation, you would make an actual API call here
        // For now, filter the mock products
        const filtered = (res.payload as any).data.products;

        setSuggestions(filtered);
      } catch (error) {
        console.error("Error searching products:", error);
        setSuggestions([]);
      } finally {
        // Hide loading indicator after completion
        setIsSearchLoading(false);
      }
    }, 1000); // 1 second delay
  };

  const handleSuggestionClick = (productId: number) => {
    setShowSuggestions(false);
    // Navigate to product detail page
    navigate(`/product/${productId}`);
  }; // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions || suggestions.length === 0) return;

    // Arrow down
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedSuggestionIndex((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : 0
      );
    }

    // Arrow up
    else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedSuggestionIndex((prev) =>
        prev > 0 ? prev - 1 : suggestions.length - 1
      );
    }

    // Enter key
    else if (e.key === "Enter") {
      e.preventDefault();
      if (selectedSuggestionIndex >= 0) {
        handleSuggestionClick(suggestions[selectedSuggestionIndex]._id);
      }
    }

    // Escape key
    else if (e.key === "Escape") {
      setShowSuggestions(false);
      setSelectedSuggestionIndex(-1);
    }
  };

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
          </Link>{" "}
          {/* Search bar */}
          <div className="flex-1 max-w-2xl mx-8">
            <div className="relative" ref={searchRef}>
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                className="w-full border border-gray-300 rounded-full py-2 px-4 pl-10 focus:outline-none focus:border-primary"
                value={searchTerm}
                onChange={handleSearchInputChange}
                onFocus={() => searchTerm.trim() && setShowSuggestions(true)}
                onKeyDown={handleKeyDown}
              />
              <BsSearch className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />              {/* Search suggestions dropdown */}
              {showSuggestions && (
                <div className="absolute mt-1 w-full bg-white rounded-md shadow-lg max-h-96 overflow-y-auto z-50 border">
                  <div className="py-2">
                    <h3 className="px-4 py-1 text-sm font-medium text-gray-500">
                      {isSearchLoading 
                        ? "Đang tìm kiếm..."
                        : suggestions.length > 0
                        ? "Sản phẩm gợi ý"
                        : "Không tìm thấy kết quả"}
                    </h3>

                    {isSearchLoading ? (
                      // Loading indicator
                      <div className="flex items-center justify-center p-4">
                        <div className="w-6 h-6 border-2 border-t-2 border-gray-200 border-t-primary rounded-full animate-spin"></div>
                        <span className="ml-2 text-sm text-gray-600">Đang tìm kiếm...</span>
                      </div>
                    ) : suggestions.length > 0 ? (
                      // Show suggestions
                      suggestions.map((product) => (
                        <div
                          key={product._id}
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => handleSuggestionClick(product._id)}
                        >
                          <div className="flex items-center gap-3">
                            <img
                              src={product.thumbnailImage}
                              alt={product.name}
                              className="w-12 h-12 object-cover rounded"
                            />
                            <div>
                              <p className="font-medium text-gray-800">
                                {product.name}
                              </p>
                              <p className="text-sm text-gray-600">
                                {product.description.length > 100
                                  ? product.description.slice(0, 100) + "..."
                                  : product.description}
                              </p>

                              <p className="text-sm font-semibold text-primary mt-1">
                                {product.price.toLocaleString()}₫
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      // No results message
                      <div className="px-4 py-3 text-sm text-gray-600">
                        Không tìm thấy sản phẩm phù hợp với "{searchTerm}"
                      </div>
                    )}

                    {/* View all results button - only show when there are matches */}
                    {suggestions.length > 0 && (
                      <div className="px-4 py-2 border-t mt-1">
                        <Button
                          onClick={() =>
                            navigate(
                              `/products-search?search=${encodeURIComponent(
                                searchTerm.trim()
                              )}`,
                              {
                                state: {
                                  suggestions,
                                },
                              }
                            )
                          }
                          variant="outline"
                          className="w-full text-center cursor-pointer"
                          size="sm"
                        >
                          Xem tất cả kết quả
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              )}
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

import { useEffect, useState } from "react";
import { BsCart3 } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  closeCart,
  selectCartItemsCount,
  selectIsCartOpen,
  toggleCart,
} from "../../redux/slices/cartSlice";
import { Button } from "./button";

export function CartIcon() {
  const itemCount = useSelector(selectCartItemsCount);
  const isCartOpen = useSelector(selectIsCartOpen);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isAnimating, setIsAnimating] = useState(false);

  // Thêm hiệu ứng bounce khi thêm sản phẩm vào giỏ hàng
  useEffect(() => {
    if (itemCount > 0) {
      setIsAnimating(true);
      const timeout = setTimeout(() => setIsAnimating(false), 300);
      return () => clearTimeout(timeout);
    }
  }, [itemCount]);

  // Xử lý khi click vào biểu tượng giỏ hàng
  const handleCartClick = () => {
    // Dành cho thiết bị mobile: toggleCart sẽ hiển thị giỏ hàng dạng drawer
    if (window.innerWidth < 768) {
      dispatch(toggleCart());
    } else {
      // Dành cho thiết bị lớn hơn: chuyển hướng đến trang giỏ hàng
      dispatch(closeCart());
      navigate("/cart");
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleCartClick}
      className="relative"
      aria-label="Giỏ hàng"
    >
      <BsCart3 className={`h-6 w-6 ${isAnimating ? "animate-bounce" : ""}`} />

      {itemCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-medium rounded-full h-5 w-5 flex items-center justify-center">
          {itemCount > 99 ? "99+" : itemCount}
        </span>
      )}
    </Button>
  );
}

import { useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { BsCart3, BsDash, BsPlus } from "react-icons/bs";
import { useDispatch } from "react-redux";
import { addToCart, openCart } from "../../redux/slices/cartSlice";
import { Button } from "./button";

interface AddToCartButtonProps {
  id: number;
  name: string;
  price: number;
  image: string;
  className?: string;
  showQuantity?: boolean;
  onAddToCart?: () => void;
}

export function AddToCartButton({
  id,
  name,
  price,
  image,
  className = "",
  showQuantity = true,
  onAddToCart,
}: AddToCartButtonProps) {
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const increaseQuantity = () => {
    setQuantity((prev) => Math.min(prev + 1, 99));
  };

  const decreaseQuantity = () => {
    setQuantity((prev) => Math.max(prev - 1, 1));
  };

  const handleAddToCart = () => {
    setIsLoading(true);

    // Thêm sản phẩm vào giỏ hàng
    dispatch(
      addToCart({
        id,
        name,
        price,
        image,
        quantity,
      })
    );

    // Hiệu ứng loading nhẹ
    setTimeout(() => {
      setIsLoading(false);

      // Hiển thị giỏ hàng sau khi thêm sản phẩm nếu trên mobile
      if (window.innerWidth < 768) {
        dispatch(openCart());
      }

      // Reset về 1
      setQuantity(1);

      // Gọi callback nếu được cung cấp
      if (onAddToCart) {
        onAddToCart();
      }
    }, 600);
  };

  return (
    <div className={`${className}`}>
      {showQuantity && (
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium">Số lượng:</span>
          <div className="flex items-center border rounded overflow-hidden">
            <button
              type="button"
              className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 transition"
              onClick={decreaseQuantity}
              disabled={quantity <= 1}
            >
              <BsDash />
            </button>
            <span className="w-8 h-8 flex items-center justify-center text-sm">
              {quantity}
            </span>
            <button
              type="button"
              className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 transition"
              onClick={increaseQuantity}
              disabled={quantity >= 99}
            >
              <BsPlus />
            </button>
          </div>
        </div>
      )}

      <Button
        type="button"
        className="w-full py-5"
        onClick={handleAddToCart}
        disabled={isLoading}
      >
        {isLoading ? (
          <span className="flex items-center justify-center">
            <AiOutlineLoading3Quarters className="animate-spin mr-2 h-5 w-5" />
            Đang thêm...
          </span>
        ) : (
          <span className="flex items-center justify-center">
            <BsCart3 className="mr-2 h-5 w-5" />
            Thêm vào giỏ hàng
          </span>
        )}
      </Button>
    </div>
  );
}

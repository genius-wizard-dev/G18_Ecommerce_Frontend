import { useEffect } from "react";
import { BsCart3, BsDash, BsPlus, BsX } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
    closeCart,
    removeFromCart,
    selectCartItems,
    selectCartTotal,
    selectIsCartOpen,
    updateQuantity
} from "../../redux/slices/cartSlice";
import { Button } from "./button";
import { Separator } from "./separator";

export function CartDrawer() {
    const isOpen = useSelector(selectIsCartOpen);
    const cartItems = useSelector(selectCartItems);
    const cartTotal = useSelector(selectCartTotal);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Ngăn cuộn trang khi drawer mở
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }

        return () => {
            document.body.style.overflow = "auto";
        };
    }, [isOpen]);

    // Xử lý khi click vào nền mờ để đóng drawer
    const handleOverlayClick = () => {
        dispatch(closeCart());
    };

    // Ngăn sự kiện click trên drawer lan ra ngoài
    const handleDrawerClick = (e: React.MouseEvent) => {
        e.stopPropagation();
    };

    // Định dạng giá tiền VND
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND"
        }).format(price);
    };

    // Xử lý thay đổi số lượng sản phẩm
    const handleQuantityChange = (id: string, quantity: number) => {
        if (quantity < 1) return;
        dispatch(updateQuantity({ id, quantity }));
    };

    // Xử lý xóa sản phẩm khỏi giỏ hàng
    const handleRemoveItem = (id: string) => {
        dispatch(removeFromCart(id));
    };

    // Xử lý chuyển đến trang giỏ hàng
    const handleViewCart = () => {
        dispatch(closeCart());
        navigate("/cart");
    };

    // Xử lý chuyển đến trang thanh toán
    const handleCheckout = () => {
        dispatch(closeCart());
        navigate("/checkout");
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm transition-opacity"
            onClick={handleOverlayClick}
        >
            <div
                className="fixed top-0 right-0 h-full w-full max-w-sm bg-white shadow-xl transition-transform transform"
                onClick={handleDrawerClick}
                style={{
                    transform: isOpen ? "translateX(0)" : "translateX(100%)"
                }}
            >
                {/* Header của drawer */}
                <div className="flex items-center justify-between p-4 border-b">
                    <h2 className="text-lg font-semibold">Giỏ hàng ({cartItems.length})</h2>
                    <button
                        className="p-2 rounded-full hover:bg-gray-100 transition"
                        onClick={() => dispatch(closeCart())}
                        aria-label="Đóng"
                    >
                        <BsX className="h-5 w-5" />
                    </button>
                </div>

                {/* Nội dung drawer */}
                <div className="flex flex-col h-[calc(100%-10rem)] overflow-y-auto p-4">
                    {cartItems.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center">
                            <BsCart3 className="h-16 w-16 text-gray-400 mb-4" />
                            <p className="text-gray-600 mb-4">Giỏ hàng của bạn đang trống</p>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    dispatch(closeCart());
                                    navigate("/products");
                                }}
                            >
                                Tiếp tục mua sắm
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {cartItems.map((item) => (
                                <div key={item.id} className="flex gap-3 py-3">
                                    {/* Hình ảnh */}
                                    <div className="h-20 w-20 rounded overflow-hidden bg-gray-100 flex-shrink-0">
                                        <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                                    </div>

                                    {/* Thông tin sản phẩm */}
                                    <div className="flex-grow">
                                        <div className="flex justify-between">
                                            <h3 className="font-medium">{item.name}</h3>
                                            <button
                                                className="text-gray-400 hover:text-red-500"
                                                onClick={() => handleRemoveItem(item.id)}
                                                aria-label="Xóa"
                                            >
                                                <BsX className="h-5 w-5" />
                                            </button>
                                        </div>

                                        <p className="text-red-600 text-sm font-semibold mt-1">
                                            {formatPrice(item.price)}
                                        </p>

                                        {/* Điều chỉnh số lượng */}
                                        <div className="flex items-center mt-2">
                                            <button
                                                className="w-8 h-8 rounded-full border flex items-center justify-center hover:bg-gray-100 transition"
                                                onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                                disabled={item.quantity <= 1}
                                            >
                                                <BsDash className="h-4 w-4" />
                                            </button>
                                            <span className="mx-3 text-sm w-6 text-center">{item.quantity}</span>
                                            <button
                                                className="w-8 h-8 rounded-full border flex items-center justify-center hover:bg-gray-100 transition"
                                                onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                            >
                                                <BsPlus className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer của drawer */}
                {cartItems.length > 0 && (
                    <div className="border-t absolute bottom-0 left-0 right-0 bg-white">
                        <div className="p-4">
                            <div className="flex justify-between mb-2">
                                <span className="text-gray-600">Tạm tính</span>
                                <span className="font-medium">{formatPrice(cartTotal)}</span>
                            </div>

                            <Separator className="my-3" />

                            <div className="flex justify-between mb-4">
                                <span className="font-semibold">Tổng cộng</span>
                                <span className="font-semibold text-red-600">{formatPrice(cartTotal)}</span>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <Button variant="outline" onClick={handleViewCart}>
                                    Xem giỏ hàng
                                </Button>
                                <Button onClick={handleCheckout}>Thanh toán</Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

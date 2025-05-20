import { useEffect, useState } from "react";
import { BsCart3, BsDash, BsPlus } from "react-icons/bs";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Separator } from "../components/ui/separator";
import { CartItem, selectCart, selectCartTotal, updateQuantity } from "../redux/slices/cartSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { DeleteCartItemInput, UpdateQuantityInput } from "@/schema/cart";
import { changeProductQuantity, deleteCart, deleteCartItem } from "@/redux/thunks/cart";
import { applyDiscount, getDiscountsByShop } from "@/redux/thunks/discount";
import VoucherCard from "@/components/dicount/VoucherCard";
import { ApplyDiscountInput, Discount } from "@/schema/discount";

const CartPage = () => {
    const { cartId, items } = useSelector(selectCart);
    const cartItems = items;
    const { profile } = useAppSelector((state) => state.profile);
    const { discounts } = useAppSelector((state) => state.discount);
    const [currentCartItemData, setCurrentCartItemData] = useState<UpdateQuantityInput | null>(null);
    const cartTotal = useSelector(selectCartTotal);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [isProcessing, setIsProcessing] = useState(false);
    const [appliedProductIdList, setAppliedProductIdList] = useState<string[]>([]);
    const [appliedProductList, setAppliedProductList] = useState<CartItem[]>([]);
    const [shopList, setShopList] = useState<string[]>([]);

    const handleApplyDiscount = (discountId: string) => {
        if (!discountId || !cartId || appliedProductIdList.length == 0 || !profile) return;

        const applyDiscountInput: ApplyDiscountInput = {
            discountId,
            cartId,
            productIdList: appliedProductIdList,
            userId: profile.id
        };

        dispatch(
            applyDiscount({
                applyDiscountInput,
                shopList
            })
        );
    };

    const handleSelectAppliedProduct = (productId: string) => {
        if (appliedProductIdList.includes(productId))
            setAppliedProductIdList(appliedProductIdList.filter((appliedProduct) => appliedProduct !== productId));
        else setAppliedProductIdList((prev) => [...prev, productId]);
    };

    // Định dạng giá tiền VND
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND"
        }).format(price);
    };

    // Xử lý thay đổi số lượng sản phẩm
    const handleQuantityChange = (id: string, quantity: number, userId: string) => {
        if (quantity < 1) return;
        setCurrentCartItemData({
            userId,
            cartItemId: id,
            quantity
        });
        dispatch(updateQuantity({ id, quantity }));
    };

    useEffect(() => {
        setAppliedProductList(
            cartItems.filter((cartItem: CartItem) => appliedProductIdList.includes(cartItem.productId))
        );
    }, [appliedProductIdList.length]);

    useEffect(() => {
        const shopIdList: string[] = Array.from(new Set(cartItems.map((cartItem) => cartItem.shopId)));

        setShopList(shopIdList);

        setAppliedProductIdList(
            cartItems.reduce((arr: string[], cartItem: CartItem) => {
                if (cartItem.appliedDiscount) return [...arr, cartItem.productId];
                return arr;
            }, [])
        );

        dispatch(getDiscountsByShop(shopIdList));
    }, [JSON.stringify(cartItems)]);

    useEffect(() => {
        // Scroll to top when component mounts
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        let timerId = null;

        if (currentCartItemData != null)
            timerId = setTimeout(() => {
                dispatch(changeProductQuantity(currentCartItemData));
            }, 500);

        return () => {
            if (timerId) clearTimeout(timerId);
        };
    }, [JSON.stringify(cartItems), currentCartItemData]);

    // Xử lý xóa sản phẩm khỏi giỏ hàng
    const handleRemoveItem = (cartItemId: string, userId: string) => {
        const data: DeleteCartItemInput = {
            cartItemId,
            userId
        };
        dispatch(deleteCartItem(data));
    };

    // Xử lý xóa toàn bộ giỏ hàng
    const handleClearCart = (userId: string) => {
        dispatch(deleteCart(userId));
    };

    // Xử lý tiến hành thanh toán
    const handleCheckout = () => {
        setIsProcessing(true);

        // Giả lập quá trình thanh toán
        setTimeout(() => {
            setIsProcessing(false);
            // Chuyển hướng đến trang thanh toán
            navigate("/checkout");
        }, 1500);
    };

    // Nếu giỏ hàng trống
    if (cartItems.length === 0) {
        return (
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-8 text-center">Giỏ hàng</h1>
                <div className="flex flex-col items-center justify-center py-12">
                    <div className="text-center">
                        <BsCart3 className="h-24 w-24 text-gray-400 mx-auto mb-6" />
                        <h2 className="text-2xl font-bold mb-4">Giỏ hàng của bạn đang trống</h2>
                        <p className="text-gray-600 mb-6">Hãy thêm một vài sản phẩm vào giỏ hàng và quay lại sau.</p>
                        <Button onClick={() => navigate("/products")} className="px-6 py-2">
                            Tiếp tục mua sắm
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        profile && (
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-8 text-center">Giỏ hàng</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Danh sách sản phẩm (2/3 chiều rộng ở desktop) */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold">Sản phẩm ({cartItems.length})</h2>
                                <Button variant="outline" size="sm" onClick={() => handleClearCart(profile.id)}>
                                    Xóa tất cả
                                </Button>
                            </div>

                            <Separator className="mb-6" />

                            <div className="space-y-6">
                                {cartItems.map((item: CartItem) => (
                                    <div
                                        key={item.id}
                                        className="flex flex-col sm:flex-row items-start sm:items-center gap-4"
                                    >
                                        {/* Hình ảnh sản phẩm */}
                                        <div className="h-24 w-24 rounded overflow-hidden flex-shrink-0">
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="h-full w-full object-cover"
                                            />
                                        </div>

                                        {/* Thông tin sản phẩm */}
                                        <div className="flex-grow">
                                            <h3 className="font-medium text-lg">{item.name}</h3>
                                            <p className="text-red-600 font-semibold mt-1">{formatPrice(item.price)}</p>
                                            <div
                                                className="flex gap-1 items-center mt-2 cursor-pointer"
                                                onClick={() => handleSelectAppliedProduct(item.productId)}
                                            >
                                                <input
                                                    type="checkbox"
                                                    className="relative top-[1px]"
                                                    checked={appliedProductIdList.includes(item.productId)}
                                                    readOnly={true}
                                                />
                                                <span className="text-sm font-semibold">Áp mã giảm giá</span>
                                            </div>
                                        </div>

                                        {/* Số lượng và thao tác */}
                                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                                            <div className="flex items-center border rounded overflow-hidden">
                                                <button
                                                    className="px-3 py-1 bg-gray-100 hover:bg-gray-200 transition"
                                                    onClick={() =>
                                                        handleQuantityChange(item.id, item.quantity - 1, profile.id)
                                                    }
                                                    disabled={item.quantity <= 1}
                                                >
                                                    <BsDash className="h-4 w-4" />
                                                </button>
                                                <span className="px-4 py-1 text-center w-12">{item.quantity}</span>
                                                <button
                                                    className="px-3 py-1 bg-gray-100 hover:bg-gray-200 transition"
                                                    onClick={() =>
                                                        handleQuantityChange(item.id, item.quantity + 1, profile.id)
                                                    }
                                                >
                                                    <BsPlus className="h-4 w-4" />
                                                </button>
                                            </div>

                                            <button
                                                className="text-red-500 hover:text-red-700 transition"
                                                onClick={() => handleRemoveItem(item.id, profile.id)}
                                            >
                                                Xóa
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Tóm tắt đơn hàng (1/3 chiều rộng ở desktop) */}
                    <div className="lg:col-span-1">
                        <Card className="sticky top-6">
                            <div className="p-6">
                                <h2 className="text-xl font-bold mb-4">Tóm tắt đơn hàng</h2>

                                <Separator className="mb-4" />

                                <div className="space-y-3 mb-6">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Tạm tính</span>
                                        <span>{formatPrice(cartTotal)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Phí vận chuyển</span>
                                        <span>Miễn phí</span>
                                    </div>
                                </div>

                                <Separator className="mb-4" />

                                <div className="flex justify-between mb-6">
                                    <span className="font-bold">Tổng cộng</span>
                                    <span className="font-bold text-red-600 text-xl">{formatPrice(cartTotal)}</span>
                                </div>

                                <Button className="w-full py-6" disabled={isProcessing} onClick={handleCheckout}>
                                    {isProcessing ? "Đang xử lý..." : "Tiến hành đặt hàng"}
                                </Button>

                                <div className="mt-6">
                                    <Button variant="outline" className="w-full" onClick={() => navigate("/products")}>
                                        Tiếp tục mua sắm
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>

                <div className="flex flex-col">
                    {discounts &&
                        discounts.map((discount: Discount) => {
                            const cond1 =
                                discount.applied_product_type === "all" &&
                                appliedProductList.every((appliedProduct) => appliedProduct.shopId === discount.shop);

                            const cond2 =
                                discount.applied_product_type === "specific" &&
                                appliedProductList.every((appliedProduct) =>
                                    discount.applied_product_list.includes(appliedProduct.productId)
                                );

                            if (cond1 || cond2 || appliedProductIdList.length === 0)
                                return (
                                    <VoucherCard
                                        key={discount._id}
                                        discount={discount}
                                        userId={profile.id}
                                        handleApplyDiscount={handleApplyDiscount}
                                    />
                                );
                        })}
                </div>
            </div>
        )
    );
};

export default CartPage;

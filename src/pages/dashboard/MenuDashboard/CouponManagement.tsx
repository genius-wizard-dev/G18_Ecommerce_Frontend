import VoucherCard from "@/components/dicount/VoucherCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ScrollArea } from "@/components/ui/scroll-area";
import api from "@/lib/axios/api.service";
import { ENDPOINTS } from "@/lib/axios/endpoint";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { createDiscount, deleteDiscount, getDiscountsByShop, updateDiscount } from "@/redux/thunks/discount";
import { CreateDiscountInput, DeleteDiscountInput, Discount, UpdateDiscountInput } from "@/schema/discount";
import { ProductInput, ProductListResponse } from "@/schema/product";
import { getImageUrl } from "@/utils/getImage";
import { Calendar, CreditCard, ShoppingCart, Tag, User } from "lucide-react";
import React, { useEffect, useState } from "react";

const CouponManagement: React.FC = () => {
    const dispatch = useAppDispatch();
    const { profile } = useAppSelector((state) => state.profile);
    const { discounts } = useAppSelector((state) => state.discount);
    const [products, setProducts] = useState<ProductInput[]>([]);
    const [appliedProductList, setAppliedProductList] = useState<string[]>([]);
    const [name, setName] = useState("");
    const [code, setCode] = useState("");
    const [discount, setDiscount] = useState("");
    const [minPurchase, setMinPurchase] = useState("");
    const [usageLimit, setUsageLimit] = useState("");
    const [usagePerUser, setUsagePerUser] = useState("1");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [couponType, setCouponType] = useState<"percentage" | "fixed">("percentage");
    const [displayType, setDisplayType] = useState<"all" | "specific">("all");
    const [currentDiscount, setCurrentDiscount] = useState<Discount | null>(null);
    const handSelectProduct = (productId: string) => {
        if (!appliedProductList.includes(productId)) setAppliedProductList((prev) => [...prev, productId]);
        else setAppliedProductList(appliedProductList.filter((appliedProduct) => appliedProduct !== productId));
    };

    const handleSelectEditedDiscount = (discountId: string) => {
        window.scrollTo(0, 0);
        setCurrentDiscount(discounts.find((discount) => discount._id === discountId) as Discount);
    };

    const handleDeleteDiscount = (discountId: string) => {
        if (!profile) return;

        const deleteDiscountInput: DeleteDiscountInput = {
            discountId,
            shopId: profile.shopId
        };

        dispatch(deleteDiscount(deleteDiscountInput));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const parsedDiscount = Number(discount);
        const parsedMinPurchase = Number(minPurchase);
        const parsedUsageLimit = Number(usageLimit);
        const parsedUsagePerUser = Number(usagePerUser);

        if (!name.trim()) {
            alert("Vui lòng nhập tên chương trình giảm giá");
            return;
        }

        if (!code.trim()) {
            alert("Mã giảm giá không được để trống.");
            return;
        }

        if (code.trim().length < 5) {
            alert("Mã giảm giá phải trên 5 ký tự.");
            return;
        }

        if (!startDate || !endDate) {
            alert("Ngày bắt đầu và kết thúc không được để trống.");
            return;
        }

        if (new Date(startDate).getTime() < new Date().getTime() && !currentDiscount) {
            alert("Ngày băt đầu phải lớn hơn ngày giờ hiện tại.");
            return;
        }

        if (couponType === "percentage") {
            if (isNaN(parsedDiscount) || parsedDiscount < 0 || parsedDiscount > 100) {
                alert("Phần trăm giảm giá phải từ 0 đến 100%.");
                return;
            }
        } else {
            if (isNaN(parsedDiscount) || parsedDiscount < 0) {
                alert("Số tiền giảm giá không được âm.");
                return;
            }
        }

        if (!parsedUsageLimit) {
            alert("Vui lòng nhập số lượng mã giảm giá");
            return;
        }

        if (!profile) return;

        const createDiscountInput: CreateDiscountInput = {
            shop: profile.shopId,
            name,
            code,
            start_time: new Date(startDate).toISOString(),
            expiry_time: new Date(endDate).toISOString(),
            quantity: parsedUsageLimit,
            quantity_per_user: parsedUsagePerUser,
            discount_type: couponType,
            discount_value: parsedDiscount,
            min_price_product: parsedMinPurchase,
            applied_product_type: displayType,
            applied_product_list: appliedProductList
        };

        if (displayType === "specific" && appliedProductList.length === 0) {
            alert("Vui lòng chọn sản phẩm sẽ được giảm giá");
            return;
        }
        if (currentDiscount) {
            const updateDiscountInput: UpdateDiscountInput = {
                discountId: currentDiscount._id,
                data: createDiscountInput
            };
            dispatch(updateDiscount(updateDiscountInput));
            setCurrentDiscount(null);
        } else dispatch(createDiscount(createDiscountInput));

        resetForm();
    };

    const resetForm = () => {
        setName("");
        setCode("");
        setDiscount("");
        setMinPurchase("");
        setUsageLimit("");
        setUsagePerUser("1");
        setStartDate("");
        setEndDate("");
        setCouponType("percentage");
        setAppliedProductList([]);
        setDisplayType("all");
    };

    // Statistics
    const totalCoupons = discounts.length;
    const activeCoupons = discounts.filter((c) => c.is_active).length;
    const inactiveCoupons = discounts.filter((c) => !c.is_active).length;

    useEffect(() => {
        if (displayType === "specific" && profile) {
            api.get<ProductListResponse>(ENDPOINTS.PRODUCT.GET_BY_SHOP(profile.shopId)).then((res) => {
                setProducts(res.data.products);
            });
        }
    }, [displayType, profile]);

    useEffect(() => {
        if (profile && profile.shopId) {
            dispatch(getDiscountsByShop([profile.shopId])).then((data) => {
                console.log(data);
            });
        }
    }, [profile]);

    useEffect(() => {
        if (currentDiscount) {
            setName(currentDiscount.name);
            setCode(currentDiscount.code);
            setDiscount(currentDiscount.discount_value.toString());
            setMinPurchase(currentDiscount.min_price_product.toString());
            setUsageLimit(currentDiscount.quantity.toString());
            setUsagePerUser(currentDiscount.quantity_per_user.toString());
            setStartDate(new Date(currentDiscount.start_time).toISOString().slice(0, 16));
            setEndDate(new Date(currentDiscount.start_time).toISOString().slice(0, 16));
            setCouponType(currentDiscount.discount_type as "fixed" | "percentage");
            setDisplayType(currentDiscount.applied_product_type as "all" | "specific");
            setAppliedProductList(currentDiscount.applied_product_list);
        }
    }, [currentDiscount]);

    return (
        <section id="coupons" className="space-y-6">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Quản lý phiếu giảm giá</h2>

            {/* Coupon Stats */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Tổng số phiếu</CardTitle>
                        <CreditCard className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalCoupons}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Đang hoạt động</CardTitle>
                        <Tag className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{activeCoupons.toLocaleString()}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Đã hết hạn</CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{inactiveCoupons.toLocaleString()}</div>
                    </CardContent>
                </Card>
            </div>

            {/* Add/Edit Coupon Form */}
            <Card>
                <CardHeader>
                    <CardTitle>Thêm phiếu giảm giá</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="flex flex-col gap-6">
                            {/* Tên chương trình và mã voucher */}
                            <div className="flex flex-col gap-4 md:flex-row md:gap-4 lg:gap-6 w-full">
                                <div className="flex-1 space-y-2 min-w-0 w-full">
                                    <Label htmlFor="program-name">Tên chương trình giảm giá</Label>
                                    <Input
                                        id="program-name"
                                        placeholder="Nhập tên chương trình"
                                        className="h-12 w-full"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </div>
                                <div className="flex-1 space-y-2 min-w-0 w-full">
                                    <Label htmlFor="voucher-code">Mã voucher</Label>
                                    <div className="relative">
                                        <Input
                                            id="voucher-code"
                                            placeholder="KEXXX"
                                            value={code}
                                            onChange={(e) => setCode(e.target.value)}
                                            className="h-12 w-full pr-10"
                                        />
                                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                            <span className="text-xs text-muted-foreground">{code.length}/5</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Thời gian sử dụng mã */}
                            <div className="space-y-2 w-full">
                                <Label>Thời gian sử dụng mã</Label>
                                <div className="flex flex-col gap-4 md:flex-row md:gap-4 lg:gap-6 w-full">
                                    <div className="relative w-full">
                                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                        <Input
                                            type="datetime-local"
                                            value={startDate}
                                            onChange={(e) => setStartDate(e.target.value)}
                                            className="h-12 pl-10 w-full"
                                        />
                                    </div>
                                    <div className="relative w-full">
                                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                        <Input
                                            type="datetime-local"
                                            value={endDate}
                                            onChange={(e) => setEndDate(e.target.value)}
                                            className="h-12 pl-10 w-full"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Loại giảm giá */}
                            <div className="space-y-4 w-full">
                                <Label>Loại giảm giá | Mức giảm</Label>
                                <div className="flex flex-col gap-4 md:flex-row md:items-center md:gap-4 lg:gap-6 w-full">
                                    <RadioGroup
                                        value={couponType}
                                        onValueChange={(value) => setCouponType(value as "percentage" | "fixed")}
                                        className="flex flex-row gap-3 md:gap-6"
                                    >
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="percentage" id="percentage" className="h-5 w-5" />
                                            <Label htmlFor="percentage">Theo phần trăm</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="fixed" id="fixed" className="h-5 w-5" />
                                            <Label htmlFor="fixed">Theo số tiền</Label>
                                        </div>
                                    </RadioGroup>
                                    <div className="relative w-full md:w-32">
                                        <Input
                                            placeholder="Nhập giá trị"
                                            value={discount}
                                            onChange={(e) => setDiscount(e.target.value)}
                                            className="h-12 w-full"
                                            type="number"
                                        />
                                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                            {couponType === "percentage" ? "%" : "₫"}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Điều kiện áp dụng */}
                            <div className="flex flex-col gap-4 md:flex-row md:gap-4 lg:gap-6 w-full">
                                <div className="flex-1 space-y-2 w-full">
                                    <Label htmlFor="min-purchase">Giá trị đơn hàng tối thiểu</Label>
                                    <div className="relative">
                                        <ShoppingCart className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                        <Input
                                            id="min-purchase"
                                            placeholder="Nhập giá trị"
                                            value={minPurchase}
                                            onChange={(e) => setMinPurchase(e.target.value)}
                                            className="h-12 pl-10 w-full"
                                            type="number"
                                        />
                                    </div>
                                </div>
                                <div className="flex-1 space-y-2 w-full">
                                    <Label htmlFor="usage-limit">Số lượng voucher</Label>
                                    <div className="relative">
                                        <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                        <Input
                                            id="usage-limit"
                                            placeholder="Nhập số lượng"
                                            value={usageLimit}
                                            onChange={(e) => setUsageLimit(e.target.value)}
                                            className="h-12 pl-10 w-full"
                                            type="number"
                                        />
                                    </div>
                                </div>
                                <div className="flex-1 space-y-2 w-full">
                                    <Label htmlFor="usage-per-user">Số lượt dùng mỗi người</Label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                        <Input
                                            id="usage-per-user"
                                            value={usagePerUser}
                                            onChange={(e) => setUsagePerUser(e.target.value)}
                                            className="h-12 pl-10 w-full"
                                            type="number"
                                            min="1"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Áp dụng cho sản phẩm */}
                            <div className="space-y-4 w-full">
                                <Label>Áp dụng cho sản phẩm</Label>
                                <RadioGroup
                                    value={displayType}
                                    onValueChange={(value) => setDisplayType(value as "all" | "specific")}
                                    className="flex flex-col gap-3"
                                >
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="all" id="apply-all" className="h-5 w-5" />
                                        <Label htmlFor="apply-all" className="cursor-pointer">
                                            Áp dụng cho tất cả sản phẩm
                                        </Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="specific" id="apply-individual" className="h-5 w-5" />
                                        <Label htmlFor="apply-individual" className="cursor-pointer">
                                            Áp dụng cho các sản phẩm chỉ định
                                        </Label>
                                    </div>
                                </RadioGroup>

                                {displayType === "specific" && (
                                    <div className="space-y-4 w-full overflow-auto max-h-[300px]">
                                        {products.map((product: ProductInput) => (
                                            <li
                                                key={product._id}
                                                className="border p-3 rounded-lg flex gap-10 items-center"
                                            >
                                                <img
                                                    src={getImageUrl(product.thumbnailImage)}
                                                    alt="product"
                                                    className="h-12 w-12 rounded-full object-cover"
                                                />
                                                <span className="font-semibold">{product.name}</span>
                                                <span className="font-medium text-red-600">{`${product.price}đ`}</span>

                                                <span className="flex-1 flex justify-end">
                                                    <input
                                                        type="checkbox"
                                                        readOnly
                                                        checked={appliedProductList.includes(product._id)}
                                                        onClick={() => {
                                                            handSelectProduct(product._id);
                                                        }}
                                                    />
                                                </span>
                                            </li>
                                        ))}
                                    </div>
                                )}

                                <div className="flex flex-col gap-3 md:flex-row md:gap-4 w-full justify-center mt-8">
                                    <Button
                                        type="submit"
                                        className={`h-12 w-82 ${
                                            currentDiscount ? "bg-red-500" : "bg-blue-600"
                                        } text-white transform active:scale-95 cursor-pointer`}
                                    >
                                        {currentDiscount ? "Cập nhật" : "Thêm"}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </form>
                </CardContent>
            </Card>
            {/* Coupon List */}
            <Card>
                <CardHeader>
                    <CardTitle>Danh sách phiếu giảm giá</CardTitle>
                </CardHeader>
                <CardContent>
                    <ScrollArea className="h-fit">
                        {discounts.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
                                <CreditCard className="h-8 w-8 mb-2" />
                                <p>Chưa có phiếu giảm giá nào.</p>
                            </div>
                        ) : (
                            discounts.map((discount: Discount) => (
                                <VoucherCard
                                    key={discount._id}
                                    discount={discount}
                                    userId={null}
                                    handleApplyDiscount={null}
                                    handleSelectEditedDiscount={handleSelectEditedDiscount}
                                    handleDeleteDiscount={handleDeleteDiscount}
                                />
                            ))
                        )}
                    </ScrollArea>
                </CardContent>
            </Card>
        </section>
    );
};

export default CouponManagement;

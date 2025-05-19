import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Calendar,
  CreditCard,
  Info,
  Pencil,
  Plus,
  ShoppingCart,
  Tag,
  Trash2,
  Users,
} from "lucide-react";
import React, { useEffect, useState } from "react";

interface Coupon {
  id: number;
  code: string;
  discount: number;
  type: "percentage" | "fixed";
  minPurchase: number;
  usageLimit: number;
  usagePerUser: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

const CouponManagement: React.FC = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [code, setCode] = useState("");
  const [discount, setDiscount] = useState("");
  const [minPurchase, setMinPurchase] = useState("");
  const [usageLimit, setUsageLimit] = useState("");
  const [usagePerUser, setUsagePerUser] = useState("1");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [couponType, setCouponType] = useState<"percentage" | "fixed">(
    "percentage"
  );
  // const [discountType, setDiscountType] = useState<"promotion" | "refund">(
  //   "promotion"
  // );
  const [displayType, setDisplayType] = useState<"multiple" | "single">(
    "multiple"
  );
  const [editId, setEditId] = useState<number | null>(null);

  // Load coupons from localStorage
  useEffect(() => {
    try {
      const savedCoupons = localStorage.getItem("coupons");
      if (savedCoupons) {
        setCoupons(JSON.parse(savedCoupons));
      }
    } catch (error) {
      console.error("Error loading coupons from localStorage:", error);
    }
  }, []);

  // Save coupons to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("coupons", JSON.stringify(coupons));
    } catch (error) {
      console.error("Error saving coupons to localStorage:", error);
      alert("Lưu trữ phiếu giảm giá thất bại do giới hạn bộ nhớ.");
    }
  }, [coupons]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedDiscount = Number(discount);
    const parsedMinPurchase = Number(minPurchase);
    const parsedUsageLimit = Number(usageLimit);
    const parsedUsagePerUser = Number(usagePerUser);

    // Validation
    if (!code.trim()) {
      alert("Mã giảm giá không được để trống.");
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

    if (editId !== null) {
      setCoupons(
        coupons.map((coupon) =>
          coupon.id === editId
            ? {
                ...coupon,
                code,
                discount: parsedDiscount,
                type: couponType,
                minPurchase: parsedMinPurchase,
                usageLimit: parsedUsageLimit,
                usagePerUser: parsedUsagePerUser,
                startDate,
                endDate,
                isActive: true,
              }
            : coupon
        )
      );
      setEditId(null);
    } else {
      const newCoupon: Coupon = {
        id: Date.now(),
        code,
        discount: parsedDiscount,
        type: couponType,
        minPurchase: parsedMinPurchase,
        usageLimit: parsedUsageLimit,
        usagePerUser: parsedUsagePerUser,
        startDate,
        endDate,
        isActive: true,
      };
      setCoupons([...coupons, newCoupon]);
    }
    resetForm();
  };

  const resetForm = () => {
    setCode("");
    setDiscount("");
    setMinPurchase("");
    setUsageLimit("");
    setUsagePerUser("1");
    setStartDate("");
    setEndDate("");
    setCouponType("percentage");
    setEditId(null);
  };

  const handleEdit = (coupon: Coupon) => {
    setCode(coupon.code);
    setDiscount(coupon.discount.toString());
    setCouponType(coupon.type);
    setMinPurchase(coupon.minPurchase.toString());
    setUsageLimit(coupon.usageLimit.toString());
    setUsagePerUser(coupon.usagePerUser.toString());
    setStartDate(coupon.startDate);
    setEndDate(coupon.endDate);
    setEditId(coupon.id);
  };

  const handleDelete = (id: number) => {
    setCoupons(coupons.filter((coupon) => coupon.id !== id));
  };

  // Statistics
  const totalCoupons = coupons.length;
  const activeCoupons = coupons.filter((c) => c.isActive).length;
  const inactiveCoupons = coupons.filter((c) => !c.isActive).length;

  return (
    <section id="coupons" className="space-y-6">
      <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
        Quản lý phiếu giảm giá
      </h2>

      {/* Coupon Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng số phiếu</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalCoupons.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Đang hoạt động
            </CardTitle>
            <Tag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {activeCoupons.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đã hết hạn</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {inactiveCoupons.toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add/Edit Coupon Form */}
      <Card>
        <CardHeader>
          <CardTitle>
            {editId !== null ? "Sửa phiếu giảm giá" : "Thêm phiếu giảm giá"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col gap-6">
              {/* Tên chương trình và mã voucher */}
              <div className="flex flex-col gap-4 md:flex-row md:gap-4 lg:gap-6 w-full">
                <div className="flex-1 space-y-2 min-w-0 w-full">
                  <Label htmlFor="program-name">
                    Tên chương trình giảm giá
                  </Label>
                  <Input
                    id="program-name"
                    placeholder="Nhập tên chương trình"
                    className="h-12 w-full"
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
                      <span className="text-xs text-muted-foreground">
                        {code.length}/5
                      </span>
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
                    onValueChange={(value) =>
                      setCouponType(value as "percentage" | "fixed")
                    }
                    className="flex flex-row gap-3 md:gap-6"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        value="percentage"
                        id="percentage"
                        className="h-5 w-5"
                      />
                      <Label htmlFor="percentage">Theo phần trăm</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        value="fixed"
                        id="fixed"
                        className="h-5 w-5"
                      />
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
                  <Label htmlFor="min-purchase">
                    Giá trị đơn hàng tối thiểu
                  </Label>
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
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      ₫
                    </span>
                  </div>
                </div>
                <div className="flex-1 space-y-2 w-full">
                  <Label htmlFor="usage-limit">Tổng lượt sử dụng tối đa</Label>
                  <div className="relative">
                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="usage-limit"
                      placeholder="Nhập số lượt"
                      value={usageLimit}
                      onChange={(e) => setUsageLimit(e.target.value)}
                      className="h-12 pl-10 w-full"
                      type="number"
                    />
                  </div>
                </div>
                <div className="flex-1 space-y-2 w-full">
                  <Label htmlFor="usage-per-user">
                    Lượt sử dụng tối đa/Người mua
                  </Label>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="usage-per-user"
                      value={usagePerUser}
                      onChange={(e) => setUsagePerUser(e.target.value)}
                      className="h-12 pl-10 w-full"
                      type="number"
                      min="1"
                    />
                    <Info
                      size={16}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground cursor-help"
                    />
                  </div>
                </div>
              </div>

              {/* Áp dụng cho sản phẩm */}
              <div className="space-y-4 w-full">
                <Label>Áp dụng cho sản phẩm</Label>
                <RadioGroup
                  value={displayType}
                  onValueChange={(value) =>
                    setDisplayType(value as "multiple" | "single")
                  }
                  className="flex flex-col gap-3"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="multiple"
                      id="apply-all"
                      className="h-5 w-5"
                    />
                    <Label htmlFor="apply-all" className="cursor-pointer">
                      Áp dụng cho tất cả sản phẩm
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="single"
                      id="apply-individual"
                      className="h-5 w-5"
                    />
                    <Label
                      htmlFor="apply-individual"
                      className="cursor-pointer"
                    >
                      Áp dụng cho từng sản phẩm
                    </Label>
                  </div>
                </RadioGroup>
                {displayType === "single" && (
                  <div className="space-y-4 w-full">
                    <Button
                      variant="outline"
                      className="w-full border-2 border-dashed h-12"
                    >
                      <Plus size={20} className="mr-2" /> Chọn sản phẩm
                    </Button>
                  </div>
                )}
                <div className="flex flex-col gap-3 md:flex-row md:gap-4 w-full">
                  <Button
                    type="submit"
                    variant="outline"
                    className="h-12 w-full md:w-auto"
                  >
                    {editId !== null ? (
                      <>
                        <Pencil className="h-4 w-4 mr-2" />
                        Cập nhật
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4 mr-2" />
                        Thêm
                      </>
                    )}
                  </Button>
                  {editId !== null && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={resetForm}
                      className="h-12 w-full md:w-auto"
                    >
                      Hủy
                    </Button>
                  )}
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
            {coupons.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
                <CreditCard className="h-8 w-8 mb-2" />
                <p>Chưa có phiếu giảm giá nào.</p>
              </div>
            ) : (
              <div className="space-y-4 pr-4">
                {coupons.map((coupon) => (
                  <div
                    key={coupon.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div>
                        <h4 className="font-medium">{coupon.code}</h4>
                        <p className="text-sm text-muted-foreground">
                          {coupon.type === "percentage"
                            ? `Giảm ${coupon.discount}%`
                            : `Giảm ${coupon.discount.toLocaleString()}₫`}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {coupon.startDate && coupon.endDate
                            ? `${new Date(
                                coupon.startDate
                              ).toLocaleDateString()} - ${new Date(
                                coupon.endDate
                              ).toLocaleDateString()}`
                            : "Không giới hạn thời gian"}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleEdit(coupon)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleDelete(coupon.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </section>
  );
};

export default CouponManagement;

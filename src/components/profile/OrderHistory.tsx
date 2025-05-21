import { Profile } from "@/schema/profile";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { getOrdersByUser } from "@/redux/thunks/order";
import { Order } from "@/schema/order";
import DetailsOrderModal from "../order/DetailsOrderModal";

// Danh sách đơn hàng gần đây (mock data)
const recentOrders = [
    { id: "ORD-001", date: "2023-11-15", total: 1250000, status: "Đã giao" },
    { id: "ORD-002", date: "2023-10-28", total: 750000, status: "Đã giao" },
    { id: "ORD-003", date: "2023-10-15", total: 2150000, status: "Đang giao" },
    { id: "ORD-004", date: "2023-09-30", total: 450000, status: "Đã hủy" }
];

export const OrderHistory = ({ user }: { user: Profile }) => {
    const dispatch = useAppDispatch();
    const { orders } = useAppSelector((state) => state.order);
    const [visibleDetailsOrderModal, setVisibleDetailsOrderModal] = useState(false);
    const [currentOrder, setCurrentOrder] = useState<Order | null>(null);

    const handleToggleDisplayDetailsOrderModal = () => {
        setVisibleDetailsOrderModal((prev) => !prev);
    };

    const handleClickDetailsOrderBtn = (order: Order) => {
        handleToggleDisplayDetailsOrderModal();
        setCurrentOrder(order);
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND"
        }).format(amount);
    };

    const formatDate = (dateString: string | null) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return new Intl.DateTimeFormat("vi-VN").format(date);
    };

    const mapOrderStatus = (status: string) => {
        let content = "Chưa xác định";

        switch (status) {
            case "COMPLETED":
                content = "Đã thanh toán";
                break;
            case "CREATED_PAYMENT":
                content = "Chưa thanh toán";
                break;
            default:
                break;
        }

        return content;
    };

    const checkValidOrder = (status: string) => {
        if (status !== "COMPLETED") return false;
        return true;
    };

    useEffect(() => {
        dispatch(getOrdersByUser(user.id));
    }, [dispatch]);

    return (
        <Card>
            {visibleDetailsOrderModal && currentOrder && (
                <DetailsOrderModal
                    currentOrder={currentOrder}
                    handleToggleDisplayDetailsOrderModal={handleToggleDisplayDetailsOrderModal}
                />
            )}
            <CardHeader>
                <CardTitle>Lịch sử đơn hàng</CardTitle>
                <CardDescription>Các đơn hàng gần đây của bạn</CardDescription>
            </CardHeader>
            <CardContent>
                {orders.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-gray-50">
                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                                        Mã đơn hàng
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Ngày đặt</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Tổng tiền</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                                        Trạng thái
                                    </th>
                                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-600"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {orders.map((order: Order) => (
                                    <tr key={order.orderNumber} className="hover:bg-gray-50">
                                        <td className="px-4 py-4 text-sm font-medium">{order.orderNumber}</td>
                                        <td className="px-4 py-4 text-sm text-gray-600">
                                            {formatDate(order.createdAt)}
                                        </td>
                                        <td className="px-4 py-4 text-sm text-gray-600">
                                            {formatCurrency(order.totalPrice)}
                                        </td>
                                        <td className="px-4 py-4 text-sm">
                                            <span
                                                className={`inline-block px-2 py-1 rounded-full text-xs font-medium text-center ${
                                                    checkValidOrder(order.status)
                                                        ? "bg-green-100 text-green-800"
                                                        : "bg-red-100 text-red-800"
                                                }`}
                                            >
                                                {mapOrderStatus(order.status)}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4 text-sm text-right">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => {
                                                    handleClickDetailsOrderBtn(order);
                                                }}
                                            >
                                                Chi tiết
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <p className="text-gray-500">Bạn chưa có đơn hàng nào.</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

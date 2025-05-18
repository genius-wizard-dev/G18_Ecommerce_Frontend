import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";

// Danh sách đơn hàng gần đây (mock data)
const recentOrders = [
  { id: "ORD-001", date: "2023-11-15", total: 1250000, status: "Đã giao" },
  { id: "ORD-002", date: "2023-10-28", total: 750000, status: "Đã giao" },
  { id: "ORD-003", date: "2023-10-15", total: 2150000, status: "Đang giao" },
  { id: "ORD-004", date: "2023-09-30", total: 450000, status: "Đã hủy" },
];

export const OrderHistory = () => {
  // Format định dạng tiền tệ
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  // Định dạng ngày
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("vi-VN").format(date);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lịch sử đơn hàng</CardTitle>
        <CardDescription>Các đơn hàng gần đây của bạn</CardDescription>
      </CardHeader>
      <CardContent>
        {recentOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                    Mã đơn hàng
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                    Ngày đặt
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                    Tổng tiền
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                    Trạng thái
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-600"></th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 text-sm font-medium">
                      {order.id}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-600">
                      {formatDate(order.date)}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-600">
                      {formatCurrency(order.total)}
                    </td>
                    <td className="px-4 py-4 text-sm">
                      <span
                        className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                          order.status === "Đã giao"
                            ? "bg-green-100 text-green-800"
                            : order.status === "Đang giao"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm text-right">
                      <Button variant="outline" size="sm">
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

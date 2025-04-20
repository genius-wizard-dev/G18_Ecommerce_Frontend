import { useState } from "react";
import { toast } from "sonner";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Separator } from "../components/ui/separator";

// Định nghĩa kiểu dữ liệu cho thông tin user
interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  birthday: string;
  address: string;
  avatar: string;
}

// Mock data user profile
const mockUserProfile: UserProfile = {
  id: "1",
  fullName: "Nguyễn Văn A",
  email: "nguyenvana@example.com",
  phoneNumber: "0123456789",
  birthday: "1990-01-01",
  address: "Số 123, Đường ABC, Quận XYZ, TP. Hồ Chí Minh",
  avatar: "https://randomuser.me/api/portraits/men/32.jpg",
};

// Danh sách đơn hàng gần đây (mock data)
const recentOrders = [
  { id: "ORD-001", date: "2023-11-15", total: 1250000, status: "Đã giao" },
  { id: "ORD-002", date: "2023-10-28", total: 750000, status: "Đã giao" },
  { id: "ORD-003", date: "2023-10-15", total: 2150000, status: "Đang giao" },
  { id: "ORD-004", date: "2023-09-30", total: 450000, status: "Đã hủy" },
];

const Profile = () => {
  // State cho thông tin người dùng
  const [userProfile, setUserProfile] = useState<UserProfile>(mockUserProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] =
    useState<UserProfile>(mockUserProfile);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"info" | "orders" | "security">(
    "info"
  );

  // Xử lý thay đổi input khi chỉnh sửa thông tin
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Xử lý cập nhật thông tin người dùng
  const handleUpdateProfile = () => {
    setIsLoading(true);

    // Giả lập API call
    setTimeout(() => {
      setUserProfile(editedProfile);
      setIsEditing(false);
      setIsLoading(false);
      toast.success("Cập nhật thông tin thành công!");
    }, 1000);
  };

  // Format định dạng tiền tệ
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  // Định dạng ngày
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("vi-VN").format(date);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Trang cá nhân</h1>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <div className="w-full md:w-1/4">
          <Card className="mb-6">
            <CardContent className="p-6 flex flex-col items-center">
              <div className="relative mb-4">
                <img
                  src={userProfile.avatar}
                  alt="Avatar"
                  className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-md"
                />
                {!isEditing && (
                  <button className="absolute bottom-0 right-0 bg-primary text-white p-1 rounded-full w-8 h-8 flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-4 h-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z"
                      />
                    </svg>
                  </button>
                )}
              </div>
              <h2 className="text-xl font-bold">{userProfile.fullName}</h2>
              <p className="text-gray-500">{userProfile.email}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-0">
              <div className="divide-y">
                <button
                  className={`w-full p-4 text-left flex items-center gap-3 hover:bg-gray-50 transition-colors ${
                    activeTab === "info" ? "bg-gray-50 font-semibold" : ""
                  }`}
                  onClick={() => setActiveTab("info")}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                    />
                  </svg>
                  Thông tin cá nhân
                </button>
                <button
                  className={`w-full p-4 text-left flex items-center gap-3 hover:bg-gray-50 transition-colors ${
                    activeTab === "orders" ? "bg-gray-50 font-semibold" : ""
                  }`}
                  onClick={() => setActiveTab("orders")}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                    />
                  </svg>
                  Lịch sử đơn hàng
                </button>
                <button
                  className={`w-full p-4 text-left flex items-center gap-3 hover:bg-gray-50 transition-colors ${
                    activeTab === "security" ? "bg-gray-50 font-semibold" : ""
                  }`}
                  onClick={() => setActiveTab("security")}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
                    />
                  </svg>
                  Bảo mật tài khoản
                </button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main content */}
        <div className="w-full md:w-3/4">
          {activeTab === "info" && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Thông tin cá nhân</CardTitle>
                  <CardDescription>
                    Quản lý thông tin cá nhân của bạn
                  </CardDescription>
                </div>
                {!isEditing ? (
                  <Button onClick={() => setIsEditing(true)}>Chỉnh sửa</Button>
                ) : (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsEditing(false);
                        setEditedProfile(userProfile);
                      }}
                    >
                      Hủy
                    </Button>
                    <Button onClick={handleUpdateProfile} disabled={isLoading}>
                      {isLoading ? "Đang lưu..." : "Lưu thay đổi"}
                    </Button>
                  </div>
                )}
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Họ và tên</Label>
                    {isEditing ? (
                      <Input
                        id="fullName"
                        name="fullName"
                        value={editedProfile.fullName}
                        onChange={handleInputChange}
                      />
                    ) : (
                      <div className="p-2 border rounded-md bg-gray-50">
                        {userProfile.fullName}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    {isEditing ? (
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={editedProfile.email}
                        onChange={handleInputChange}
                      />
                    ) : (
                      <div className="p-2 border rounded-md bg-gray-50">
                        {userProfile.email}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber">Số điện thoại</Label>
                    {isEditing ? (
                      <Input
                        id="phoneNumber"
                        name="phoneNumber"
                        value={editedProfile.phoneNumber}
                        onChange={handleInputChange}
                      />
                    ) : (
                      <div className="p-2 border rounded-md bg-gray-50">
                        {userProfile.phoneNumber}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="birthday">Ngày sinh</Label>
                    {isEditing ? (
                      <Input
                        id="birthday"
                        name="birthday"
                        type="date"
                        value={editedProfile.birthday}
                        onChange={handleInputChange}
                      />
                    ) : (
                      <div className="p-2 border rounded-md bg-gray-50">
                        {formatDate(userProfile.birthday)}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="address">Địa chỉ</Label>
                    {isEditing ? (
                      <Input
                        id="address"
                        name="address"
                        value={editedProfile.address}
                        onChange={handleInputChange}
                      />
                    ) : (
                      <div className="p-2 border rounded-md bg-gray-50">
                        {userProfile.address}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "orders" && (
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
          )}

          {activeTab === "security" && (
            <Card>
              <CardHeader>
                <CardTitle>Bảo mật tài khoản</CardTitle>
                <CardDescription>
                  Quản lý bảo mật và thông tin đăng nhập
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Đổi mật khẩu</h3>
                    <p className="text-gray-500 text-sm mb-4">
                      Để bảo mật tài khoản, bạn nên sử dụng mật khẩu mạnh và
                      thay đổi định kỳ.
                    </p>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="currentPassword">
                          Mật khẩu hiện tại
                        </Label>
                        <Input id="currentPassword" type="password" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="newPassword">Mật khẩu mới</Label>
                        <Input id="newPassword" type="password" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">
                          Nhập lại mật khẩu mới
                        </Label>
                        <Input id="confirmPassword" type="password" />
                      </div>

                      <Button>Cập nhật mật khẩu</Button>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-lg font-medium mb-2">
                      Xác thực hai yếu tố
                    </h3>
                    <p className="text-gray-500 text-sm mb-4">
                      Bảo vệ tài khoản của bạn với lớp xác thực bổ sung.
                    </p>

                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">
                          Trạng thái:{" "}
                          <span className="text-red-600">Chưa kích hoạt</span>
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          Kích hoạt xác thực hai yếu tố để tăng cường bảo mật.
                        </p>
                      </div>

                      <Button variant="outline">Kích hoạt</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;

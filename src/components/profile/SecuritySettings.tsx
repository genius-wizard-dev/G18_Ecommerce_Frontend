import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";

export const SecuritySettings = () => {
  return (
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
              Để bảo mật tài khoản, bạn nên sử dụng mật khẩu mạnh và thay đổi
              định kỳ.
            </p>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Mật khẩu hiện tại</Label>
                <Input id="currentPassword" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">Mật khẩu mới</Label>
                <Input id="newPassword" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Nhập lại mật khẩu mới</Label>
                <Input id="confirmPassword" type="password" />
              </div>

              <Button>Cập nhật mật khẩu</Button>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="text-lg font-medium mb-2">Xác thực hai yếu tố</h3>
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
  );
};

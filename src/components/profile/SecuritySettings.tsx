import { useState, useEffect } from "react";
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
import { Eye, EyeOff } from "lucide-react";

import { removeAccessToken } from "@/lib/storage";
import { clearAccount } from "@/redux/slices/account";
import { logout } from "@/redux/thunks/account";
import { useAppDispatch,useAppSelector } from "@/redux/hooks";
import api from "@/lib/axios/api.service";
import { ENDPOINTS } from "@/lib/axios/endpoint";

export const SecuritySettings = () => {
  const [otpSent, setOtpSent] = useState(false);
  const [otpExpired, setOtpExpired] = useState(false);
  const [countdown, setCountdown] = useState(300);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const dispatch = useAppDispatch();
  const { account } = useAppSelector<any>((state) => state.account)
  const { profile } = useAppSelector((state) => state.profile)
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    otp: "",
  });

  const [message, setMessage] = useState("");

  useEffect(() => {
    let timer: any;
    if (otpSent && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (countdown <= 0) {
      setOtpExpired(true);
      setMessage("");
      clearInterval(timer);
    }
    return () => clearInterval(timer);
  }, [otpSent, countdown]);

  const handleSendOtp = async () => {
    if (!account?.id) return;
    try {
      const response = await api.post<any>(ENDPOINTS.AUTH.SEND_OTP_CHANGE_PASSWORD(account.id), { email: profile?.email });
      if (response.code === 1000) {
        setOtpSent(true);
        setCountdown(300);
        setOtpExpired(false);
        setMessage("Đã gửi mã OTP. Vui lòng kiểm tra email hoặc điện thoại.");
      } else {
        setMessage("Không thể gửi OTP. Vui lòng thử lại.");
      }
    } catch (error) {
      setMessage("Đã xảy ra lỗi khi gửi OTP.");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
    setConfirmPassword((prev) => (e.target.id === "confirmPassword" ? e.target.value : prev));

  };

  const isFormValid =
    formData.newPassword &&
    formData.newPassword &&
    confirmPassword &&
    formData.otp &&
    formData.newPassword === confirmPassword &&
    !otpExpired;

  const handleChangePassword = async () => {
    if (!account?.id) return;
    try {
      const response = await api.post<any>(ENDPOINTS.AUTH.CHANGE_PASSWORD(account.id), {
        ...formData,
      });

      if (response.result === true) {
        setMessage("Đổi mật khẩu thành công.");
        dispatch(logout()).then(() => {
              dispatch(clearAccount());
              removeAccessToken();
              window.location.href = "/";
            });

      } else {
        setMessage("Đổi mật khẩu thất bại. Vui lòng kiểm tra lại thông tin.");
      }
    } catch (error) {
      setMessage("Đã xảy ra lỗi khi đổi mật khẩu.");
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? "0" + s : s}`;
  };

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
              Để bảo mật tài khoản, bạn nên sử dụng mật khẩu mạnh và thay đổi định kỳ.
            </p>

            {message && <p className="text-sm text-blue-600">{message}</p>}

            {(!otpSent || otpExpired ) ? (
              <Button onClick={handleSendOtp}>Gửi OTP</Button>
            ) : (
              <div className="space-y-4 mt-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="otp">Mã OTP</Label>
                    <span className="text-sm text-gray-500">({formatTime(countdown)})</span>
                  </div>
                  <Input
                    id="otp"
                    type="text"
                    value={formData.otp}
                    onChange={handleChange}
                    disabled={otpExpired}
                  />
                  {otpExpired && (
                    <p className="text-red-500 text-sm">
                      Mã OTP đã hết hạn. Vui lòng gửi lại.
                    </p>
                  )}
                </div>

                <div className="space-y-2 relative">
                  <Label htmlFor="oldPassword">Mật khẩu hiện tại</Label>
                  <Input
                    id="oldPassword"
                    type={showCurrentPassword ? "text" : "password"}
                    value={formData.oldPassword}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword((prev) => !prev)}
                    className="absolute right-3 top-[50%] text-gray-500"
                  >
                    {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                <div className="space-y-2 relative">
                  <Label htmlFor="newPassword">Mật khẩu mới</Label>
                  <Input
                    id="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    value={formData.newPassword}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword((prev) => !prev)}
                    className="absolute right-3 top-[50%] text-gray-500"
                  >
                    {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                <div className="space-y-2 relative">
                  <Label htmlFor="confirmPassword">Nhập lại mật khẩu mới</Label>
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    className="absolute right-3 top-[50%] text-gray-500"
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>


                <Button
                  onClick={handleChangePassword}
                  disabled={!isFormValid}
                >
                  Cập nhật mật khẩu
                </Button>
              </div>
            )}
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

import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import api from "@/lib/axios/api.service";
import { ENDPOINTS } from "@/lib/axios/endpoint";
import { setAccessToken } from "@/lib/storage";
import { LoginResponse } from "@/schema/auth";

// Import schema đăng nhập từ file auth.ts
const loginSchema = z.object({
  username: z.string().min(1, "Vui lòng nhập tên đăng nhập"),
  password: z.string().min(1, "Vui lòng nhập mật khẩu"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function Login() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [rememberMe, setRememberMe] = useState(false);
  const [formErrors, setFormErrors] = useState<
    Partial<Record<keyof LoginFormValues, string>>
  >({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });

    // Xóa lỗi của trường đang nhập khi giá trị thay đổi
    if (formErrors[name as keyof LoginFormValues]) {
      setFormErrors({
        ...formErrors,
        [name]: "",
      });
    }
  };

  const handleRememberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRememberMe(e.target.checked);
  };

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    // Validate dữ liệu
    try {
      loginSchema.parse(formData);
      setFormErrors({});
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: Partial<Record<keyof LoginFormValues, string>> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            errors[err.path[0] as keyof LoginFormValues] = err.message;
          }
        });
        setFormErrors(errors);
        return;
      }
    }

    setIsLoading(true);
    try {
      console.log(formData, { rememberMe });

      const respone = await api.post<LoginResponse>(
        ENDPOINTS.AUTH.LOGIN,
        formData
      );
      if (respone.code === 1000) {
        setAccessToken(respone.result.token);
        toast.success("Đăng nhập thành công! Đang chuyển hướng...");
        // Chuyển hướng người dùng sau khi đăng nhập thành công
        setTimeout(() => {
          navigate("/");
        }, 1500);
      }
    } catch (error) {
      console.error("Đăng nhập thất bại:", error);
      toast.error("Đăng nhập thất bại! Vui lòng kiểm tra lại thông tin.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="flex w-full max-w-6xl overflow-hidden rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl">
        {/* Phần bên trái */}
        <div className="hidden w-1/2 bg-gradient-to-br from-indigo-600 to-blue-500 p-12 md:block relative overflow-hidden">
          {/* Hiệu ứng sóng */}
          <div className="absolute -bottom-10 -left-10 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>
          <div className="absolute -top-10 -right-10 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>

          <div className="flex h-full flex-col justify-between relative z-10">
            <div className="text-white">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white/20 backdrop-blur-sm transition-transform hover:scale-110">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-white"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <path d="M17.5 19H22" />
                </svg>
              </div>
            </div>

            <div className="space-y-6">
              <h1 className="text-4xl font-bold text-white animate-fadeIn">
                Chào mừng trở lại!
              </h1>
              <p className="text-white/80 animate-fadeIn animate-delay-100">
                Đăng nhập để quản lý công việc kinh doanh của bạn và kết nối với
                khách hàng.
              </p>

              <div className="rounded-lg bg-white/10 p-6 backdrop-blur-sm transition-all duration-300 hover:bg-white/20 animate-fadeIn animate-delay-200">
                <p className="text-white">
                  Nền tảng này đã giúp tôi tăng hiệu suất và doanh thu gấp đôi
                  chỉ trong vòng 3 tháng sử dụng.
                </p>
                <div className="mt-4 flex items-center space-x-3">
                  <div className="h-10 w-10 overflow-hidden rounded-full bg-white/20 ring-2 ring-white/40">
                    <img
                      src="https://randomuser.me/api/portraits/women/42.jpg"
                      alt="Avatar"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">Trần Thị B</p>
                    <p className="text-xs text-white/70">
                      Chuyên gia marketing
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-center space-x-2">
              <div className="h-2 w-2 rounded-full bg-white animate-pulse"></div>
              <div className="h-2 w-2 rounded-full bg-white/50"></div>
              <div className="h-2 w-2 rounded-full bg-white/50"></div>
            </div>
          </div>
        </div>

        {/* Phần bên phải */}
        <Card className="flex w-full flex-col justify-center rounded-none border-none shadow-none md:w-1/2">
          <CardHeader className="space-y-1 p-8">
            <CardTitle className="text-3xl font-bold text-gray-800">
              Đăng nhập
            </CardTitle>
            <CardDescription className="text-base text-gray-600">
              Nhập thông tin đăng nhập của bạn để tiếp tục
            </CardDescription>
          </CardHeader>
          <CardContent className="px-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Tên đăng nhập</Label>
                <Input
                  id="username"
                  name="username"
                  placeholder="Nhập tên đăng nhập"
                  value={formData.username}
                  onChange={handleInputChange}
                  className={`transition-all duration-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 ${
                    formErrors.username ? "border-red-500" : ""
                  }`}
                />
                {formErrors.username && (
                  <p
                    className="text-xs text-red-500 truncate"
                    title={formErrors.username}
                  >
                    {formErrors.username}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Mật khẩu</Label>
                  <a
                    href="/forgot-password"
                    className="text-xs text-indigo-600 hover:text-indigo-500 transition-colors duration-200"
                  >
                    Quên mật khẩu?
                  </a>
                </div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••••"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`transition-all duration-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 ${
                    formErrors.password ? "border-red-500" : ""
                  }`}
                />
                {formErrors.password && (
                  <p
                    className="text-xs text-red-500 truncate"
                    title={formErrors.password}
                  >
                    {formErrors.password}
                  </p>
                )}
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <input
                  type="checkbox"
                  id="remember"
                  checked={rememberMe}
                  onChange={handleRememberChange}
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="remember" className="text-sm text-gray-600">
                  Ghi nhớ đăng nhập
                </label>
              </div>

              <Button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 transition-all duration-200 transform hover:translate-y-[-2px] hover:shadow-lg text-white"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Đang xử lý...
                  </span>
                ) : (
                  "Đăng nhập"
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center p-8">
            <p className="text-sm text-muted-foreground">
              Chưa có tài khoản?{" "}
              <a
                href="/register"
                className="font-semibold text-indigo-600 hover:text-indigo-500 transition-colors duration-200"
              >
                Đăng ký ngay
              </a>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

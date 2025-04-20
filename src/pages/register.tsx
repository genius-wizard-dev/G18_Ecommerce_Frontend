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
import { RegisterResponse } from "@/schema/auth";

// Import schema đăng ký từ file auth.ts
const registerSchema = z.object({
  username: z
    .string()
    .min(6, "Tên đăng nhập phải có ít nhất 6 ký tự")
    .max(10, "Tên đăng nhập không được quá 10 ký tự")
    .regex(/^[a-zA-Z0-9]+$/, "Tên đăng nhập không được chứa ký tự đặc biệt"),
  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
  email: z.string().email("Email không hợp lệ"),
  fullName: z.string().min(1, "Vui lòng nhập họ và tên"),
  phoneNumber: z.string().regex(/^\d{10,15}$/, "Số điện thoại không hợp lệ"),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function Register() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    phoneNumber: "",
    password: "",
  });
  const [formErrors, setFormErrors] = useState<
    Partial<Record<keyof RegisterFormValues, string>>
  >({});
  const [passwordStrength, setPasswordStrength] = useState<
    "weak" | "medium" | "strong" | null
  >(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Kiểm tra username nếu đang nhập username
    if (name === "username") {
      const usernamePattern = /^[a-zA-Z0-9]+$/;

      if (value && !usernamePattern.test(value)) {
        setFormErrors({
          ...formErrors,
          username: "Tên đăng nhập không được chứa ký tự đặc biệt",
        });
      } else if (value && (value.length < 6 || value.length > 10)) {
        setFormErrors({
          ...formErrors,
          username: `Tên đăng nhập phải có từ 6-10 ký tự (hiện tại: ${value.length})`,
        });
      } else {
        // Xóa lỗi nếu hợp lệ
        const { username, ...rest } = formErrors;
        setFormErrors(rest);
      }
    }

    setFormData({
      ...formData,
      [name]: value,
    });

    // Xóa lỗi của trường đang nhập khi giá trị thay đổi (trừ username đã xử lý riêng)
    if (name !== "username" && formErrors[name as keyof RegisterFormValues]) {
      setFormErrors({
        ...formErrors,
        [name]: "",
      });
    }

    // Kiểm tra độ mạnh mật khẩu nếu đang nhập mật khẩu
    if (name === "password") {
      checkPasswordStrength(value);
    }
  };

  const checkPasswordStrength = (password: string) => {
    if (
      password.length >= 8 &&
      /[A-Z]/.test(password) &&
      /[0-9]/.test(password) &&
      /[^A-Za-z0-9]/.test(password)
    ) {
      setPasswordStrength("strong");
    } else if (
      password.length >= 6 &&
      (/[A-Z]/.test(password) || /[0-9]/.test(password))
    ) {
      setPasswordStrength("medium");
    } else if (password.length > 0) {
      setPasswordStrength("weak");
    } else {
      setPasswordStrength(null);
    }
  };

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      registerSchema.parse(formData);
      setFormErrors({});
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: Partial<Record<keyof RegisterFormValues, string>> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            errors[err.path[0] as keyof RegisterFormValues] = err.message;
          }
        });
        setFormErrors(errors);
        return;
      }
    }

    setIsLoading(true);
    try {
      console.log(formData);
      const result = await api.post<
        RegisterResponse | { code: number; result: object }
      >(ENDPOINTS.AUTH.REGISTER, formData);
      if ("code" in result) {
        if (result.code === 1015) {
          const errorMessages = Object.values(result.result).join(", ");
          toast.error(`Đăng ký thất bại: ${errorMessages}`);
          return;
        } else {
          toast.success("Đăng ký thành công! Đang chuyển hướng...");
        }
      }

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error) {
      console.error("Đăng ký thất bại:", error);
      toast.error("Đăng ký thất bại! Vui lòng thử lại sau.");
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
                Chúng tôi giúp bạn kinh doanh tự do.
              </h1>
              <p className="text-white/80 animate-fadeIn animate-delay-100">
                Quy trình đăng ký của chúng tôi nhanh chóng và dễ dàng, chỉ mất
                không quá 5 phút để hoàn thành.
              </p>

              <div className="rounded-lg bg-white/10 p-6 backdrop-blur-sm transition-all duration-300 hover:bg-white/20 animate-fadeIn animate-delay-200">
                <p className="text-white">
                  Tôi ấn tượng với kết quả kể từ khi bắt đầu sử dụng nền tảng
                  thương mại điện tử này, doanh số bán hàng của tôi tăng đáng kể
                  chỉ trong tuần đầu tiên.
                </p>
                <div className="mt-4 flex items-center space-x-3">
                  <div className="h-10 w-10 overflow-hidden rounded-full bg-white/20 ring-2 ring-white/40">
                    <img
                      src="https://randomuser.me/api/portraits/men/42.jpg"
                      alt="Avatar"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">
                      Nguyễn Văn A
                    </p>
                    <p className="text-xs text-white/70">
                      Chủ cửa hàng trực tuyến
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
              Bắt đầu
            </CardTitle>
            <CardDescription className="text-base text-gray-600">
              Tạo tài khoản của bạn ngay bây giờ
            </CardDescription>
          </CardHeader>
          <CardContent className="px-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Họ và tên</Label>
                <Input
                  id="fullName"
                  name="fullName"
                  placeholder="Nhập họ và tên"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className={`transition-all duration-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 ${
                    formErrors.fullName ? "border-red-500" : ""
                  }`}
                />
                {formErrors.fullName && (
                  <p
                    className="text-xs text-red-500 truncate"
                    title={formErrors.fullName}
                  >
                    {formErrors.fullName}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Tên đăng nhập (6-10 ký tự)</Label>
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
                  <Label htmlFor="phoneNumber">Số điện thoại</Label>
                  <Input
                    id="phoneNumber"
                    name="phoneNumber"
                    placeholder="Nhập số điện thoại"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    className={`transition-all duration-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 ${
                      formErrors.phoneNumber ? "border-red-500" : ""
                    }`}
                  />
                  {formErrors.phoneNumber && (
                    <p
                      className="text-xs text-red-500 truncate"
                      title={formErrors.phoneNumber}
                    >
                      {formErrors.phoneNumber}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="example@email.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`transition-all duration-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 ${
                    formErrors.email ? "border-red-500" : ""
                  }`}
                />
                {formErrors.email && (
                  <p
                    className="text-xs text-red-500 truncate"
                    title={formErrors.email}
                  >
                    {formErrors.email}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="password">Mật khẩu</Label>
                  {passwordStrength && (
                    <span
                      className={
                        passwordStrength === "strong"
                          ? "text-green-500 font-medium"
                          : passwordStrength === "medium"
                          ? "text-yellow-500 font-medium"
                          : "text-red-500 font-medium"
                      }
                    >
                      {passwordStrength === "strong"
                        ? "Mạnh!"
                        : passwordStrength === "medium"
                        ? "Trung bình"
                        : "Yếu"}
                    </span>
                  )}
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
                  "Đăng ký"
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center p-8 ">
            <p className="text-sm text-muted-foreground">
              Đã có tài khoản?{" "}
              <a
                href="/login"
                className="font-semibold text-indigo-600 hover:text-indigo-500 transition-colors duration-200"
              >
                Đăng nhập
              </a>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

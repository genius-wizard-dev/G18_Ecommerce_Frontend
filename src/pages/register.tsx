import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import api from "@/lib/axios/api.service";
import { ENDPOINTS } from "@/lib/axios/endpoint";
import {
  RegisterErrorResponse,
  RegisterPayload,
  RegisterPayloadSchema,
  RegisterResponse,
} from "@/schema/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { gsap } from "gsap";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FiLock, FiMail, FiPhone, FiUser } from "react-icons/fi";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const form = useForm<RegisterPayload>({
    resolver: zodResolver(RegisterPayloadSchema),
    defaultValues: {
      username: "",
      password: "",
      email: "",
      fullName: "",
      phoneNumber: "",
    },
    mode: "onChange", // Enable validation on change for better feedback
  });

  useEffect(() => {
    // Hide elements initially to prevent flash on page load
    gsap.set(".register-card", { opacity: 0, y: 30 });
    gsap.set(".form-element", { opacity: 0, y: 20 });

    // Small delay to ensure DOM is ready
    const timeline = gsap.timeline({
      defaults: { ease: "power3.out" },
      delay: 0.1,
    });

    // Card entrance animation
    timeline.to(".register-card", {
      y: 0,
      opacity: 1,
      duration: 0.8,
      clearProps: "transform", // Clean up transform after animation
    });

    // Form elements staggered animation
    timeline.to(
      ".form-element",
      {
        y: 0,
        opacity: 1,
        stagger: 0.1,
        duration: 0.5,
        clearProps: "all", // Clean up GSAP properties after animation
      },
      "-=0.4"
    );

    // Clean up function
    return () => {
      timeline.kill();
    };
  }, []);

  const onSubmit = async (data: RegisterPayload) => {
    try {
      await api.post<RegisterResponse>(ENDPOINTS.AUTH.REGISTER, data);

      toast.success("Đăng ký thành công", {
        description: "Bạn có thể đăng nhập bằng thông tin tài khoản vừa tạo",
      });
      navigate("/login");
    } catch (error: any) {
      console.error("Lỗi đăng ký:", error);
      let errorMessage = "Đăng ký không thành công. Vui lòng thử lại sau";
      if (error.response?.data) {
        const errorData: RegisterErrorResponse = error.response.data;
        const result = errorData.result;
        if (result.email) errorMessage = result.email;
        else if (result.username) errorMessage = result.username;
        else if (result.phoneNumber) errorMessage = result.phoneNumber;
      }

      toast.error(errorMessage);
    }
  };

  return (
    <div className="register-card w-full max-w-xl bg-white rounded-xl shadow-xl overflow-hidden">
      <div className="p-6 sm:p-10">
        <Link to="/" className="flex justify-center mb-4 sm:mb-6 form-element">
          <img
            src="/G18_Logo.png"
            alt="G18 Logo"
            className="w-16 h-16 sm:w-20 sm:h-20"
          />
        </Link>

        <div className="text-center mb-4 sm:mb-6 form-element">
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent">
            Create Account
          </h1>
          <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-gray-700">
            Please fill in the information below to register
          </p>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-2 sm:space-y-2"
          >
            {/* Full name field */}
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem className="form-element">
                  <div className="relative">
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Full Name"
                        className="pl-10 h-10 sm:h-12 border border-gray-300 rounded-lg focus-visible:ring-orange-500 text-gray-900 placeholder:text-gray-500"
                        {...field}
                      />
                    </FormControl>
                    <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  </div>
                  <div className="h-3 sm:h-4 mt-0.5">
                    <FormMessage className="text-red-500 text-xs font-medium" />
                  </div>
                </FormItem>
              )}
            />

            {/* Email field */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="form-element">
                  <div className="relative">
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Email"
                        className="pl-10 h-10 sm:h-12 border border-gray-300 rounded-lg focus-visible:ring-orange-500 text-gray-900 placeholder:text-gray-500"
                        {...field}
                      />
                    </FormControl>
                    <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  </div>
                  <div className="h-3 sm:h-4 mt-0.5">
                    <FormMessage className="text-red-500 text-xs font-medium" />
                  </div>
                </FormItem>
              )}
            />

            {/* Username and Phone Number in a one-column layout on mobile, two-column on desktop */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 form-element">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <div className="relative">
                      <FormControl>
                        <Input
                          placeholder="Username"
                          className="pl-10 h-10 sm:h-12 border border-gray-300 rounded-lg focus-visible:ring-orange-500 text-gray-900 placeholder:text-gray-500"
                          {...field}
                        />
                      </FormControl>
                      <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                    </div>
                    <div className="h-3 sm:h-4 mt-0.5">
                      <FormMessage className="text-red-500 text-xs font-medium" />
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <div className="relative">
                      <FormControl>
                        <Input
                          placeholder="Phone Number"
                          className="pl-10 h-10 sm:h-12 border border-gray-300 rounded-lg focus-visible:ring-orange-500 text-gray-900 placeholder:text-gray-500"
                          {...field}
                        />
                      </FormControl>
                      <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                    </div>
                    <div className="h-3 sm:h-4 mt-0.5">
                      <FormMessage className="text-red-500 text-xs font-medium" />
                    </div>
                  </FormItem>
                )}
              />
            </div>

            {/* Password field */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="form-element">
                  <div className="relative">
                    <FormControl>
                      <Input
                        placeholder="Password"
                        type={showPassword ? "text" : "password"}
                        className="pl-10 pr-10 h-10 sm:h-12 border border-gray-300 rounded-lg focus-visible:ring-orange-500 text-gray-900 placeholder:text-gray-500"
                        {...field}
                      />
                    </FormControl>
                    <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800 text-xl"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? <IoEyeOffOutline /> : <IoEyeOutline />}
                    </button>
                  </div>
                  <div className="h-3 sm:h-4 mt-0.5">
                    <FormMessage className="text-red-500 text-xs font-medium" />
                  </div>
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="form-element w-full h-10 sm:h-12 mt-2 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-medium rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
            >
              Register
            </Button>

            <div className="mt-3 sm:mt-4 text-center text-xs sm:text-sm form-element">
              <span className="text-gray-700">Already have an account? </span>
              <Link
                to="/login"
                className="font-medium text-orange-600 hover:text-orange-500"
              >
                Login
              </Link>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default Register;

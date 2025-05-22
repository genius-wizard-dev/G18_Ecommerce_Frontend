import { zodResolver } from "@hookform/resolvers/zod";
import { gsap } from "gsap";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

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
import { LoginPayload, LoginPayloadSchema, LoginResponse } from "@/schema/auth";

import { setAccessToken } from "@/lib/storage";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { getAccountInfo } from "@/redux/thunks/account";
import { FaRegCircleUser } from "react-icons/fa6";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import { MdOutlineLock } from "react-icons/md";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useAppDispatch();
  const { isLoading } = useAppSelector((state) => state.account);

  const form = useForm<LoginPayload>({
    resolver: zodResolver(LoginPayloadSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  useEffect(() => {
    // Hide elements initially to prevent flash on page load
    gsap.set(".login-card", { opacity: 0, y: 30 });
    gsap.set(".form-element", { opacity: 0, y: 20 });

    // Small delay to ensure DOM is ready
    const timeline = gsap.timeline({
      defaults: { ease: "power3.out" },
      delay: 0.1,
    });

    // Card entrance animation
    timeline.to(".login-card", {
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
    ); // Start slightly before the previous animation ends

    return () => {
      timeline.kill();
    };
  }, []);

  const onSubmit = async (data: LoginPayload) => {
    try {
      const response = await api.post<LoginResponse>(
        ENDPOINTS.AUTH.LOGIN,
        data
      );

      if ("result" in response) {
        const { token } = response.result;
        setAccessToken(token);

        try {
          await dispatch(getAccountInfo()).unwrap();
          toast.success("Đăng nhập thành công");
          window.location.href = "/";
        } catch (infoError) {
          toast.error(
            "Đăng nhập thành công, nhưng không thể tải thông tin tài khoản"
          );
          console.error("Error fetching account info:", infoError);
        }
      }
    } catch (error: any) {
      let errorMessage = "Đăng nhập thất bại. Vui lòng thử lại sau";
      if (error.response?.data) {
        const errorData: LoginResponse = error.response.data;

        if ("message" in errorData) {
          if (errorData.message === "User not existed")
            errorMessage = "Thông tin đăng nhập không tồn tại";
          else if (errorData.message === "Unauthenticated")
            errorMessage = "Sai mật khẩu";
        }

        toast.error(errorMessage);
      }
    }
  };

  return (
    <div className="login-card w-full max-w-md bg-white rounded-xl shadow-xl overflow-hidden">
      <div className="p-6 sm:p-10">
        <Link to="/" className="flex justify-center mb-6 form-element">
          <img
            src="/G18_Logo.png"
            alt="G18 Logo"
            className="w-16 h-16 sm:w-20 sm:h-20"
          />
        </Link>

        <div className="text-center mb-6 sm:mb-8 form-element">
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent">
            Welcome Back
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-gray-700">
            Please enter your credentials to access your account
          </p>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 sm:space-y-5"
          >
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem className="form-element">
                  <div className="relative">
                    <FormControl>
                      <Input
                        placeholder="Username"
                        className="pl-10 h-10 sm:h-12 border border-gray-300 rounded-lg focus-visible:ring-orange-500 text-xl text-gray-900 placeholder:text-gray-500"
                        {...field}
                      />
                    </FormControl>
                    <FaRegCircleUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  </div>
                  <FormMessage className="text-red-500 text-xs font-medium mt-1" />
                </FormItem>
              )}
            />

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
                        className="pl-10 pr-10 h-10 sm:h-12 border border-gray-300 rounded-lg focus-visible:ring-orange-500 text-xl text-gray-900 placeholder:text-gray-500"
                        {...field}
                      />
                    </FormControl>
                    <MdOutlineLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
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
                  <FormMessage className="text-red-500 text-xs font-medium mt-1" />
                </FormItem>
              )}
            />

            <div className="flex justify-end items-center form-element">
              <div className="text-xs sm:text-sm">
                <a
                  href="#"
                  className="font-medium text-orange-600 hover:text-orange-500"
                >
                  Forgot password?
                </a>
              </div>
            </div>

            <Button
              type="submit"
              className="form-element w-full h-10 sm:h-12 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-medium rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  <span>Pending...</span>
                </div>
              ) : (
                "Login"
              )}
            </Button>

            <div className="mt-4 sm:mt-6 text-center text-xs sm:text-sm form-element">
              <span className="text-gray-700">Don't have an account? </span>
              <Link
                to="/register"
                className="font-medium text-orange-600 hover:text-orange-500"
              >
                Register
              </Link>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default Login;

"use client"
import { useState } from "react";
import { useAppSelector } from "@/redux/hooks";
import api from "@/lib/axios/api.service";
import { ENDPOINTS } from "@/lib/axios/endpoint";
import { toast } from "sonner";

export default function RegisterShop() {
  const [shopName, setShopName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { profile } = useAppSelector((state) => state.profile)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const name = shopName.trim();
    const shopNameRegex = /^[a-zA-Z0-9_\-\s]{1,10}$/;

    if (!name) {
      toast.error("Tên shop không được để trống");
      return;
    }

    if (!shopNameRegex.test(name)) {
      toast.error("Tên shop chỉ được chứa chữ, số, khoảng trắng và tối đa 10 ký tự");
      return;
    }

    if (!profile?.id) {
      toast.error("Không tìm thấy thông tin người dùng");
      return;
    }


    try {
      setIsLoading(true);
      const { result } = await api.put<any>(ENDPOINTS.PROFILE.REGISTER_SHOP(profile.id), {
        shopName: shopName.trim()
      });
      if (result.code !== 1000) toast.success("Đăng ký shop thành công!");
      setShopName("");
      window.location.href = "/";
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Đăng ký shop thất bại");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white w-full py-20 px-4 flex justify-center relative">
      <div className="relative w-full max-w-xl p-10 rounded-2xl bg-white border border-black/10 shadow-[0_0_40px_rgba(0,0,0,0.08)] hover:shadow-[0_0_160px_rgba(0,0,0,0.15)] transition-all duration-500 group scale-105 hover:scale-100">
        {/* Góc sáng */}
        <div className="absolute top-0 left-0 w-10 h-10 bg-black group-hover:w-5 group-hover:h-5 transition-all duration-300 rounded-br-lg" />
        <div className="absolute bottom-0 right-0 w-10 h-10 bg-black group-hover:w-5 group-hover:h-5 transition-all duration-300 rounded-tl-lg" />

        <h2 className="text-3xl font-extrabold text-black text-center uppercase tracking-wider mb-8">
          Đăng ký shop
        </h2>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="shopName" className="block text-black font-semibold mb-2">
              Tên Shop
            </label>
            <input
              id="shopName"
              type="text"
              value={shopName}
              onChange={(e) => setShopName(e.target.value)}
              placeholder="VD: The Shadow Room"
              className="w-full px-4 py-3 rounded-md bg-white border border-black/20 text-black placeholder-black/40 focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 font-bold rounded-md tracking-wide uppercase border transition-all duration-300 ${isLoading
              ? "bg-gray-400 text-white cursor-not-allowed"
              : "bg-black text-white hover:bg-white hover:text-black hover:border-black"
              }`}
          >
            {isLoading ? "Đang đăng ký..." : "Đăng ký shop"}
          </button>
        </form>
      </div>
    </div>
  );
}

import NotFound from "@/components/ui/NotFound";
import { useAppSelector } from "@/redux/hooks";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import CouponManagement from "./MenuDashboard/CouponManagement";
import ProductManagement from "./MenuDashboard/ProductManagement";
import Sidebar from "./MenuDashboard/Sidebar";

const Dashboard: React.FC = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<"products" | "coupons">(
    location.hash === "#coupons" ? "coupons" : "products"
  );
  const { profile } = useAppSelector((state) => state.profile);

  useEffect(() => {
    setActiveTab(location.hash === "#coupons" ? "coupons" : "products");
  }, [location.hash]);

  if (profile?.isShop === false) {
    return <NotFound message="Bạn không có quyền truy cập vào trang này" />;
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-1 p-10">
        {activeTab === "products" && <ProductManagement />}
        {activeTab === "coupons" && <CouponManagement />}
      </div>
    </div>
  );
};

export default Dashboard;

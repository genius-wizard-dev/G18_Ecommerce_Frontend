import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from './MenuDashboard/Sidebar';
import ProductManagement from './MenuDashboard/ProductManagement';
import CouponManagement from './MenuDashboard/CouponManagement';

const Dashboard: React.FC = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<'products' | 'coupons'>(
    location.hash === '#coupons' ? 'coupons' : 'products'
  );

  useEffect(() => {
    setActiveTab(location.hash === '#coupons' ? 'coupons' : 'products');
  }, [location.hash]);

  return (
    <div className="flex h-screen">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-1 p-10 overflow-auto bg-gray-100">
        {activeTab === 'products' && <ProductManagement />}
        {activeTab === 'coupons' && <CouponManagement />}
      </div>
    </div>
  );
};

export default Dashboard;
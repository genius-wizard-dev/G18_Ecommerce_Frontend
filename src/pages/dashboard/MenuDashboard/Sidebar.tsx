import React from 'react';
import { Link } from 'react-router-dom';

interface SidebarProps {
  activeTab: 'products' | 'coupons';
  setActiveTab: (tab: 'products' | 'coupons') => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  return (
    <div className="w-64 bg-gray-800 text-white p-6">
      <h1 className="text-2xl font-bold mb-10">Dashboard</h1>
      <nav>
        <ul>
          <li>
            <Link
              to="#products"
              onClick={() => setActiveTab('products')}
              className={`block py-2 px-4 rounded ${
                activeTab === 'products' ? 'bg-gray-700' : 'hover:bg-gray-700'
              }`}
            >
              Quản lý sản phẩm
            </Link>
          </li>
          <li>
            <Link
              to="#coupons"
              onClick={() => setActiveTab('coupons')}
              className={`block py-2 px-4 rounded ${
                activeTab === 'coupons' ? 'bg-gray-700' : 'hover:bg-gray-700'
              }`}
            >
              Quản lý phiếu giảm giá
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
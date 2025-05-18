import React, { useState, useEffect } from 'react';
import { Coupon } from '@/components/home/Coupon';

const CouponManagement: React.FC = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [code, setCode] = useState('');
  const [discount, setDiscount] = useState('');
  const [editId, setEditId] = useState<number | null>(null);

  // Load coupons from localStorage
  useEffect(() => {
    const savedCoupons = localStorage.getItem('coupons');
    if (savedCoupons) {
      setCoupons(JSON.parse(savedCoupons));
    }
  }, []);

  // Save coupons to localStorage
  useEffect(() => {
    localStorage.setItem('coupons', JSON.stringify(coupons));
  }, [coupons]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editId !== null) {
      setCoupons(
        coupons.map((coupon) =>
          coupon.id === editId
            ? { ...coupon, code, discount: Number(discount) }
            : coupon
        )
      );
      setEditId(null);
    } else {
      const newCoupon: Coupon = {
        id: Date.now(),
        code,
        discount: Number(discount),
      };
      setCoupons([...coupons, newCoupon]);
    }
    setCode('');
    setDiscount('');
  };

  const handleEdit = (coupon: Coupon) => {
    setCode(coupon.code);
    setDiscount(coupon.discount.toString());
    setEditId(coupon.id);
  };

  const handleDelete = (id: number) => {
    setCoupons(coupons.filter((coupon) => coupon.id !== id));
  };

  return (
    <section id="coupons">
      <h2 className="text-2xl font-semibold mb-6">Quản lý phiếu giảm giá</h2>

      {/* Add/Edit Coupon Form */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h3 className="text-lg font-medium mb-4">
          {editId !== null ? 'Sửa phiếu giảm giá' : 'Thêm phiếu giảm giá'}
        </h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium">Mã giảm giá</label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium">Phần trăm giảm</label>
            <input
              type="number"
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            {editId !== null ? 'Cập nhật' : 'Thêm'}
          </button>
        </form>
      </div>

      {/* Coupon List */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-medium mb-4">Danh sách phiếu giảm giá</h3>
        <table className="w-full">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 text-left">Mã</th>
              <th className="p-2 text-left">Phần trăm giảm</th>
              <th className="p-2 text-left">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {coupons.map((coupon) => (
              <tr key={coupon.id}>
                <td className="p-2">{coupon.code}</td>
                <td className="p-包装2">{coupon.discount}%</td>
                <td className="p-2">
                  <button
                    onClick={() => handleEdit(coupon)}
                    className="text-blue-500 mr-2"
                  >
                    Sửa
                  </button>
                  <button
                    onClick={() => handleDelete(coupon.id)}
                    className="text-red-500"
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default CouponManagement;
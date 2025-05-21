import React, { useMemo, useState } from "react";
import {
    PieChart, Pie, Cell, Tooltip, ResponsiveContainer
} from "recharts";
import dayjs from "dayjs";

const listProduct = [
  { id: "1", name: "Dây 2 Lớp", price: 50000 },
  { id: "2", name: "Bi Thép 8mm", price: 100000 },
  { id: "3", name: "Slingshot Pro", price: 250000 },
  { id: "4", name: "Găng tay da", price: 150000 },
  { id: "5", name: "Kính bảo hộ", price: 80000 },
  { id: "6", name: "Mũ bảo hiểm", price: 200000 },
  { id: "7", name: "Đèn pin", price: 120000 },
  { id: "8", name: "Dây cáp thép", price: 75000 },
  { id: "9", name: "Mắt kính thể thao", price: 130000 },
  { id: "10", name: "Găng tay chống cắt", price: 90000 },
  { id: "11", name: "Balo thể thao", price: 300000 },
  { id: "12", name: "Áo mưa", price: 60000 },
  { id: "13", name: "Giày bảo hộ", price: 350000 },
  { id: "14", name: "Mặt nạ phòng độc", price: 180000 },
  { id: "15", name: "Dây neo", price: 110000 },
  { id: "16", name: "Băng keo điện", price: 25000 },
  { id: "17", name: "Dụng cụ đa năng", price: 450000 },
  { id: "18", name: "Bộ dụng cụ sửa chữa", price: 550000 },
  { id: "19", name: "Kìm cắt", price: 140000 },
  { id: "20", name: "Thang nhôm", price: 400000 },
];

const invoices = [
  {
    id: "inv001",
    date: "2025-05-01",
    details: [
      { productId: "1", quantity: 2 },
      { productId: "3", quantity: 1 },
      { productId: "11", quantity: 1 },
    ],
  },
  {
    id: "inv002",
    date: "2025-05-03",
    details: [
      { productId: "2", quantity: 5 },
      { productId: "6", quantity: 2 },
    ],
  },
  {
    id: "inv003",
    date: "2025-04-21",
    details: [
      { productId: "1", quantity: 3 },
      { productId: "2", quantity: 1 },
      { productId: "15", quantity: 2 },
    ],
  },
  {
    id: "inv004",
    date: "2025-05-10",
    details: [
      { productId: "4", quantity: 2 },
      { productId: "5", quantity: 4 },
      { productId: "7", quantity: 3 },
    ],
  },
  {
    id: "inv005",
    date: "2025-05-21",
    details: [
      { productId: "6", quantity: 1 },
      { productId: "2", quantity: 2 },
      { productId: "18", quantity: 1 },
    ],
  },
  {
    id: "inv006",
    date: "2025-05-21",
    details: [
      { productId: "3", quantity: 2 },
      { productId: "4", quantity: 1 },
      { productId: "9", quantity: 5 },
    ],
  },
  {
    id: "inv007",
    date: "2025-03-15",
    details: [
      { productId: "5", quantity: 5 },
      { productId: "6", quantity: 2 },
      { productId: "12", quantity: 3 },
    ],
  },
  {
    id: "inv008",
    date: "2025-05-20",
    details: [
      { productId: "10", quantity: 4 },
      { productId: "13", quantity: 1 },
      { productId: "14", quantity: 1 },
    ],
  },
  {
    id: "inv009",
    date: "2025-05-22",
    details: [
      { productId: "15", quantity: 3 },
      { productId: "16", quantity: 10 },
      { productId: "17", quantity: 2 },
    ],
  },
  {
    id: "inv010",
    date: "2025-05-23",
    details: [
      { productId: "19", quantity: 3 },
      { productId: "20", quantity: 1 },
      { productId: "1", quantity: 2 },
    ],
  },
];



const ProductStats: React.FC = () => {
  type FilterType = "day" | "month" | "year";
  type ModeType = "revenue" | "quantity";
  type SortType = "asc" | "desc";

  const [filterType, setFilterType] = useState<FilterType>("day");
  const [mode, setMode] = useState<ModeType>("revenue");
  const [sortType, setSortType] = useState<SortType>("desc"); // mới: tăng dần/giảm dần

  const colors = useMemo(() => {
    const colorMap: Record<string, string> = {};
    listProduct.forEach((p) => {
      colorMap[p.name] = "#" + Math.floor(Math.random() * 16777215).toString(16);
    });
    return colorMap;
  }, []);

  const pieStats = useMemo(() => {
    const totals: Record<string, number> = {};
    const now = dayjs();

    for (const invoice of invoices) {
      const date = dayjs(invoice.date);

      const isMatch =
        filterType === "day"
          ? date.isSame(now, "day")
          : filterType === "month"
          ? date.isSame(now, "month")
          : date.isSame(now, "year");

      if (!isMatch) continue;

      for (const detail of invoice.details) {
        const product = listProduct.find((p) => p.id === detail.productId);
        if (!product) continue;

        if (!totals[product.name]) totals[product.name] = 0;

        totals[product.name] +=
          mode === "revenue" ? product.price * detail.quantity : detail.quantity;
      }
    }

    const arr = Object.entries(totals).map(([name, value]) => ({
      name,
      value,
    }));

    // Sắp xếp theo sortType
    arr.sort((a, b) => (sortType === "asc" ? a.value - b.value : b.value - a.value));

    return arr;
  }, [mode, filterType, sortType]);

  return (
    <div className="p-6 bg-white rounded-xl shadow">
      <h2 className="text-xl font-bold mb-4 text-red-500">📊 Thống Kê Sản Phẩm</h2>

      <div className="flex flex-wrap gap-4 mb-6">
        <div>
          <label className="mr-2 font-medium">Kiểu thống kê:</label>
          <select
            className="border px-3 py-2 rounded"
            value={mode}
            onChange={(e) => setMode(e.target.value as ModeType)}
          >
            <option value="revenue">Doanh thu (₫)</option>
            <option value="quantity">Số lượng bán ra</option>
          </select>
        </div>

        <div>
          <label className="mr-2 font-medium">Xem theo:</label>
          <select
            className="border px-3 py-2 rounded"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as FilterType)}
          >
            <option value="day">Ngày</option>
            <option value="month">Tháng</option>
            <option value="year">Năm</option>
          </select>
        </div>

        {/* Chọn kiểu sắp xếp */}
        <div>
          <label className="mr-2 font-medium">Sắp xếp:</label>
          <select
            className="border px-3 py-2 rounded"
            value={sortType}
            onChange={(e) => setSortType(e.target.value as SortType)}
          >
            <option value="desc">Giảm dần</option>
            <option value="asc">Tăng dần</option>
          </select>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-3">
          🥧 Thống kê theo{" "}
          {filterType === "day" ? "ngày" : filterType === "month" ? "tháng" : "năm"}
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Phần danh sách cuộn */}
          <div
            className="overflow-y-auto border rounded p-3"
            style={{ maxHeight: "400px" }}
          >
            <ul className="space-y-2">
              {pieStats.map((item) => (
                <li
                  key={item.name}
                  className="flex items-center justify-between border-b pb-1"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="inline-block w-4 h-4 rounded-full"
                      style={{ backgroundColor: colors[item.name] }}
                    ></span>
                    <span>{item.name}</span>
                  </div>
                  <span className="font-medium text-blue-600">
                    {mode === "revenue"
                      ? item.value.toLocaleString("vi-VN") + "₫"
                      : item.value}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieStats}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={100}
                  label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                >
                  {pieStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors[entry.name]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) =>
                    mode === "revenue"
                      ? value.toLocaleString("vi-VN") + "₫"
                      : value
                  }
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductStats;

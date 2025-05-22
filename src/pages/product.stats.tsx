import React, { useEffect, useMemo, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { getRevenueByShop } from "@/redux/thunks/order";
import { GetRevenueOrderInput, RevenueOrderInput, RevenueOrderListResponse } from "@/schema/order";
import { ENDPOINTS } from "@/lib/axios/endpoint";
import { ProductInput, ProductResponse } from "@/schema/product";
import api from "@/lib/axios/api.service";

const ProductStats: React.FC = () => {
    type FilterType = "day" | "month" | "year";
    type ModeType = "revenue" | "quantity";

    interface ProductRevenue {
        productId: string;
        name: string;
        revenue: number;
        quantity: number;
    }
    const dispatch = useAppDispatch();
    const { profile } = useAppSelector((state) => state.profile);
    const [filterType, setFilterType] = useState<FilterType>("day");
    const [mode, setMode] = useState<ModeType>("revenue");
    const [listProduct, setListProduct] = useState<ProductRevenue[]>([]);
    console.log(filterType);

    useEffect(() => {
        if (profile && profile.shopId) {
            const getRevenueOrderInput: GetRevenueOrderInput = {
                shopId: profile.shopId,
                type: filterType
            };

            dispatch(getRevenueByShop(getRevenueOrderInput)).then((data) => {
                const payload = data.payload as RevenueOrderListResponse;
                const revenueOrderList: RevenueOrderInput[] = payload.data;
                const paramsQuantity: any = {};
                const paramsRevenue: any = {};

                Promise.allSettled(
                    revenueOrderList.map((revenueOrderItem: RevenueOrderInput) => {
                        paramsQuantity[revenueOrderItem.productId] = revenueOrderItem.quantity;
                        paramsRevenue[revenueOrderItem.productId] = revenueOrderItem.revenue;
                        return api.get<ProductResponse>(ENDPOINTS.PRODUCT.GET_BY_ID(revenueOrderItem.productId));
                    })
                ).then((data) => {
                    setListProduct(
                        data.reduce((arr: any, res) => {
                            const status = res.status;

                            if (status === "fulfilled") {
                                const product = res.value.data as ProductInput;

                                return [
                                    ...arr,
                                    {
                                        productId: product._id,
                                        name: product.name,
                                        revenue: paramsRevenue[product._id],
                                        quantity: paramsQuantity[product._id]
                                    }
                                ];
                            }

                            return arr;
                        }, [])
                    );
                });
            });
        }
    }, [filterType, profile]);

    const colors = useMemo(() => {
        const colorMap: Record<string, string> = {};
        listProduct.forEach((p) => {
            colorMap[p.name] = "#" + Math.floor(Math.random() * 16777215).toString(16);
        });
        return colorMap;
    }, [listProduct]);

    const pieStats = useMemo(() => {
        return listProduct.map((product) => ({
            name: product.name,
            value: mode === "revenue" ? product.revenue : product.quantity
        }));
    }, [mode, filterType, listProduct]);

    return (
        <div className="bg-white rounded-xl">
            <h2 className="text-xl font-bold mb-8 text-red-500">📊 Thống Kê Sản Phẩm</h2>

            <div className="flex flex-wrap gap-4 mb-6">
                <div>
                    <label className="mr-2 font-medium">Kiểu thống kê:</label>
                    <select
                        className="border px-3 py-1 rounded"
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
                        className="border px-3 py-1 rounded"
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value as FilterType)}
                    >
                        <option value="day">Ngày</option>
                        <option value="month">Tháng</option>
                        <option value="year">Năm</option>
                    </select>
                </div>
            </div>

            <div>
                <h3 className="text-lg font-semibold mb-3">
                    Thống kê theo {filterType === "day" ? "ngày" : filterType === "month" ? "tháng" : "năm"}
                </h3>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Phần danh sách cuộn */}
                    <div className="overflow-y-auto border rounded p-3" style={{ maxHeight: "400px" }}>
                        <ul className="space-y-2">
                            {listProduct.map((item) => (
                                <li key={item.name} className="flex items-center justify-between border-b pb-1">
                                    <div className="flex items-center gap-2">
                                        <span
                                            className="inline-block w-4 h-4 rounded-full"
                                            style={{ backgroundColor: colors[item.name] }}
                                        ></span>
                                        <span>{item.name}</span>
                                    </div>
                                    <span className="font-medium text-blue-600">
                                        {mode === "revenue"
                                            ? item.revenue.toLocaleString("vi-VN") + "₫"
                                            : item.quantity}
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
                                        mode === "revenue" ? value.toLocaleString("vi-VN") + "₫" : value
                                    }
                                />
                            </PieChart>
                        </ResponsiveContainer>
                        <h3 className="font-semibold text-center">Biểu đồ doanh thu</h3>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductStats;

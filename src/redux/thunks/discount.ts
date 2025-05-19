import api from "@/lib/axios/api.service";
import { ENDPOINTS } from "@/lib/axios/endpoint";
import { ApplyDiscountInput, DicountResponse, Discount } from "@/schema/discount";

import { createAsyncThunk } from "@reduxjs/toolkit";
import { getCart } from "./cart";

export const getDiscountsByShop = createAsyncThunk(
    "cart/getDiscountsByShop",
    async (shopIdList: string[], { rejectWithValue }) => {
        try {
            if (shopIdList.length === 0) return;

            const result = await Promise.allSettled(
                shopIdList.map((shopId) => api.get<DicountResponse>(ENDPOINTS.DISCOUNT.GET_DISCOUNTS_BY_SHOP(shopId)))
            );

            return result.reduce((arr: any, res) => {
                const status = res.status;

                if (status === "fulfilled") {
                    const discountList = res.value.data as Discount[];
                    return [...arr, ...discountList];
                }

                return arr;
            }, []);
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch products");
        }
    }
);

export const applyDiscount = createAsyncThunk(
    "cart/applyDiscount",
    async (applyDiscountInput: ApplyDiscountInput, { dispatch, rejectWithValue }) => {
        try {
            const { userId, discountId, cartId, productIdList } = applyDiscountInput;
            const res = await api.post<DicountResponse>(ENDPOINTS.DISCOUNT.APPLY_DISCOUNT, {
                discountId,
                cartId,
                productIdList
            });

            console.log(res);

            dispatch(getCart(userId));

            return res;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch products");
        }
    }
);

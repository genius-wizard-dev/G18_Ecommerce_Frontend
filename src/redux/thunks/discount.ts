import api from "@/lib/axios/api.service";
import { ENDPOINTS } from "@/lib/axios/endpoint";
import {
    ApplyDiscountInput,
    CreateDiscountInput,
    DeleteDiscountInput,
    DeleteDiscountResponse,
    DicountResponse,
    Discount,
    UpdateDiscountInput
} from "@/schema/discount";

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
    async (
        { applyDiscountInput, shopList }: { applyDiscountInput: ApplyDiscountInput; shopList: string[] },
        { dispatch, rejectWithValue }
    ) => {
        try {
            const { userId, discountId, cartId, productIdList } = applyDiscountInput;
            const res = await api.post<DicountResponse>(ENDPOINTS.DISCOUNT.APPLY_DISCOUNT, {
                discountId,
                cartId,
                productIdList
            });

            dispatch(getCart(userId));
            dispatch(getDiscountsByShop(shopList));

            return res;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch products");
        }
    }
);

export const createDiscount = createAsyncThunk(
    "cart/createDiscount",
    async (createDiscountInput: CreateDiscountInput, { dispatch, rejectWithValue }) => {
        try {
            const res = await api.post<DicountResponse>(ENDPOINTS.DISCOUNT.CREATE_DISCOUNT, createDiscountInput);
            dispatch(getDiscountsByShop([createDiscountInput.shop]));
            console.log(res);
            return res;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch products");
        }
    }
);

export const updateDiscount = createAsyncThunk(
    "cart/updateDiscount",
    async (updateDiscountInput: UpdateDiscountInput, { dispatch, rejectWithValue }) => {
        try {
            const { discountId, data } = updateDiscountInput;
            const res = await api.patch<DicountResponse>(ENDPOINTS.DISCOUNT.UPDATE_DISCOUNT(discountId), data);
            dispatch(getDiscountsByShop([data.shop]));
            console.log(res);
            return res;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch products");
        }
    }
);

export const deleteDiscount = createAsyncThunk(
    "cart/updateDiscount",
    async (deleteDiscountInput: DeleteDiscountInput, { dispatch, rejectWithValue }) => {
        try {
            const { discountId, shopId } = deleteDiscountInput;
            const res = await api.delete<DeleteDiscountResponse>(ENDPOINTS.DISCOUNT.DELETE_DISCOUNT(discountId));
            dispatch(getDiscountsByShop([shopId]));

            return res;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch products");
        }
    }
);

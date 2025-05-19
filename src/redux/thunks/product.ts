import api from "@/lib/axios/api.service";
import { ENDPOINTS } from "@/lib/axios/endpoint";
import { ProductListResponse } from "@/schema/product";

import { createAsyncThunk } from "@reduxjs/toolkit";

export const getProducts = createAsyncThunk("product/getProducts", async (data: any, { rejectWithValue }) => {
    try {
        const limit = data?.limit;
        const page = data?.page;

        const response = await api.get<ProductListResponse>(ENDPOINTS.PRODUCT.GET_ALL(page, limit));
        return response;
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || "Failed to fetch products");
    }
});

export const getCurrentProduct = createAsyncThunk(
    "product/getCurrentProduct",
    async (productId: string, { rejectWithValue }) => {
        try {
            const response = await api.get(ENDPOINTS.PRODUCT.GET_BY_ID(productId));
            return response;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Failed to update profile");
        }
    }
);

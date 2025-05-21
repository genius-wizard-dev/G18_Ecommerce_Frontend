import api from "@/lib/axios/api.service";
import { ENDPOINTS } from "@/lib/axios/endpoint";
import { OrderListResponse, OrderResponse } from "@/schema/order";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const placeOrder = createAsyncThunk("cart/placeOrder", async (orderNumber: string, { rejectWithValue }) => {
    try {
        const response = await api.get<OrderResponse>(ENDPOINTS.ORDER.GET_ORDER_BY_ORDER_NUMBER(orderNumber));
        return response;
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || "Failed to fetch products");
    }
});

export const getOrdersByUser = createAsyncThunk("cart/getOrdersByUser", async (userId: string, { rejectWithValue }) => {
    try {
        const response = await api.get<OrderListResponse>(ENDPOINTS.ORDER.GET_ORDERS_BY_USER(userId));
        console.log(response);
        return response;
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || "Failed to fetch products");
    }
});

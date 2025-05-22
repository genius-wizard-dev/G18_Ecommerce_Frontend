import { Order, OrderListResponse } from "@/schema/order";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getOrdersByUser } from "../thunks/order";

interface OrderState {
    orders: Order[];
    trigger: number;
    paymentUrl: string;
}

const initialState: OrderState = {
    orders: [],
    trigger: 0,
    paymentUrl: ""
};

const orderSlice = createSlice({
    name: "order",
    initialState,
    reducers: {
        generateTriggerValue: (state, action: PayloadAction<number>) => {
            state.trigger = action.payload;
        },
        setPaymentUrl: (state, action: PayloadAction<string>) => {
            state.paymentUrl = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getOrdersByUser.fulfilled, (state, action: PayloadAction<OrderListResponse>) => {
            state.orders = action.payload.data;
        });
    }
});

export const { generateTriggerValue, setPaymentUrl } = orderSlice.actions;
export default orderSlice.reducer;

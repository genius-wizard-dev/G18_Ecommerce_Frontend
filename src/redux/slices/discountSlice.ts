import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getDiscountsByShop } from "../thunks/discount";
import { Discount } from "@/schema/discount";

interface DiscountState {
    discounts: Discount[];
}

const initialState: DiscountState = {
    discounts: []
};

const discountSlice = createSlice({
    name: "product",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getDiscountsByShop.fulfilled, (state, action: PayloadAction<Discount[]>) => {
            state.discounts = action.payload;
        });
    }
});

export default discountSlice.reducer;

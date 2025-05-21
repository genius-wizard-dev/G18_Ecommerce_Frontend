import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getCurrentProduct, getProducts } from "../thunks/product";
import { ProductListResponse } from "@/schema/product";

interface ProfileState {
    products: any;
    currentProduct: any;
    isLoading: boolean;
    error: string | null;
}

const initialState: ProfileState = {
    products: [],
    currentProduct: null,
    isLoading: false,
    error: null
};

const productSlice = createSlice({
    name: "product",
    initialState,
    reducers: {
        getProduct: (state, action) => {
            state.products = action.payload;
        },
        setCurrentProduct: (state, action) => {
            state.currentProduct = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getProducts.fulfilled, (state, action: PayloadAction<ProductListResponse>) => {
                state.products = action.payload.data.products;
                state.isLoading = false;
            })
            .addCase(getCurrentProduct.fulfilled, (state, action) => {
                state.currentProduct = action.payload;
                state.isLoading = false;
            });
    }
});

export const { getProduct, setCurrentProduct, setError, clearError } = productSlice.actions;
export default productSlice.reducer;

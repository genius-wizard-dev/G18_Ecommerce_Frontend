import api from "@/lib/axios/api.service";
import { ENDPOINTS } from "@/lib/axios/endpoint";
import { CartItemInput, CartItemResponse, CartResponse, DeleteCartItemInput, UpdateQuantityInput } from "@/schema/cart";
import { ProductInput, ProductResponse } from "@/schema/product";

import { createAsyncThunk } from "@reduxjs/toolkit";
import { CartItemBody } from "../slices/cartSlice";

export const deleteCart = createAsyncThunk("cart/deleteCart", async (userId: string, { dispatch, rejectWithValue }) => {
    try {
        const response = await api.delete<CartItemResponse>(ENDPOINTS.CART.DELETE_CART(userId));

        dispatch(getCart(userId));

        return response;
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || "Failed to fetch products");
    }
});

export const deleteCartItem = createAsyncThunk(
    "cart/deleteCartItem",
    async (deleteCartItemData: DeleteCartItemInput, { dispatch, rejectWithValue }) => {
        try {
            const { userId, cartItemId } = deleteCartItemData;
            const response = await api.delete<CartItemResponse>(ENDPOINTS.CART.DELETE_CART_ITEM(cartItemId));

            dispatch(getCart(userId));

            return response;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch products");
        }
    }
);

export const changeProductQuantity = createAsyncThunk(
    "cart/changeProductQuantity",
    async (updateData: UpdateQuantityInput, { dispatch, rejectWithValue }) => {
        try {
            const { cartItemId, quantity, userId } = updateData;

            const response = await api.patch<CartItemResponse>(ENDPOINTS.CART.UPDATE_QUANTITY(cartItemId), {
                quantity
            });

            dispatch(getCart(userId));

            return response;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch products");
        }
    }
);

export const addProductToCart = createAsyncThunk(
    "cart/addProductToCart",
    async (cartItemBody: CartItemBody, { dispatch, rejectWithValue }) => {
        try {
            const userId = cartItemBody.userId;
            const response = await api.post<CartItemResponse>(ENDPOINTS.CART.ADD_TO_CART, cartItemBody);
            dispatch(getCart(userId));
            return response;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch products");
        }
    }
);

export const getCart = createAsyncThunk("cart/getCart", async (userId: string, { rejectWithValue }) => {
    try {
        const response = await api.get<CartResponse>(ENDPOINTS.CART.GET_CART(userId));
        const cartItems = response.data.cartItems;
        const cartId = response.data.id;
        const totalPrice = response.data.totalPrice;

        const quantityParams: any = {};
        const cartIdParams: any = {};
        const finalPriceParams: any = {};
        const appliedDiscountParams: any = {};

        const result = await Promise.allSettled(
            cartItems.map((cartItem: CartItemInput) => {
                quantityParams[cartItem.productId] = cartItem?.quantity;
                cartIdParams[cartItem.productId] = cartItem?.id;
                finalPriceParams[cartItem.productId] = cartItem?.finalPrice;
                appliedDiscountParams[cartItem.productId] = cartItem?.appliedDiscount;
                return api.get<ProductResponse>(ENDPOINTS.PRODUCT.GET_BY_ID(cartItem?.productId));
            })
        );

        return {
            cartId,
            cartItems: result.reduce((arr: any, res) => {
                const status = res.status;

                if (status === "fulfilled") {
                    const product = res.value.data as ProductInput;

                    return [
                        ...arr,
                        {
                            id: cartIdParams[product._id],
                            shopId: product.shopId,
                            productId: product._id,
                            name: product.name,
                            price: finalPriceParams[product._id],
                            image: product.thumbnailImage,
                            quantity: quantityParams[product._id],
                            appliedDiscount: appliedDiscountParams[product._id]
                        }
                    ];
                }

                return arr;
            }, []),
            totalPrice
        };
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || "Failed to fetch products");
    }
});

import { configureStore } from "@reduxjs/toolkit";
import accountReducer from "./slices/account";
import addressReducer from "./slices/addressSlice";
import cartReducer from "./slices/cartSlice";
import locationReducer from "./slices/locationSlice";
import profileReducer from "./slices/profileSlice";
import productReducer from "./slices/productSlice";
import discountReducer from "./slices/discountSlice";
import orderReducer from "./slices/orderSlice";

export const store = configureStore({
    reducer: {
        discount: discountReducer,
        cart: cartReducer,
        account: accountReducer,
        profile: profileReducer,
        address: addressReducer,
        location: locationReducer,
        product: productReducer,
        order: orderReducer
        // auth: authReducer,
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

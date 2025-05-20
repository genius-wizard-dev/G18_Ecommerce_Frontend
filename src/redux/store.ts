import { configureStore } from "@reduxjs/toolkit";
import accountReducer from "./slices/account";
import addressReducer from "./slices/addressSlice";
import cartReducer from "./slices/cartSlice";
import discountReducer from "./slices/discountSlice";
import locationReducer from "./slices/locationSlice";
import productReducer from "./slices/productSlice";
import profileReducer from "./slices/profileSlice";
import shopManagerReducer from "./slices/shopManagerSlice";

export const store = configureStore({
  reducer: {
    discount: discountReducer,
    cart: cartReducer,
    account: accountReducer,
    profile: profileReducer,
    address: addressReducer,
    location: locationReducer,
    product: productReducer,
    shopManager: shopManagerReducer,
    // auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

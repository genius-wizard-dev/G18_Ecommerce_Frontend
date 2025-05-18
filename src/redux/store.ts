import { configureStore } from "@reduxjs/toolkit";
import accountReducer from "./slices/account";
import addressReducer from "./slices/addressSlice";
import cartReducer from "./slices/cartSlice";
import locationReducer from "./slices/locationSlice";
import profileReducer from "./slices/profileSlice";

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    account: accountReducer,
    profile: profileReducer,
    address: addressReducer,
    location: locationReducer,
    // auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

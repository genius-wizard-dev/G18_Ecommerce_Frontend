import { configureStore } from "@reduxjs/toolkit";
import accountReducer from "./slices/account";
import cartReducer from "./slices/cartSlice";
import profileReducer from "./slices/profileSlice";

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    account: accountReducer,
    profile: profileReducer,
    // auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

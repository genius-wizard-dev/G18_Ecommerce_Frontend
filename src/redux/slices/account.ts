import { Account, AccountResponse } from "@/schema/account";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { getAccountInfo } from "../thunks/account";

interface AccountState {
  account: Account | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: AccountState = {
  account: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    setAccount: (state, action: PayloadAction<Account>) => {
      state.account = action.payload;
      state.isAuthenticated = true;
    },
    clearAccount: (state) => {
      state.account = null;
      state.isAuthenticated = false;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAccountInfo.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        getAccountInfo.fulfilled,
        (state, action: PayloadAction<AccountResponse>) => {
          state.isLoading = false;
          if (action.payload.code === 1000) {
            state.account = action.payload.result;
            state.isAuthenticated = true;
          } else {
            state.isAuthenticated = false;
            state.account = null;
          }
        }
      )
      .addCase(getAccountInfo.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          (action.payload as string) || "Failed to fetch account information";
        state.isAuthenticated = false;
        state.account = null;
      });
  },
});

export const { setAccount, clearAccount, setError, clearError } =
  accountSlice.actions;
export default accountSlice.reducer;

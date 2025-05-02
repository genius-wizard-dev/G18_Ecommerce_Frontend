import { Account } from "@/types/account";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { getInfo } from "../thunks/account";

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
      .addCase(getInfo.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getInfo.fulfilled, (state, action: PayloadAction<Account>) => {
        state.isLoading = false;
        // If your API returns data in a nested structure, adjust accordingly
        state.account = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(getInfo.rejected, (state, action) => {
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

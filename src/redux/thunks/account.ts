import api from "@/lib/axios/api.service";
import { ENDPOINTS } from "@/lib/axios/endpoint";
import { getAccessToken } from "@/lib/storage";
import { Account } from "@/types/account";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getInfo = createAsyncThunk<Account, void, { rejectValue: string }>(
  "account/getInfo",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<Account>(ENDPOINTS.AUTH.MY_INFO);
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch account information"
      );
    }
  }
);

export const logout = createAsyncThunk<void, void, { rejectValue: string }>(
  "account/logout",
  async (_, { rejectWithValue }) => {
    try {
      const token = getAccessToken();
      await api.post<void>(ENDPOINTS.AUTH.LOGOUT, { token });
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to logout"
      );
    }
  }
);

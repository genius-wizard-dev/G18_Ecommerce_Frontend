import api from "@/lib/axios/api.service";
import { ENDPOINTS } from "@/lib/axios/endpoint";
import {
  AddressResponse,
  CreateAddress,
  CreateAddressResponse,
  DeleteResponseAddress,
  UpdateAddress,
  UpdateAddressResponse,
} from "@/schema/address";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getAllAddress = createAsyncThunk<
  AddressResponse,
  string,
  { rejectValue: string }
>("address/getAllAddress", async (profileId: string, { rejectWithValue }) => {
  try {
    const response = await api.get<AddressResponse>(
      ENDPOINTS.ADDRESS.GET_ALL(profileId)
    );
    return response;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to fetch address"
    );
  }
});

export const createAddress = createAsyncThunk<
  CreateAddressResponse,
  { address: CreateAddress; profileId: string },
  { rejectValue: string }
>(
  "address/createAddress",
  async ({ address, profileId }, { rejectWithValue }) => {
    try {
      const response = await api.post<CreateAddressResponse>(
        ENDPOINTS.ADDRESS.CREATE(profileId),
        address
      );
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create address"
      );
    }
  }
);

export const updateAddress = createAsyncThunk<
  UpdateAddressResponse,
  { address: UpdateAddress; addressId: string },
  { rejectValue: string }
>(
  "address/updateAddress",
  async ({ address, addressId }, { rejectWithValue }) => {
    try {
      const response = await api.put<UpdateAddressResponse>(
        ENDPOINTS.ADDRESS.UPDATE(addressId),
        address
      );
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update address"
      );
    }
  }
);

export const deleteAddress = createAsyncThunk<
  DeleteResponseAddress & { addressId: string },
  { addressId: string },
  { rejectValue: string }
>("address/deleteAddress", async ({ addressId }, { rejectWithValue }) => {
  try {
    const response = await api.delete<DeleteResponseAddress>(
      ENDPOINTS.ADDRESS.DELETE(addressId)
    );
    return { ...response, addressId };
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to delete address"
    );
  }
});

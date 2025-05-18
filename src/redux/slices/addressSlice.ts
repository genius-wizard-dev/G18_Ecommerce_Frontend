import {
  Address,
  AddressResponse,
  CreateAddressResponse,
} from "@/schema/address";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import {
  createAddress,
  deleteAddress,
  getAllAddress,
  updateAddress,
} from "../thunks/address";

interface AddressState {
  address: Address[];
  isLoading: boolean;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  error: string | null;
}

const initialState: AddressState = {
  address: [],
  isLoading: false,
  isCreating: false,
  isUpdating: false,
  isDeleting: false,
  error: null,
};

const addressSlice = createSlice({
  name: "address",
  initialState,
  reducers: {
    setAddress: (state, action: PayloadAction<Address[]>) => {
      state.address = action.payload;
    },
    clearAddress: (state) => {
      state.address = [];
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
      .addCase(getAllAddress.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        getAllAddress.fulfilled,
        (state, action: PayloadAction<AddressResponse>) => {
          if (action.payload.code === 1000) {
            state.isLoading = false;
            state.address = action.payload.result;
          } else {
            state.isLoading = false;
            state.address = [];
          }
        }
      )
      .addCase(getAllAddress.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) || "Failed to fetch address";
      })
      .addCase(createAddress.pending, (state) => {
        state.isCreating = true;
        state.error = null;
      })
      .addCase(
        createAddress.fulfilled,
        (state, action: PayloadAction<CreateAddressResponse>) => {
          if (action.payload.code === 1000) {
            state.isCreating = false;
            state.address = [...state.address, action.payload.result];
          } else {
            state.isCreating = false;
            state.address = [];
          }
        }
      )
      .addCase(createAddress.rejected, (state, action) => {
        state.isCreating = false;
        state.error = (action.payload as string) || "Failed to create address";
      })
      .addCase(updateAddress.pending, (state) => {
        state.isUpdating = true;
        state.error = null;
      })
      .addCase(updateAddress.fulfilled, (state, action) => {
        state.isUpdating = false;
        if (action.payload.code === 1000) {
          state.address = state.address.map((address) =>
            address.id === action.payload.result.id
              ? action.payload.result
              : address
          );
        } else {
          state.isUpdating = false;
          state.address = [];
        }
      })
      .addCase(updateAddress.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = (action.payload as string) || "Failed to update address";
      })
      .addCase(deleteAddress.pending, (state) => {
        state.isDeleting = true;
        state.error = null;
      })
      .addCase(deleteAddress.fulfilled, (state, action) => {
        state.isDeleting = false;
        if (action.payload.code === 1000) {
          state.address = state.address.filter(
            (address) => address.id !== action.payload.addressId
          );
        } else {
          state.error = "Failed to delete address";
        }
      })
      .addCase(deleteAddress.rejected, (state, action) => {
        state.isDeleting = false;
        state.error = (action.payload as string) || "Failed to delete address";
      });
  },
});

export const { setAddress, clearAddress, setError, clearError } =
  addressSlice.actions;
export default addressSlice.reducer;

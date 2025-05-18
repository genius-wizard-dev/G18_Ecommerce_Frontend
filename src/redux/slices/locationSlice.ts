import { District, LocationState, Province, Ward } from "@/types/address";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchDistricts, fetchProvinces, fetchWards } from "../thunks/location";

const initialState: LocationState = {
  provinces: [],
  districts: [],
  wards: [],
  selectedProvince: null,
  selectedDistrict: null,
  selectedWard: null,
  isLoading: false,
  error: null,
};

const locationSlice = createSlice({
  name: "location",
  initialState,
  reducers: {
    setProvinces: (state, action: PayloadAction<Province[]>) => {
      state.provinces = action.payload;
    },
    setDistricts: (state, action: PayloadAction<District[]>) => {
      state.districts = action.payload;
    },
    setWards: (state, action: PayloadAction<Ward[]>) => {
      state.wards = action.payload;
    },
    setSelectedProvince: (state, action: PayloadAction<Province | null>) => {
      state.selectedProvince = action.payload;
      state.selectedDistrict = null;
      state.selectedWard = null;
      state.districts = [];
      state.wards = [];
    },
    setSelectedDistrict: (state, action: PayloadAction<District | null>) => {
      state.selectedDistrict = action.payload;
      state.selectedWard = null;
      state.wards = [];
    },
    setSelectedWard: (state, action: PayloadAction<Ward | null>) => {
      state.selectedWard = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Xử lý fetchProvinces
      .addCase(fetchProvinces.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        fetchProvinces.fulfilled,
        (state, action: PayloadAction<Province[]>) => {
          state.provinces = action.payload;
          state.isLoading = false;
        }
      )
      .addCase(fetchProvinces.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.payload || "Không thể tải danh sách tỉnh/thành phố";
      })
      // Xử lý fetchDistricts
      .addCase(fetchDistricts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        fetchDistricts.fulfilled,
        (state, action: PayloadAction<District[]>) => {
          state.districts = action.payload;
          state.isLoading = false;
        }
      )
      .addCase(fetchDistricts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Không thể tải danh sách quận/huyện";
      })
      // Xử lý fetchWards
      .addCase(fetchWards.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchWards.fulfilled, (state, action: PayloadAction<Ward[]>) => {
        state.wards = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchWards.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Không thể tải danh sách phường/xã";
      });
  },
});

export const {
  setProvinces,
  setDistricts,
  setWards,
  setSelectedProvince,
  setSelectedDistrict,
  setSelectedWard,
  clearError,
} = locationSlice.actions;

export default locationSlice.reducer;

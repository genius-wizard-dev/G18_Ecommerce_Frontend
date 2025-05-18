import locationService from "@/lib/axios/location.service";
import { District, Province, Ward } from "@/schema/address";
import { indexedDBService } from "@/utils/index.db";
import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  setDistricts,
  setProvinces,
  setSelectedDistrict,
  setSelectedProvince,
  setSelectedWard,
  setWards,
} from "../slices/locationSlice";

export const fetchProvinces = createAsyncThunk<
  Province[],
  void,
  { rejectValue: string }
>("location/fetchProvinces", async (_, { dispatch, rejectWithValue }) => {
  try {
    // Kiểm tra trong IndexedDB trước
    const cachedProvinces = await indexedDBService.getProvinces();
    if (cachedProvinces && cachedProvinces.length > 0) {
      dispatch(setProvinces(cachedProvinces));
      return cachedProvinces;
    }

    // Nếu không có trong IndexedDB, gọi API
    const response = await locationService.get<Province[]>(`/p/`);

    // Lưu vào IndexedDB
    await indexedDBService.saveProvinces(response);

    dispatch(setProvinces(response));
    return response;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Không thể tải danh sách tỉnh/thành phố"
    );
  }
});

export const fetchDistricts = createAsyncThunk<
  District[],
  number,
  { rejectValue: string }
>(
  "location/fetchDistricts",
  async (provinceCode: number, { dispatch, rejectWithValue }) => {
    try {
      // Kiểm tra trong IndexedDB trước
      const cachedDistricts = await indexedDBService.getDistricts(provinceCode);
      if (cachedDistricts && cachedDistricts.length > 0) {
        dispatch(setDistricts(cachedDistricts));
        return cachedDistricts;
      }

      // Nếu không có trong IndexedDB, gọi API
      const response = await locationService.get<{ districts: District[] }>(
        `/p/${provinceCode}?depth=2`
      );

      // Lưu vào IndexedDB với thông tin quan hệ
      const districtsWithRelation = response.districts.map((district) => ({
        ...district,
        province_code: provinceCode,
      }));
      await indexedDBService.saveDistricts(districtsWithRelation);

      dispatch(setDistricts(districtsWithRelation));
      return districtsWithRelation;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Không thể tải danh sách quận/huyện"
      );
    }
  }
);

export const fetchWards = createAsyncThunk<
  Ward[],
  number,
  { rejectValue: string }
>(
  "location/fetchWards",
  async (districtCode: number, { dispatch, rejectWithValue }) => {
    try {
      // Kiểm tra trong IndexedDB trước
      const cachedWards = await indexedDBService.getWards(districtCode);
      if (cachedWards && cachedWards.length > 0) {
        dispatch(setWards(cachedWards));
        return cachedWards;
      }

      // Nếu không có trong IndexedDB, gọi API
      const response = await locationService.get<{ wards: Ward[] }>(
        `/d/${districtCode}?depth=2`
      );

      // Lưu vào IndexedDB với thông tin quan hệ
      const wardsWithRelation = response.wards.map((ward) => ({
        ...ward,
        district_code: districtCode,
      }));
      await indexedDBService.saveWards(wardsWithRelation);

      dispatch(setWards(wardsWithRelation));
      return wardsWithRelation;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Không thể tải danh sách phường/xã"
      );
    }
  }
);

export const selectProvince = (province: Province) => (dispatch: any) => {
  dispatch(setSelectedProvince(province));
  dispatch(fetchDistricts(province.code));
};

export const selectDistrict = (district: District) => (dispatch: any) => {
  dispatch(setSelectedDistrict(district));
  dispatch(fetchWards(district.code));
};

export const selectWard = (ward: Ward) => (dispatch: any) => {
  dispatch(setSelectedWard(ward));
};

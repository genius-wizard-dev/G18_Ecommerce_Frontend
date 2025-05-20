import api from "@/lib/axios/api.service";
import { ENDPOINTS } from "@/lib/axios/endpoint";
import { Profile, ProfileResponse } from "@/schema/profile";
import { CheckShopResponse } from "@/schema/shop";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getProfile = createAsyncThunk<
  ProfileResponse,
  string,
  { rejectValue: string }
>("profile/getProfile", async (userId: string, { rejectWithValue }) => {
  try {
    // Fetch both profile and shop status in parallel for better performance
    const [profileResponse, shopResponse] = await Promise.all([
      api.get<ProfileResponse>(ENDPOINTS.PROFILE.INFO(userId)),
      api.get<CheckShopResponse>(ENDPOINTS.PROFILE.CHECK_SHOP(userId)),
    ]);

    // Validate responses
    if (profileResponse.code !== 1000) {
      throw new Error(`Failed to fetch profile`);
    }
    if (shopResponse.code !== 1000) {
      throw new Error(`Failed to check shop status`);
    }

    return {
      ...profileResponse,
      result: {
        ...profileResponse.result,
        isShop: shopResponse.result,
      },
    };
  } catch (error: any) {
    const errorMessage =
      error.message ||
      error.response?.data?.message ||
      "Failed to fetch profile information";
    return rejectWithValue(errorMessage);
  }
});

export const updateProfile = createAsyncThunk<
  ProfileResponse,
  { userId: string; profileData: Partial<Profile> },
  { rejectValue: string }
>(
  "profile/updateProfile",
  async ({ userId, profileData }, { rejectWithValue }) => {
    try {
      const response = await api.put<ProfileResponse>(
        ENDPOINTS.PROFILE.INFO(userId),
        profileData
      );
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update profile"
      );
    }
  }
);

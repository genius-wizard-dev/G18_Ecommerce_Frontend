import api from "@/lib/axios/api.service";
import { ENDPOINTS } from "@/lib/axios/endpoint";
import { Profile, ProfileResponse } from "@/types/profile";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getProfile = createAsyncThunk<
  Profile,
  string,
  { rejectValue: string }
>("profile/getProfile", async (userId: string, { rejectWithValue }) => {
  try {
    const response = await api.get<ProfileResponse>(
      ENDPOINTS.PROFILE.INFO(userId)
    );
    return response.result;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to fetch profile information"
    );
  }
});

export const updateProfile = createAsyncThunk<
  Profile,
  { userId: string; profileData: Partial<Profile> },
  { rejectValue: string }
>(
  "profile/updateProfile",
  async ({ userId, profileData }, { rejectWithValue }) => {
    try {
      const response = await api.put<ProfileResponse>(
        ENDPOINTS.PROFILE.UPDATE(userId),
        profileData
      );
      return response.result;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update profile"
      );
    }
  }
);

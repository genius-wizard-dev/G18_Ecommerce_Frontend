import api from "@/lib/axios/api.service";
import { ENDPOINTS } from "@/lib/axios/endpoint";
import { Profile, ProfileResponse } from "@/schema/profile";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getProfile = createAsyncThunk<
  ProfileResponse,
  string,
  { rejectValue: string }
>("profile/getProfile", async (userId: string, { rejectWithValue }) => {
  try {
    const response = await api.get<ProfileResponse>(
      ENDPOINTS.PROFILE.INFO(userId)
    );
    return response;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to fetch profile information"
    );
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

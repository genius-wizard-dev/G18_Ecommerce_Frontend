import { Profile, ProfileResponse } from "@/types/profile";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { getProfile, updateProfile } from "../thunks/profile";

interface ProfileState {
  profile: Profile | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: ProfileState = {
  profile: null,
  isLoading: false,
  error: null,
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    setProfile: (state, action: PayloadAction<Profile>) => {
      state.profile = action.payload;
    },
    clearProfile: (state) => {
      state.profile = null;
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
      .addCase(getProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        getProfile.fulfilled,
        (state, action: PayloadAction<ProfileResponse>) => {
          if (action.payload.code === 1000) {
            state.profile = action.payload.result;
          } else {
            state.profile = null;
          }
          state.isLoading = false;
        }
      )
      .addCase(getProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          (action.payload as string) || "Failed to fetch profile information";
      })
      .addCase(updateProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        updateProfile.fulfilled,
        (state, action: PayloadAction<ProfileResponse>) => {
          if (action.payload.code === 1000) {
            state.profile = action.payload.result;
          } else {
            state.profile = null;
          }
          state.isLoading = false;
        }
      )
      .addCase(updateProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          (action.payload as string) || "Failed to update profile information";
      });
  },
});

export const { setProfile, clearProfile, setError, clearError } =
  profileSlice.actions;
export default profileSlice.reducer;

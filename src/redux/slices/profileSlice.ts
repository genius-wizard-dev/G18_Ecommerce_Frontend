import { Profile } from "@/types/profile";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { getProfile } from "../thunks/profile";

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
        (state, action: PayloadAction<Profile>) => {
          state.isLoading = false;
          state.profile = action.payload;
        }
      )
      .addCase(getProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          (action.payload as string) || "Failed to fetch profile information";
      });
  },
});

export const { setProfile, clearProfile, setError, clearError } =
  profileSlice.actions;
export default profileSlice.reducer;

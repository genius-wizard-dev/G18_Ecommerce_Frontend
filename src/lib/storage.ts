// Constants for localStorage keys
export const STORAGE_KEYS = {
  ACCESS_TOKEN: "access_token",
  REFRESH_TOKEN: "refresh_token",
  USER_DATA: "user_data",
} as const;

// Access Token Functions
export const setAccessToken = (token: string): void => {
  localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token);
};

export const getAccessToken = (): string | null => {
  return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
};

export const removeAccessToken = (): void => {
  localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
};

// Refresh Token Functions
export const setRefreshToken = (token: string): void => {
  localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, token);
};

export const getRefreshToken = (): string | null => {
  return localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
};

export const removeRefreshToken = (): void => {
  localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
};

// Helper Functions
export const hasAccessToken = (): boolean => {
  return !!getAccessToken();
};

export const hasRefreshToken = (): boolean => {
  return !!getRefreshToken();
};

// Clear all auth tokens
export const clearAllTokens = (): void => {
  removeAccessToken();
  removeRefreshToken();
};

// Set both tokens at once (useful during login)
export const setAuthTokens = (
  accessToken: string,
  refreshToken: string
): void => {
  setAccessToken(accessToken);
  setRefreshToken(refreshToken);
};

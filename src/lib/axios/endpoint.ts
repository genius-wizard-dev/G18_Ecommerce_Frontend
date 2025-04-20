const BASE_ENDPOINT = "";

export const ENDPOINTS = {
  AUTH: {
    LOGIN: `${BASE_ENDPOINT}/identity/auth/log-in`,
    REGISTER: `${BASE_ENDPOINT}/identity/users/sign-up`,
    LOGOUT: `${BASE_ENDPOINT}/identity/auth/logout`,
    REFRESH: `${BASE_ENDPOINT}/identity/auth/refresh-token`,
    INTROSPECT: `${BASE_ENDPOINT}/identity/auth/introspect`,
    MY_INFO: `${BASE_ENDPOINT}/identity/users/my-info`,
    DELETE_ACCOUNT: (userId: string) =>
      `${BASE_ENDPOINT}/identity/users/${userId}`,
  },
  PROFILE: {
    UPDATE: (profileId: string) => `${BASE_ENDPOINT}/profile/${profileId}`,
    REGISTER_SHOP: (profileId: string) =>
      `${BASE_ENDPOINT}/profile/register-shop/${profileId}`,
  },
  ADDRESS: {
    CREATE: (profileId: string) =>
      `${BASE_ENDPOINT}/profile/address/create/${profileId}`,
    GET_ALL: (profileId: string) =>
      `${BASE_ENDPOINT}/profile/address/get-all/${profileId}`,
    SET_DEFAULT: (profileId: string, addressId: string) =>
      `${BASE_ENDPOINT}/profile/address/set-default/${profileId}/${addressId}`,
    UPDATE_TYPE: (addressId: string, type: string) =>
      `${BASE_ENDPOINT}/profile/address/update-type/${addressId}?type=${type}`,
  },
};

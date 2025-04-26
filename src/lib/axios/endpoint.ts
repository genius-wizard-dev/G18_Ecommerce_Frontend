const BASE_ENDPOINT = "";

export const ENDPOINTS = {
  AUTH: {
    LOGIN: `${BASE_ENDPOINT}/identity/auth/log-in`,
    REGISTER: `${BASE_ENDPOINT}/identity/users/sign-up`,
    LOGOUT: `${BASE_ENDPOINT}/identity/auth/logout`,
    REFRESH: `${BASE_ENDPOINT}/identity/auth/refresh`,
    INTROSPECT: `${BASE_ENDPOINT}/identity/auth/introspect`,
    MY_INFO: `${BASE_ENDPOINT}/identity/users/my-info`,
    DELETE_ACCOUNT: (userId: string) =>
      `${BASE_ENDPOINT}/identity/users/${userId}`,
  },
  PROFILE: {
    UPDATE: (userId: string) => `${BASE_ENDPOINT}/profile/${userId}`,
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
  PRODUCT: {
    GET_ALL: (page?: number, limit?: number, category?: string) =>
      `${BASE_ENDPOINT}/api/products${
        page || limit || category
          ? `?${[
              page ? `page=${page}` : "",
              limit ? `limit=${limit}` : "",
              category ? `category=${category}` : "",
            ]
              .filter(Boolean)
              .join("&")}`
          : ""
      }`,
    GET_BY_ID: (productId: string) =>
      `${BASE_ENDPOINT}/api/products/${productId}`,
  },
};

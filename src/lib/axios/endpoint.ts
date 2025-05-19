export const ENDPOINTS = {
  AUTH: {
    LOGIN: `/identity/auth/log-in`,
    REGISTER: `/identity/users/sign-up`,
    LOGOUT: `/identity/auth/logout`,
    REFRESH: `/identity/auth/refresh`,
    INTROSPECT: `/identity/auth/introspect`,
    MY_INFO: `/identity/users/my-info`,
    DELETE_ACCOUNT: (userId: string) => `/identity/users/${userId}`,
    SEND_OTP_CHANGE_PASSWORD: (userId: string) =>
      `/identity/auth/send-otp-change-password/${userId}`,
    CHANGE_PASSWORD: (userId: string) =>
      `/identity/auth/change-password/${userId}`,
  },
  PROFILE: {
    INFO: (userId: string) => `/profile/${userId}`,
    REGISTER_SHOP: (profileId: string) => `/profile/register-shop/${profileId}`,
    CHECK_SHOP: (userId: string) => `/profile/check-shop/${userId}`,
  },
  ADDRESS: {
    CREATE: (profileId: string) => `/profile/address/create/${profileId}`,
    GET_ALL: (profileId: string) => `/profile/address/get-all/${profileId}`,
    SET_DEFAULT: (profileId: string, addressId: string) =>
      `/profile/address/set-default/${profileId}/${addressId}`,
    UPDATE_TYPE: (addressId: string, type: string) =>
      `/profile/address/update-type/${addressId}?type=${type}`,
    UPDATE: (addressId: string) => `/profile/address/update/${addressId}`,
    DELETE: (addressId: string) => `/profile/address/delete/${addressId}`,
  },
  PRODUCT: {
    CREATE: "/api/products",
    GET_ALL: (page?: number, limit?: number, category?: string) =>
      `/api/products${
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
    GET_BY_ID: (productId: string) => `/api/products/${productId}`,
    GET_BY_SHOP: (shopId: string) => `/api/products?shopId=${shopId}`,
  },
  CART: {
    GET_CART: (userId: string) => `/api/carts/users/${userId}`,
    ADD_TO_CART: `/api/carts/cart-items`,
    UPDATE_QUANTITY: (cartId: string) => `/api/carts/cart-items/${cartId}`,
    DELETE_CART_ITEM: (cartItemId: string) =>
      `/api/carts/carts-items/${cartItemId}`,
    DELETE_CART: (userId: string) => `/api/carts/users/${userId}`,
  },
  DISCOUNT: {
    GET_DISCOUNTS_BY_SHOP: (shopId: string) =>
      `/api/discounts?shopId=${shopId}`,
    APPLY_DISCOUNT: "/api/carts/apply-discount",
  },
  INVENTORY: {
    CREATE: "/api/inventories",
    GET_BY_PRODUCT_ID: (productId: string) =>
      `/api/inventories?product_id=${productId}`,
  },
};

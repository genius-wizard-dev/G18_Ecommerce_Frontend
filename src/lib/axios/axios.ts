import axios, {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from "axios";
import { ENDPOINTS } from "./endpoint";

class ApiClient {
  private static instance: AxiosInstance;
  private static isRefreshing = false;
  private static failedQueue: { resolve: Function; reject: Function }[] = [];

  private constructor() {}

  private static processQueue(error: any = null) {
    console.log(
      `Processing queue with ${
        ApiClient.failedQueue.length
      } pending requests, error: ${error ? "yes" : "no"}`
    );
    ApiClient.failedQueue.forEach((promise) => {
      if (error) {
        promise.reject(error);
      } else {
        promise.resolve();
      }
    });

    ApiClient.failedQueue = [];
  }

  public static getInstance(): AxiosInstance {
    if (!ApiClient.instance) {
      ApiClient.instance = axios.create({
        baseURL: import.meta.env.VITE_API_URL || "",
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      ApiClient.instance.interceptors.request.use(
        async (config: InternalAxiosRequestConfig) => {
          const publicEndpoints = [
            ENDPOINTS.AUTH.REFRESH,
            ENDPOINTS.AUTH.LOGIN,
            ENDPOINTS.AUTH.REGISTER,
            ENDPOINTS.AUTH.LOGOUT,
          ];

          const isPublicRequest = publicEndpoints.some((endpoint) =>
            config.url?.includes(endpoint)
          );

          if (!isPublicRequest) {
            const token = localStorage.getItem("access_token");
            if (token && config.headers) {
              config.headers.Authorization = `Bearer ${token}`;
              try {
                const introspectResponse = await axios.post(
                  `${import.meta.env.VITE_API_URL}${ENDPOINTS.AUTH.INTROSPECT}`,
                  { token }
                );
                if (
                  introspectResponse.data?.code === 1000 &&
                  introspectResponse.data?.result?.valid === false
                ) {
                  localStorage.removeItem("access_token");
                  window.location.reload();
                }
              } catch (error) {
                console.error("Introspect API error:", error);
              }
            }
          }

          return config;
        },
        (error) => {
          console.log("Request Error:", error);
          return Promise.reject(error);
        }
      );

      ApiClient.instance.interceptors.response.use(
        (response) => response,
        async (error: AxiosError) => {
          const originalRequest = error.config as InternalAxiosRequestConfig & {
            _retry?: boolean;
          };

          if (
            error.response?.status === 401 &&
            originalRequest &&
            !originalRequest._retry
          ) {
            console.log("Received 401 error, details:", {
              url: originalRequest.url,
              method: originalRequest.method,
              hasAuthHeader: originalRequest.headers?.Authorization
                ? true
                : false,
              isFirstAttempt: !originalRequest._retry,
            });

            originalRequest._retry = true;

            if (ApiClient.isRefreshing) {
              console.log(
                "Token refresh already in progress, adding request to queue"
              );
              // Nếu đang refresh token, thêm request vào hàng đợi
              return new Promise((resolve, reject) => {
                ApiClient.failedQueue.push({ resolve, reject });
              })
                .then(() => {
                  // Khi refresh hoàn tất, thử lại request với token mới
                  const token = localStorage.getItem("access_token");
                  if (token && originalRequest.headers) {
                    originalRequest.headers.Authorization = `Bearer ${token}`;
                  }
                  return ApiClient.instance(originalRequest);
                })
                .catch((err) => {
                  return Promise.reject(err);
                });
            }

            ApiClient.isRefreshing = true;
            console.log("Starting token refresh process");

            try {
              // Lấy refresh token
              const token = localStorage.getItem("access_token");

              console.log(`Access token exists: ${!!token}`);

              if (!token) {
                // Không có refresh token, từ chối request
                console.log("No access token available, rejecting request");
                ApiClient.processQueue(error);
                ApiClient.isRefreshing = false;
                return Promise.reject(error);
              }

              // // Tạo instance mới để tránh vòng lặp interceptor
              // console.log(
              //   `Calling refresh token API at: ${import.meta.env.VITE_API_URL}${
              //     ENDPOINTS.AUTH.REFRESH
              //   }`
              // );
              const refreshResponse = await axios.post(
                `${import.meta.env.VITE_API_URL}${ENDPOINTS.AUTH.REFRESH}`,
                {
                  token,
                }
              );

              // console.log("Refresh API response:", {
              //   status: refreshResponse.status,
              //   code: refreshResponse.data?.code,
              //   hasResult: !!refreshResponse.data?.result,
              // });

              if (
                refreshResponse.data &&
                refreshResponse.data.code === 1000 &&
                refreshResponse.data.result
              ) {
                // Lưu token mới
                const { token } = refreshResponse.data.result;
                localStorage.setItem("access_token", token);
                console.log("New access token saved successfully");

                // Cập nhật token trong request hiện tại
                if (originalRequest.headers) {
                  originalRequest.headers.Authorization = `Bearer ${token}`;
                }

                // Xử lý tất cả các request đang chờ
                console.log("Processing queue with new token");
                ApiClient.processQueue();
                ApiClient.isRefreshing = false;

                // Thử lại request ban đầu
                return ApiClient.instance(originalRequest);
              } else {
                console.log("Token refresh failed: Invalid response format");
                ApiClient.processQueue(error);
                ApiClient.isRefreshing = false;
                localStorage.removeItem("access_token");
                return Promise.reject(error);
              }
            } catch (refreshError: any) {
              // Nếu refresh token không hợp lệ, từ chối request
              console.error(
                "Token refresh error:",
                refreshError?.response?.data || refreshError?.message
              );
              ApiClient.processQueue(refreshError);
              ApiClient.isRefreshing = false;
              return Promise.reject(refreshError);
            }
          } else if (error.response?.status === 401) {
            console.log(
              "Received 401 error but not attempting refresh because:",
              {
                hasOriginalRequest: !!originalRequest,
                isRetry: originalRequest?._retry,
              }
            );
          } else if (error.response) {
            console.error("Lỗi Response:", {
              status: error.response.status,
              data: error.response.data,
              message: error.message,
            });
          } else if (error.request) {
            console.error("Lỗi Request:", error.request);
          } else {
            console.error("Lỗi:", error.message);
          }
          return Promise.reject(error);
        }
      );
    }
    return ApiClient.instance;
  }
}

export default ApiClient;

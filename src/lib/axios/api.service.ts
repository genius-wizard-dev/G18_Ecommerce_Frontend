import { AxiosRequestConfig, AxiosResponse } from "axios";
import instance from "./axios";

export class ApiService {
  private getHeaders(token?: string): Record<string, string> {
    const headers: Record<string, string> = {};

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    return headers;
  }

  async request<T>(
    method: string,
    uri: string,
    data?: any,
    token?: string,
    params?: any
  ): Promise<T> {
    try {
      const config: AxiosRequestConfig = {
        method,
        url: uri,
        headers: this.getHeaders(token),
        params,
      };

      if (
        data &&
        (method === "POST" || method === "PUT" || method === "PATCH")
      ) {
        config.data = data;
      }

      if (data && method === "DELETE") {
        config.data = data;
      }

      const response: AxiosResponse<T> = await instance(config);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async get<T>(uri: string, token?: string, params?: any): Promise<T> {
    return this.request<T>("GET", uri, undefined, token, params);
  }

  async post<T>(uri: string, data?: any, token?: string): Promise<T> {
    return this.request<T>("POST", uri, data, token);
  }

  async put<T>(uri: string, data?: any, token?: string): Promise<T> {
    return this.request<T>("PUT", uri, data, token);
  }

  async delete<T>(uri: string, data?: any, token?: string): Promise<T> {
    return this.request<T>("DELETE", uri, data, token);
  }

  async patch<T>(uri: string, data?: any, token?: string): Promise<T> {
    return this.request<T>("PATCH", uri, data, token);
  }
}

// Create and export a singleton instance
const api = new ApiService();
export default api;

/**
 * Usage examples:
 *
 * For authentication routes (login/register), do NOT pass token:
 * export const loginUser = (credentials: LoginCredentials) =>
 *   api.post<LoginResponse>('/auth/login', credentials);
 *
 * export const registerUser = (userData: RegisterData) =>
 *   api.post<RegisterResponse>('/auth/register', userData);
 *
 * For protected routes, pass token:
 * export const getUserProfile = (token: string) =>
 *   api.get<UserProfile>('/user/profile', token);
 *
 * export const updateUserProfile = (data: ProfileData, token: string) =>
 *   api.put<UserProfile>('/user/profile', data, token);
 */

import { ApiService } from "@/types/api.service";
import ApiClient from "./axios";

// Get the preconfigured axios instance
const axiosInstance = ApiClient.getInstance();

class ApiServiceImpl implements ApiService {
  private async request<T>(
    method: string,
    uri: string,
    data?: any,
    headers?: any
  ): Promise<T> {
    try {
      console.log(`📤 Making ${method} request to ${uri}`, { data });

      const response = await axiosInstance.request<T>({
        method,
        url: uri,
        data,
        headers,
      });

      return response.data;
    } catch (error) {
      console.error(`❌ Error in ${method} request to ${uri}:`, error);
      throw error;
    }
  }

  async get<T>(uri: string): Promise<T> {
    return this.request<T>("GET", uri);
  }

  async post<T>(uri: string, data?: any): Promise<T> {
    return this.request<T>("POST", uri, data);
  }

  async put<T>(uri: string, data?: any): Promise<T> {
    return this.request<T>("PUT", uri, data);
  }

  async delete<T>(uri: string): Promise<T> {
    return this.request<T>("DELETE", uri);
  }
  async patch<T>(uri: string, data?: any): Promise<T> {
    return this.request<T>("PATCH", uri, data);
  }
}

const api = new ApiServiceImpl();

export default api;

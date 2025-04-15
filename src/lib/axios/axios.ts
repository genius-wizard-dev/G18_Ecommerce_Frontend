// axios.config.ts
import axios, { AxiosInstance as AxiosClientInstance, AxiosError } from "axios";

class AxiosInstance {
  private static instance: AxiosInstance;
  private axiosClient: AxiosClientInstance;

  private constructor() {
    this.axiosClient = axios.create({
      baseURL: import.meta.env.VITE_API_URL || "",
    });

    this.axiosClient.interceptors.response.use(
      (response) => {
        return response;
      },
      (error: AxiosError) => {
        if (error.response) {
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

  public static getInstance(): AxiosClientInstance {
    if (!AxiosInstance.instance) {
      AxiosInstance.instance = new AxiosInstance();
    }
    return AxiosInstance.instance.axiosClient;
  }
}

const instance = AxiosInstance.getInstance();
export default instance;

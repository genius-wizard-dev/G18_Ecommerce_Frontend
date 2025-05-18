import axios, { AxiosInstance } from "axios";

class LocationApiClient {
  private static instance: AxiosInstance;

  private constructor() {}

  public static getInstance(): AxiosInstance {
    if (!LocationApiClient.instance) {
      LocationApiClient.instance = axios.create({
        baseURL: import.meta.env.VITE_API_PROVINCES,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }
    return LocationApiClient.instance;
  }
}

export default LocationApiClient;

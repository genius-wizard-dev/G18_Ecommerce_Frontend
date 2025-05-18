import LocationApiClient from "./location.axios";

const locationApi = LocationApiClient.getInstance();

class LocationService {
  async get<T>(uri: string): Promise<T> {
    try {
      const response = await locationApi.get<T>(uri);
      return response.data;
    } catch (error) {
      console.error(`❌ Error in GET request to ${uri}:`, error);
      throw error;
    }
  }
}

const locationService = new LocationService();

export default locationService;

import HttpClient from "./HttpClient";
import { AxiosResponse } from "axios";

export interface CitiesResponse {
  message: string;
  result: any[];
}
export interface postCities {
  name: string;
  state: string;
  timeZone: string;
  active: boolean;
}
export interface updateCities {
  name: string;
  state: string;
  timeZone: string;
  active: boolean;
}

export default class OMSApi extends HttpClient {
  constructor() {
    super("https://oms-api-dev.welz.com/api/v1/");
  }

  async getCities(): Promise<CitiesResponse> {
    const url = "cities";
    try {
      const response: AxiosResponse<CitiesResponse> = await this.instance.get(
        url
      );
      const { status } = response;
      if (status === 200) {
        const { data } = response;
        return data;
      } else {
        return Promise.reject(new Error());
      }
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async postCities(param: postCities): Promise<CitiesResponse> {
    const url = "cities";
    try {
      const response: AxiosResponse<CitiesResponse> = await this.instance.post(
        url,
        param
      );
      const { status } = response;
      if (status === 201) {
        const { data } = response;
        return data;
      } else {
        return Promise.reject(new Error());
      }
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async updateCities(id: number, param: updateCities): Promise<CitiesResponse> {
    const url = "cities/" + id.toString();

    try {
      const response: AxiosResponse<CitiesResponse> = await this.instance.put(
        url,
        param
      );
      const { status } = response;
      if (status === 200) {
        const { data } = response;
        return data;
      } else {
        return Promise.reject(new Error());
      }
    } catch (error) {
      return Promise.reject(error);
    }
  }
  async deleteCities(id: number): Promise<CitiesResponse> {
    const url = "cities/" + id.toString();

    try {
      const response: AxiosResponse<CitiesResponse> =
        await this.instance.delete(url);
      const { status } = response;
      if (status === 200) {
        const { data } = response;
        return data;
      } else {
        return Promise.reject(new Error());
      }
    } catch (error) {
      return Promise.reject(error);
    }
  }
}

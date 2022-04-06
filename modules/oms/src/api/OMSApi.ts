import HttpClient from "./HttpClient";
import { AxiosResponse } from "axios";
export interface City {
  id: number;
  name: string;
  state: string;
  timeZone: string;
  active: boolean;
}
export interface CitiesResponse {
  message: string;
  result: {
    data: City[];
    currentPage: number;
    limit: number;
    totalPages: number;
    totalRecords: number;
  }[];
}
export interface CityPayload {
  name: string;
  state: string;
  timeZone: string;
  active: boolean;
}

export interface Service {
  id: number;
  name: string;
  description: string;
  price: string;
  active: boolean;
  group: ServiceGroup;
}
export interface ServicesResponse {
  message: string;
  result: {
    data: Service[];
    currentPage: number;
    limit: number;
    totalPages: number;
    totalRecords: number;
  }[];
}
export interface ServicePayload {
  name: string;
  description: string;
  price: string;
  active: boolean;
  groupId: number;
}
export interface ServiceGroup {
  id: number;
  name: string;
}
export interface ServiceGroupsResponse {
  message: string;
  result: {
    data: ServiceGroup[];
    currentPage: number;
    limit: number;
    totalPages: number;
    totalRecords: number;
  }[];
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

  async postCities(param: CityPayload): Promise<CitiesResponse> {
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

  async updateCities(id: number, param: CityPayload): Promise<CitiesResponse> {
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

  async getServices(): Promise<ServicesResponse> {
    const url = "services";
    try {
      const response: AxiosResponse<ServicesResponse> = await this.instance.get(
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

  async postServices(param: ServicePayload): Promise<ServicesResponse> {
    const url = "services";
    try {
      const response: AxiosResponse<ServicesResponse> =
        await this.instance.post(url, param);
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
  async updateServices(
    id: number,
    param: ServicePayload
  ): Promise<ServicesResponse> {
    const url = "services/" + id.toString();

    try {
      const response: AxiosResponse<ServicesResponse> = await this.instance.put(
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
  async deleteServices(id: number): Promise<ServicesResponse> {
    const url = "services/" + id.toString();

    try {
      const response: AxiosResponse<ServicesResponse> =
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

  async getServiceGroups(): Promise<ServiceGroupsResponse> {
    const url = "service-groups";
    try {
      const response: AxiosResponse<ServiceGroupsResponse> =
        await this.instance.get(url);
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

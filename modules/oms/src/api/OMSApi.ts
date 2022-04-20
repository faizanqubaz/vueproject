import HttpClient from "./HttpClient";
import { AxiosResponse } from "axios";
import qs from "query-string";
import { pickBy, identity } from "lodash";
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
export interface Provider {
  id: number;
  firstName: string;
  middleName: string;
  lastName: string;
  dob: string;
  gender: string;
  phone: string;
  email: string;
  authId: string;
}
export interface ProvidersResponse {
  message: string;
  result: {
    data: Provider[];
    currentPage: number;
    limit: number;
    totalPages: number;
    totalRecords: number;
  }[];
}
export interface ProviderPayload {
  firstName: string;
  middleName: string;
  lastName: string;
  dob: string;
  gender: string;
  phone: string;
  email: string;
}
export interface Patient {
  id: number;
  firstName: string;
  middleName: string;
  lastName: string;
  dob: string;
  gender: string;
  phone: string;
  email: string;
  authId: string;
}
export interface PatientsResponse {
  message: string;
  result: {
    data: Patient[];
    currentPage: number;
    limit: number;
    totalPages: number;
    totalRecords: number;
  }[];
}
export interface Address {
  id: number;
  street: string;
  apartment: string;
  city: string;
  state: string;
  zipCode: string;
  longitude: number;
  latitude: number;
  primary: boolean;
}

export interface AddressesResponse {
  message: string;
  result: {
    data: Address[];
    currentPage: number;
    limit: number;
    totalPages: number;
    totalRecords: number;
  }[];
}
export interface Note {
  id: number;
  memo: string;
}
export interface Visit {
  id: number;
  date: string;
  startTime: string;
  scheduledStartTime: string;
  scheduledEndTime: string;
  checkInTime: string;
  checkOutTime: string;
  service: Service;
  patient: Patient;
  address: Address;
  provider: Provider;
  providerNote: Note;
  patientNote: Note;
}
export interface VisitsResponse {
  message: string;
  result: {
    data: Visit[];
    currentPage: number;
    limit: number;
    totalPages: number;
    totalRecords: number;
  }[];
}
export interface VisitParams {
  page?: number;
  limit?: number;
  service?: number;
  patient?: number;
  provider?: number;
  date?: string;
}
export interface VisitPayload {
  date: string;
  scheduledStartTime: string;
  scheduledEndTime: string;
  serviceId: number;
  patientId: number;
  addressId: number;
}

export interface ServiceZipCode {
  id: number;
  zipCode: string;
  city: City;
  service: Service;
}

export interface ServiceZipCodesResponse {
  message: string;
  result: {
    data: ServiceZipCode[];
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

  async getProviders(): Promise<ProvidersResponse> {
    const url = "providers";
    try {
      const response: AxiosResponse<ProvidersResponse> =
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

  async postProviders(param: ProviderPayload): Promise<ProvidersResponse> {
    const url = "providers";
    try {
      const response: AxiosResponse<ProvidersResponse> =
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

  async updateProviders(
    id: number,
    param: ProviderPayload
  ): Promise<ProvidersResponse> {
    const url = "providers/" + id.toString();

    try {
      const response: AxiosResponse<ProvidersResponse> =
        await this.instance.put(url, param);
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

  async deleteProviders(id: number): Promise<ProvidersResponse> {
    const url = "providers/" + id.toString();
    try {
      const response: AxiosResponse<ProvidersResponse> =
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

  async getProviderServices(providerId: number): Promise<ProvidersResponse> {
    const url = `providers/${providerId}/services`;
    try {
      const response: AxiosResponse<ProvidersResponse> =
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
  async getServiceZipCodes(): Promise<ServiceZipCodesResponse> {
    const url = "service-zip-codes";
    try {
      const response: AxiosResponse<ServiceZipCodesResponse> =
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

  async getVisits(params: VisitParams): Promise<VisitsResponse> {
    const urlParams = qs.stringify(pickBy(params, identity));
    const url = `visits?${urlParams}`;
    try {
      const response: AxiosResponse<VisitsResponse> = await this.instance.get(
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
  async postVisit(payload: VisitPayload): Promise<VisitsResponse> {
    const url = "visits";
    try {
      const response: AxiosResponse<VisitsResponse> = await this.instance.post(
        url,
        payload
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
  async updateVisit(
    id: number,
    payload: VisitPayload
  ): Promise<VisitsResponse> {
    const url = "visits/" + id.toString();

    try {
      const response: AxiosResponse<VisitsResponse> = await this.instance.put(
        url,
        payload
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

  async getPatients(): Promise<PatientsResponse> {
    const url = "patients";
    try {
      const response: AxiosResponse<PatientsResponse> = await this.instance.get(
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

  async getAddresses(): Promise<AddressesResponse> {
    const url = "addresses";
    try {
      const response: AxiosResponse<AddressesResponse> =
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

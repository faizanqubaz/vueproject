import HttpClient from "./HttpClient";
import axios, { AxiosResponse } from "axios";
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
export interface ProviderServicePayload {
  providerId: number;
  serviceId: number;
  cityId: number;
}
export interface ProviderServicesResponse {
  message: string;
  result: {
    city: { id: number };
    service: { id: number };
    provider: { id: number };
    id: number;
  };
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
export interface ServiceGroupPayload {
  name: string;
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
export interface PayPeriods {
  id: number;
  startDate: string;
  endDate: string;
  payDate: string;
}
export interface PayPeriodsResponse {
  message: string;
  result: {
    data: PayPeriods[];
    currentPage: number;
    limit: number;
    totalPages: number;
    totalRecords: number;
  }[];
}
export interface PayPeriodPayload {
  startDate: string;
  endDate: string;
  payDate: string;
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
  guardian: string;
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

export interface PatientCard {
  id: number;
  token: string;
  cvv: string;
  lastFour: string;
  expiration: string;
  zipCode: string;
}
export interface PatientCardResponse {
  message: string;
  result: PatientCard[];
}
export interface PatientInsurance {
  id: number;
  front: string;
  back: string;
}
export interface PatientInsuranceResponse {
  message: string;
  result: PatientInsurance[];
}
export interface PatientsDetailsResponse {
  message: string;
  result: Patient;
}
export interface PatientPayload {
  firstName?: string;
  middleName?: string;
  lastName?: string;
  dob?: string;
  gender?: string;
  phone?: string;
  email?: string;
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
export interface AddressCreatePayload {
  street: string;
  apartment?: string;
  city: string;
  state: string;
  zipCode: string;
  longitude: number;
  latitude: number;
  primary: boolean;
  guardianId?: number;
  patientId?: number;
  providerId?: number;
}
export interface AddressCreateResponse {
  message: string;
  result: {
    patient: { id: number };
    guardian: { id: number };
    provider: { id: number };
    street: string;
    apartment: string;
    city: string;
    state: string;
    zipCode: string;
    longitude: number;
    latitude: number;
    primary: boolean;
    id: number;
  };
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
export interface NoteIdResponse {
  id: number;
}
export interface NoteCreateResult {
  visit: NoteIdResponse;
  provider: NoteIdResponse;
  patient: NoteIdResponse;
  memo: string;
  id: number;
}
export interface NoteCreateResponse {
  message: string;
  result: NoteCreateResult;
}
export interface NoteCreatePayload {
  visitId: NoteIdResponse;
  patientId: NoteIdResponse;
  memo: string;
}

export interface NoteUpdateResult {
  id: number;
  memo: string;
  patient?: Patient;
  visit?: Visit;
  provider?: Provider;
}
export interface NoteUpdateResponse {
  message: string;
  result: NoteUpdateResult;
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
export interface VisitDetailsResponse {
  message: string;
  result: Visit;
}
export interface VisitParams {
  page?: number;
  limit?: number;
  service?: number;
  patient?: number;
  provider?: number;
  date?: string;
  sortOrder?: string;
}
export interface VisitPayload {
  date?: string;
  scheduledStartTime?: string;
  scheduledEndTime?: string;
  serviceId?: number;
  providerId?: number;
  payment?: number;
  startTime?: number;
  checkInTime?: string;
  checkOutTime?: string;
  status?: string;
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
export interface ServiceParams {
  page?: number;
  limit?: number;
}
export interface ServiceZipCodePayload {
  zipCode: string;
  serviceId: number;
  cityId: number;
}
export interface ServiceTimeSlot {
  id: number;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  enabled: boolean;
  capacity: number;
  startDate: string;
  endDate: string;
  city: City;
  service: Service;
}
export interface ServiceTimeSlotsResponse {
  message: string;
  result: {
    data: ServiceTimeSlot[];
    currentPage: number;
    limit: number;
    totalPages: number;
    totalRecords: number;
  }[];
}
export interface ServiceTimeSlotPayload {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  enabled: boolean;
  capacity: number;
  startDate: string;
  endDate: string;
  cityId: number;
  serviceId: number;
}

export interface DeleteResponse {
  message: string;
  result: null;
}

export interface GeneralResponse {
  message: string;
  result: any;
}

export interface ServiceResponseDetails {
  id: number;
  name: string;
  state: string;
  timeZone: string;
  active: boolean;
  serviceGroups: ServiceGroup[];
}

export interface ServiceResponse {
  message: string;
  result: ServiceResponseDetails;
}
export interface ProviderCoordinatesParams {
  visit: number;
  provider: number;
}
export interface ProviderCoordinatesResponse {
  message: string;
  result: ProviderCoordinatesResponseDetail;
}
export interface ProviderCoordinatesResponseDetail {
  id: number;
  longitude: string;
  latitude: string;
  timestamp: string;
}

export default class OMSApi extends HttpClient {
  constructor() {
    super(process.env.VUE_APP_WELZ_OMS_API);
  }

  async getServiceByZipcode(zipCode: string): Promise<ServiceResponse> {
    const url =
      process.env.VUE_APP_WELZ_BOOKING_API + "services?zipCode=" + zipCode;
    try {
      const response: AxiosResponse<ServiceResponse> = await axios.get(url);
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

  async getCityById(id: number): Promise<CitiesResponse> {
    const url = `cities/${id}`;
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

  async createCity(param: CityPayload): Promise<CitiesResponse> {
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

  async updateCity(id: number, param: CityPayload): Promise<CitiesResponse> {
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

  async deleteCity(id: number): Promise<CitiesResponse> {
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

  async getProviderById(id: number): Promise<ProvidersResponse> {
    const url = `providers/${id}`;
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

  async createProvider(param: ProviderPayload): Promise<ProvidersResponse> {
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

  async updateProvider(
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

  async deleteProvider(id: number): Promise<ProvidersResponse> {
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

  async getProviderCoordinates(
    params: ProviderCoordinatesParams
  ): Promise<ProviderCoordinatesResponse> {
    const urlParams = qs.stringify(pickBy(params, identity));
    const url = `provider-coordinates?${urlParams}`;
    try {
      const response: AxiosResponse<ProviderCoordinatesResponse> =
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

  async createAddress(
    address: AddressCreatePayload
  ): Promise<AddressCreateResponse> {
    const url = "addresses";
    try {
      const response: AxiosResponse<AddressCreateResponse> =
        await this.instance.post(url, address);
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

  async updateAddress(id: number, address: Address): Promise<GeneralResponse> {
    const url = `addresses/${id}`;
    try {
      const response: AxiosResponse<GeneralResponse> = await this.instance.put(
        url,
        address
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

  async deleteAddress(id: number): Promise<GeneralResponse> {
    const url = `addresses/${id}`;
    try {
      const response: AxiosResponse<GeneralResponse> =
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

  async createProviderService(
    service: ProviderServicePayload
  ): Promise<ProviderServicesResponse> {
    const url = "provider-services";
    try {
      const response: AxiosResponse<ProviderServicesResponse> =
        await this.instance.post(url, service);
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

  async updateProviderService(
    id: number,
    service: ProviderServicePayload
  ): Promise<GeneralResponse> {
    const url = `provider-services/${id}`;
    try {
      const response: AxiosResponse<GeneralResponse> = await this.instance.put(
        url,
        service
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

  async deleteProviderService(serviceId: number): Promise<DeleteResponse> {
    const url = `provider-services/${serviceId}`;
    try {
      const response: AxiosResponse<DeleteResponse> =
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

  async createService(param: ServicePayload): Promise<ServicesResponse> {
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
  async updateService(
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

  async deleteService(id: number): Promise<ServicesResponse> {
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

  async getPayPeriods(): Promise<PayPeriodsResponse> {
    const url = "payout-periods";
    try {
      const response: AxiosResponse<PayPeriodsResponse> =
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

  async createPayPeriod(param: PayPeriodPayload): Promise<PayPeriodsResponse> {
    const url = "payout-periods";
    try {
      const response: AxiosResponse<PayPeriodsResponse> =
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
  async updatePayPeriod(
    id: number,
    param: PayPeriodPayload
  ): Promise<PayPeriodsResponse> {
    const url = "payout-periods/" + id.toString();

    try {
      const response: AxiosResponse<PayPeriodsResponse> =
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
  async deletePayPeriod(id: number): Promise<PayPeriodsResponse> {
    const url = "payout-periods/" + id.toString();

    try {
      const response: AxiosResponse<PayPeriodsResponse> =
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
  async createServiceGroup(
    param: ServiceGroupPayload
  ): Promise<ServiceGroupsResponse> {
    const url = "service-groups";
    try {
      const response: AxiosResponse<ServiceGroupsResponse> =
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
  async updateServiceGroup(
    id: number,
    param: ServiceGroupPayload
  ): Promise<ServiceGroupsResponse> {
    const url = `service-groups/${id}`;

    try {
      const response: AxiosResponse<ServiceGroupsResponse> =
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
  async deleteServiceGroup(id: number): Promise<ServiceGroupsResponse> {
    const url = `service-groups/${id}`;

    try {
      const response: AxiosResponse<ServiceGroupsResponse> =
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

  async getServiceZipCodes(
    params: ServiceParams
  ): Promise<ServiceZipCodesResponse> {
    const urlParams = qs.stringify(pickBy(params, identity));
    const url = `service-zip-codes?${urlParams}`;
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
  async createServiceZipCode(
    payload: ServiceZipCodePayload
  ): Promise<ServiceZipCodesResponse> {
    const url = "service-zip-codes";
    try {
      const response: AxiosResponse<ServiceZipCodesResponse> =
        await this.instance.post(url, payload);
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
  async updateServiceZipCode(
    id: number,
    payload: ServiceZipCodePayload
  ): Promise<ServiceZipCodesResponse> {
    const url = "service-zip-codes/" + id.toString();

    try {
      const response: AxiosResponse<ServiceZipCodesResponse> =
        await this.instance.put(url, payload);
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
  async deleteServiceZipCode(id: number): Promise<ServiceZipCodesResponse> {
    const url = "service-zip-codes/" + id.toString();

    try {
      const response: AxiosResponse<ServiceZipCodesResponse> =
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

  async getVisitCount(params: VisitParams): Promise<VisitsResponse> {
    const urlParams = qs.stringify(pickBy(params, identity));
    const url = `visits/count?${urlParams}`;
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
  async cancelVisit(id: number): Promise<VisitsResponse> {
    const url = "visits/" + id.toString() + "/cancel";

    try {
      const response: AxiosResponse<VisitsResponse> = await this.instance.put(
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
  async getVisitDetails(id: number): Promise<VisitDetailsResponse> {
    const url = `visits/${id}`;
    try {
      const response: AxiosResponse<VisitDetailsResponse> =
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
  async assignVisit(
    id: number,
    payload: VisitPayload
  ): Promise<VisitDetailsResponse> {
    const url = `visits/${id}/assign`;
    try {
      const response: AxiosResponse<VisitDetailsResponse> =
        await this.instance.put(url, payload);
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
  async unassignVisit(
    id: number,
    payload: VisitPayload
  ): Promise<VisitDetailsResponse> {
    const url = `visits/${id}/unassign`;
    try {
      const response: AxiosResponse<VisitDetailsResponse> =
        await this.instance.put(url, payload);
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

  async getPatientCard(id: number): Promise<PatientCardResponse> {
    const url = `patients/${id}/card`;
    try {
      const response: AxiosResponse<PatientCardResponse> =
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

  async getPatientInsuranceFront(
    id: number
  ): Promise<PatientInsuranceResponse> {
    const url = `patients/${id}/insurance/front`;
    try {
      const response: AxiosResponse<PatientInsuranceResponse> =
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

  async getPatientInsuranceBack(id: number): Promise<PatientInsuranceResponse> {
    const url = `patients/${id}/insurance/back`;
    try {
      const response: AxiosResponse<PatientInsuranceResponse> =
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

  async addPatientInsurance(
    payload: PatientPayload
  ): Promise<PatientsResponse> {
    const url = `insurances`;
    try {
      const response: AxiosResponse<PatientsResponse> =
        await this.instance.post(url, payload);
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

  async addPatients(payload: PatientPayload): Promise<PatientsResponse> {
    const url = "patients";
    try {
      const response: AxiosResponse<PatientsResponse> =
        await this.instance.post(url, payload);
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

  async updatetPatients(
    id: number,
    payload: PatientPayload
  ): Promise<PatientsDetailsResponse> {
    const url = "patients/" + id;
    try {
      const response: AxiosResponse<PatientsDetailsResponse> =
        await this.instance.put(url, payload);
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

  async getServiceTimeSlots(): Promise<ServiceTimeSlotsResponse> {
    const url = "service-time-slots?limit=150";
    try {
      const response: AxiosResponse<ServiceTimeSlotsResponse> =
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
  async createServiceTimeSlot(
    payload: ServiceTimeSlotPayload
  ): Promise<ServiceTimeSlotsResponse> {
    const url = "service-time-slots";
    try {
      const response: AxiosResponse<ServiceTimeSlotsResponse> =
        await this.instance.post(url, payload);
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
  async updateServiceTimeSlot(
    id: number,
    payload: ServiceTimeSlotPayload
  ): Promise<ServiceTimeSlotsResponse> {
    const url = "service-time-slots/" + id.toString();

    try {
      const response: AxiosResponse<ServiceTimeSlotsResponse> =
        await this.instance.put(url, payload);
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
  async deleteServiceTimeSlot(id: number): Promise<ServiceTimeSlotsResponse> {
    const url = "service-time-slots/" + id.toString();

    try {
      const response: AxiosResponse<ServiceTimeSlotsResponse> =
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
  async createNote(payload: NoteCreatePayload): Promise<NoteCreateResponse> {
    const url = "notes";
    try {
      const response: AxiosResponse<NoteCreateResponse> =
        await this.instance.post(url, payload);
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
  async updateNote(id: number, memo: string): Promise<NoteUpdateResponse> {
    const url = "notes/" + id;
    try {
      const response: AxiosResponse<NoteUpdateResponse> =
        await this.instance.put(url, { memo: memo });
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

import HttpClient from './HttpClient'
import { AxiosResponse } from 'axios'

export interface Address {
  street: string;
  apartment: string;
  city: string;
  state: string;
  zipCode: string;
  longitude: number;
  latitude: number;
  primary: boolean;
}

export interface Patient {
    firstName: string;
    middleName: string;
    lastName: string;
    dob: string;
    gender: string;
    phone: string;
    email: string;
    address: Address;
}

export interface Account {
  visitId: number;
  firstName: string;
  lastName: string;
  dob: string;
  email: string;
  password: string;
}

export interface Visit {
  date: string;
  scheduledStartTime: string;
  scheduledEndTime: string;
  serviceId: number;
}

export interface Appointment {
  patient: Patient;
  visit: Visit;
  note: string;
}

export interface Service {
  id: number;
  name: string;
  description: string;
  price: number;
  active: boolean;
  image: string;
}

export interface ServiceGroup {
  id: number;
  image: string;
  name: string;
  services: Service[];
}

export interface TimeSlot {
  id: number;
  startTime: string;
  endTime: string;
  enabled: boolean;
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

export interface Symptom {
  id: number;
  description: string;
  icon: string;
}

export interface SymptomsResponse {
  message: string;
  result: Symptom[];
}

export interface AppointmentTimeSlotResponse {
  message: string;
  result: TimeSlot[];
}

export interface AppointmentResponse {
  message: string;
  result: {
    id: number,
    date: string,
    scheduledStartTime: string,
    scheduledEndTime: string,
    status: string
  };
}

export interface AccountResponse {
  message: string;
  result: any[];
}

export interface VisitsResponse {
  message: string;
  result: {
    data: [];
    currentPage: number;
    limit: number;
    totalPages: number;
    totalRecords: number;
  };
}

export default class BookingApiClient extends HttpClient {
  constructor () {
    super(process.env.VUE_APP_WELZ_BOOKING_API)
  }

  async getService (zipCode: string): Promise<ServiceResponse> {
    const url = 'services?zipCode=' + zipCode
    try {
      const response: AxiosResponse<ServiceResponse> = await this.instance.get(url)
      const { status } = response
      if (status === 200) {
        const { data } = response
        return data
      } else {
        return Promise.reject(new Error())
      }
    } catch (error) {
      return Promise.reject(error)
    }
  }

  async getSymptoms (serviceId: number): Promise<SymptomsResponse> {
    const url = 'symptoms?service=' + serviceId
    try {
      const response: AxiosResponse<SymptomsResponse> = await this.instance.get(url)
      const { status } = response
      if (status === 200) {
        const { data } = response
        return data
      } else {
        return Promise.reject(new Error())
      }
    } catch (error) {
      return Promise.reject(error)
    }
  }

  async getServiceTimeSlots (date: string, cityId: number, serviceId: number): Promise<AppointmentTimeSlotResponse> {
    const url = '/service-time-slots?date=' + date + '&city=' + cityId + '&service=' + serviceId
    try {
      const response: AxiosResponse<AppointmentTimeSlotResponse> = await this.instance.get(url)
      const { status } = response
      if (status === 200) {
        const { data } = response
        return data
      } else {
        return Promise.reject(new Error())
      }
    } catch (error) {
      return Promise.reject(error)
    }
  }

  async createAppointment (appointment: Appointment): Promise<AppointmentResponse> {
    const url = '/appointments'
    try {
      const response: AxiosResponse<AppointmentResponse> = await this.instance.post(url, appointment)
      const { status } = response
      if (status === 201) {
        const { data } = response
        return data
      } else {
        return Promise.reject(new Error())
      }
    } catch (error) {
      return Promise.reject(error)
    }
  }

  async createAccount (account: Account): Promise<AccountResponse> {
    const url = '/accounts'
    try {
      const response: AxiosResponse<AccountResponse> = await this.instance.post(url, account)
      const { status } = response
      if (status === 201) {
        const { data } = response
        return data
      } else {
        return Promise.reject(new Error())
      }
    } catch (error) {
      return Promise.reject(error)
    }
  }

  async getVisits (token: string): Promise<VisitsResponse> {
    const url = '/visits'
    const config = {
      headers: {
        Authorization: 'Bearer ' + token
      }
    }
    try {
      const response: AxiosResponse<VisitsResponse> = await this.instance.get(url, config)
      const { status } = response
      if (status === 200) {
        const { data } = response
        return data
      } else {
        return Promise.reject(new Error())
      }
    } catch (error) {
      return Promise.reject(error)
    }
  }

  async cancelVisit (id: number, token: string): Promise<VisitsResponse> {
    const url = '/visits/' + id + '/cancel'
    const config = {
      headers: {
        Authorization: 'Bearer ' + token
      }
    }
    try {
      const response: AxiosResponse<VisitsResponse> = await this.instance.put(url, {}, config)
      const { status } = response
      if (status === 200) {
        const { data } = response
        return data
      } else {
        return Promise.reject(new Error())
      }
    } catch (error) {
      return Promise.reject(error)
    }
  }
}

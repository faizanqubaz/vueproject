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
}

export interface ServiceGroup {
  id: number;
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

export interface AppointmentTimeSlotResponse {
  message: string;
  result: TimeSlot[];
}

export interface AppointmentResponse {
  message: string;
  result: any[];
}

export default class BookingApiClient extends HttpClient {
  constructor () {
    super('https://booking-api-dev.welz.com/api/v1/')
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
}

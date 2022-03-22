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
  startTime: string;
  endTime: string;
  serviceId: number;
}

export interface Appointment {
  patient: Patient;
  visit: Visit;
  note: string;
}

export interface ServiceType {
  id: number;
  name: string;
  description: string;
  price: number;
  active: boolean;
}

export interface Service {
  id: number;
  name: string;
  services: ServiceType[];
}

export interface TimeSlot {
  id: number;
  startTime: string;
  endTime: string;
  enabled: boolean;
}

export interface ServiceResponse {
  message: string;
  result: Service[];
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
    super('http://booking-api-dev.welz.com/api/v1/')
  }

  async getService (zipCode: string): Promise<ServiceResponse> {
    const url = 'services?zip=' + zipCode
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

  async getServiceTimeSlots (date: Date, zipCode: string, serviceId: number): Promise<AppointmentTimeSlotResponse> {
    const url = '/service-time-slots?date=' + date + '&zip=' + zipCode + '&service=' + serviceId
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

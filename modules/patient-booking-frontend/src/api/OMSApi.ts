import HttpClient from './HttpClient'
import { AxiosResponse } from 'axios'
import qs from 'query-string'
import { pickBy, identity } from 'lodash'

export interface ServiceGroup {
  id: number;
  name: string;
}
export interface Service {
  id: number;
  name: string;
  description: string;
  price: string;
  active: boolean;
  group: ServiceGroup;
}
export interface Visit {
  id: number;
  date: string;
  scheduledStartTime: string;
  scheduledEndTime: string;
  service: Service;
  status: string;
}
export interface UserDetails {
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
export interface VisitDetailsResponse {
  message: string;
  result: Visit;
}
export interface UserDetailsResponse {
  message: string;
  result: UserDetails;
}
export interface VisitParams {
  page?: number;
  limit?: number;
  sortOrder?: string;
}
export interface UserDetailsParams {
  authID?: string;
}

export default class OMSApi extends HttpClient {
  constructor () {
    super(process.env.VUE_APP_WELZ_OMS_API)
  }

  async getVisits (params: VisitParams): Promise<VisitsResponse> {
    const urlParams = qs.stringify(pickBy(params, identity))
    const url = process.env.VUE_APP_WELZ_OMS_API + `visits?${urlParams}`
    try {
      const response: AxiosResponse<VisitsResponse> = await this.instance.get(
        url
      )
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

  async getVisitDetails (id: number): Promise<VisitDetailsResponse> {
    const url = `visits/${id}`
    try {
      const response: AxiosResponse<VisitDetailsResponse> = await this.instance.get(url)
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

  async cancelVisit (id: number): Promise<VisitsResponse> {
    const url = process.env.VUE_APP_WELZ_OMS_API + `visits/${id.toString()}/cancel`
    try {
      const response: AxiosResponse<VisitsResponse> = await this.instance.put(url)
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

  async getUserDetails (params: UserDetailsParams): Promise<UserDetailsResponse> {
    const urlParams = pickBy(params, identity)
    const url = process.env.VUE_APP_WELZ_OMS_API + `patients/auth/${urlParams.authID}`
    try {
      const response: AxiosResponse<UserDetailsResponse> = await this.instance.get(
        url
      )
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

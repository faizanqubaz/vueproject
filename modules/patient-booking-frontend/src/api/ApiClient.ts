import HttpClient from './HttpClient'

export default class BookingApiClient {
  private instance: HttpClient;
  constructor () {
    this.instance = new HttpClient('https://api.welz.com/api/v1')
  }
}

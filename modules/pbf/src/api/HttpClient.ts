import axios, { AxiosInstance } from "axios";

class HttpClient {
  protected instance: AxiosInstance;
  constructor(baseURL: string, timeout = 30000) {
    this.instance = axios.create({
      baseURL,
      timeout,
    });

    this.instance.interceptors.request.use(
      (config) => {
        config.headers = { ...config.headers, "Cache-Control": "no-cache" };
        return config;
      },
      (error) => {
        Promise.reject(error);
      }
    );

    this.instance.interceptors.response.use(
      (response) => response,
      (error) => {
        return Promise.reject(error);
      }
    );
  }
}

export default HttpClient;

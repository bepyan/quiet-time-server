import AxiosRequestConfig from 'axios';

declare module 'axios' {
  export interface AxiosRequestConfig {
    responseEncoding?: string;
  }
}

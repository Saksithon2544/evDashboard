import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

const instance = axios.create({
  baseURL: 'https://api.example.com',
  timeout: 10000,
});

instance.interceptors.request.use(
    // @ts-ignore
    (config: AxiosRequestConfig) => {
       
        return config;
    },
    (error) => {
       
        return Promise.reject(error);
    }
);

instance.interceptors.response.use(
  (response: AxiosResponse) => {
    
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);


export default instance;
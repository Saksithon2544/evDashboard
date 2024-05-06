import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

const API_URL = 'http://localhost/page/api/';

const Axios = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});


Axios.interceptors.request.use(
    // @ts-ignore
  (config: AxiosRequestConfig) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
  },
  (error: any) => Promise.reject(error)
);

export default Axios;

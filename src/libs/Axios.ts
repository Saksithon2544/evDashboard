import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

// Define API URL
// const API_URL = "https://ecocharge-backend-production-0bb7.up.railway.app";
// const API_URL = "https://ecocharge.azurewebsites.net";
const API_URL = "http://localhost:8000";

const Axios = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

Axios.interceptors.request.use((config: any) => {
  const access_token = localStorage.getItem("access_token");
  const token_type = localStorage.getItem("token_type");
  if (access_token) {
    config.headers.Authorization = `${token_type} ${access_token}`;
    // console.log(config);
  }
  return config;
});

export default Axios;

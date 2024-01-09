import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

const API_URL = 'http://localhost:3000/api';

// Create a global Axios instance with default settings
const Axios = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

// Add response interceptors to handle 401 and 403 errors
Axios.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: any) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      // Handle unauthorized and forbidden errors here (e.g., redirect to login page)
      handleUnauthorizedOrForbiddenError();
    }

    return Promise.reject(error);
  }
);

// Function to handle unauthorized and forbidden errors
function handleUnauthorizedOrForbiddenError() {
  // Remove the token from local storage
  localStorage.removeItem('access_token');
  
  // Redirect to the login page (adjust the URL as needed)
  window.location.href = '/login';
}

// Add request interceptor to include authorization headers if a token is present in local storage
Axios.interceptors.request.use(
  // @ts-ignore
  (config: AxiosRequestConfig) => {
    const token = localStorage.getItem('access_token');
    // if (token) {
    //   config.headers['Authorization'] = `Bearer ${token}`;
    // }

    return config;
  },
  (error: any) => Promise.reject(error)
);

// Export the Axios instance
export default Axios;

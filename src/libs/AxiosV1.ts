import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

const API_URL = 'http://localhost/api/v1';

const Axios = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

Axios.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: any) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      handleUnauthorizedOrForbiddenError();
    }

    return Promise.reject(error);
  }
);

function handleUnauthorizedOrForbiddenError() {
  const username = 'admin@gmail.com'; // เช่น "user123"
  const token = 'your_access_token'; // เช่น "your_access_token"

  // จำลองการล็อกอินสำเร็จโดยเก็บ token ใน localStorage
  localStorage.setItem('access_token', token);
  localStorage.setItem('username', username);

  // หลังจากล็อกอินสำเร็จ คุณสามารถเรียกไปยังหน้าหลักหรือหน้าอื่นๆ ของแอปพลิเคชันของคุณ
  // window.location.href = '/home'; // ตัวอย่างการ redirect ไปยังหน้าหลัก
}

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

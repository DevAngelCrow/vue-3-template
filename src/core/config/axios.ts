import axios, { type AxiosInstance } from 'axios';

const API_BASE_URL =
  `${import.meta.env.VITE_VUE_APP_API_URL}/api` || 'http://localhost:8000/api';

const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  // headers: {
  // },
  timeout: 10000,
});
export default axiosInstance;

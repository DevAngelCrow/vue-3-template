import axios, { type AxiosInstance } from 'axios';

import { useAuthStore } from '../store/useAuthStore';

const { token } = useAuthStore();
const API_BASE_URL = import.meta.env.VITE_VUE_APP_API_URL
  ? `${import.meta.env.VITE_VUE_APP_API_URL}/api`
  : 'http://localhost:8000/api';

const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Authorization: `Bearer ${token}`,
  },
  timeout: 15000,
});
export default axiosInstance;

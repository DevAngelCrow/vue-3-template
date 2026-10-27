import axios, { type AxiosInstance } from 'axios';

export const API_BASE_URL = import.meta.env.VITE_VUE_APP_API_URL
  ? `${import.meta.env.VITE_VUE_APP_API_URL}/api/v1`
  : 'http://localhost:3000/api/v1';

const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  // Required so the browser stores/sends the HttpOnly refresh_token cookie
  // on cross-origin requests (frontend and API run on different ports).
  withCredentials: true,
});
export default axiosInstance;

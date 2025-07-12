import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from 'axios';
import { AxiosHeaders } from 'axios';

import axiosInstance from '../config/axios';
import type {
  ErrorResponse,
  SuccessResponse,
} from '../interfaces/httpClient.interface';
import { useAlertStore } from '../store';
const alert = useAlertStore();
// Función para configurar los interceptores y envolver la instancia de Axios
const setupHttpClient = (api: AxiosInstance) => {
  // Configurar interceptores de petición
  api.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token');
      if (token) {
        if (!config.headers) {
          config.headers = AxiosHeaders.from({});
        }
        config.headers.set('Authorization', `Bearer ${token}`);
      }
      return config;
    },
    (error: AxiosError) => {
      return Promise.reject(error);
    },
  );

  // Configurar interceptores de respuesta
  api.interceptors.response.use(
    (response: AxiosResponse) => {
      return response;
    },
    (error: AxiosError<ErrorResponse>) => {
      if (error.response) {
        const responseData = error.response.data || {};
        const errorData: ErrorResponse = {
          message: responseData.message || 'Error en la respuesta del servidor',
          statusCode: error.response.status,
          errors: responseData.errors,
        };
        console.error('Error de respuesta:', errorData);

        if (error.response.status === 401) {
          localStorage.removeItem('token');
          // Aquí se utilizará el router push
        }
        console.log(error.response);

        alert.showAlert({
          type: 'error',
          title: `${error.response.status} ${error.response.statusText}`,
          content: error.message,
        });

        return Promise.reject(errorData);
      } else if (error.request) {
        const errorData: ErrorResponse = {
          message:
            'No se recibió respuesta del servidor. Verifica tu conexión a internet.',
        };
        console.error('Error de red:', errorData);
        return Promise.reject(errorData);
      } else {
        const errorData: ErrorResponse = {
          message:
            error.message || 'Error desconocido al configurar la petición.',
        };
        console.error('Error de configuración de la petición:', errorData);
        return Promise.reject(errorData);
      }
    },
  );

  return {
    get: <T>(url: string, config?: AxiosRequestConfig) =>
      api.get<T>(url, config) as Promise<SuccessResponse<T>>,
    post: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
      api.post<T>(url, data, config) as Promise<SuccessResponse<T>>,
    put: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
      api.put<T>(url, data, config) as Promise<SuccessResponse<T>>,
    delete: <T>(url: string, config?: AxiosRequestConfig) =>
      api.delete<T>(url, config) as Promise<SuccessResponse<T>>,
    patch: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
      api.patch<T>(url, data, config) as Promise<SuccessResponse<T>>,
    instance: api,
  };
};

// Exportamos la instancia de httpClient ya configurada con los interceptores
export const httpClient = setupHttpClient(axiosInstance);

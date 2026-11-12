import type { AxiosRequestConfig, AxiosResponseHeaders } from 'axios';

export interface HttpClientRequestConfig extends AxiosRequestConfig {
  /** Si es true, omite la alerta global en respuestas HTTP de error (excepto 401/403). */
  skipGlobalAlert?: boolean;
  /** Lista opcional de códigos de error (`code` / `errorCode`) que omiten la alerta global. */
  skipErrorCodes?: string[];
}

export interface SuccessResponse<T> {
  data: T;
  status: number;
  statusText: string;
  headers: AxiosResponseHeaders;
  config: HttpClientRequestConfig;
  request?: unknown;
}

export interface ErrorResponse {
  message: string;
  statusCode?: number;
  errors?: unknown;
  code?: string;
  errorCode?: string;
  error?: string;
}

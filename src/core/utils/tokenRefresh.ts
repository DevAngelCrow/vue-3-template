import axios from 'axios';

import { API_BASE_URL } from '../config/axios';
import { useAuthStore } from '../store/useAuthStore';
import type { ApiResponseLogin } from '../services/interfaces/auth/apiResponseLogin.interface';

// Dedicated client WITHOUT interceptors: a 401 from the refresh endpoint must
// never trigger another refresh (infinite loop).
const refreshClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  withCredentials: true,
});

let refreshPromise: Promise<string | null> | null = null;

/**
 * Requests a new access token using the HttpOnly refresh_token cookie.
 * Single-flight: concurrent callers share the same in-flight request, so a
 * burst of 401s results in exactly one refresh (and one cookie rotation).
 * Resolves with the new access token, or null if the session is gone.
 */
export const refreshAccessToken = (): Promise<string | null> => {
  if (!refreshPromise) {
    refreshPromise = refreshClient
      .post<ApiResponseLogin>('auth/refresh-token')
      .then(({ data }) => {
        const payload = data?.data;
        if (!payload?.access_token) return null;
        useAuthStore().setSession(payload);
        return payload.access_token;
      })
      .catch(() => null)
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
};

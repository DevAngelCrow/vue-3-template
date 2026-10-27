// src/modules/auth/composables/useLogin.ts
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useMutation } from '@tanstack/vue-query';

import authServices from '@/core/services/auth.services';
import { loadSessionMenu } from '@/core/services/session.services';
import { useAuthStore } from '@/core/store/useAuthStore';
import type { Login } from '@/core/services/interfaces/auth/login.interface';
import type { ApiResponseLogin } from '@/core/services/interfaces/auth/apiResponseLogin.interface';

export function useLogin() {
  const router = useRouter();
  const route = useRoute();
  const { setSession } = useAuthStore();

  const error = ref<string | null>(null);

  const loginMutation = useMutation({
    mutationFn: async (credentials: Login): Promise<ApiResponseLogin> => {
      return authServices.login(credentials);
    },
    onSuccess: async (response: ApiResponseLogin) => {
      const loginData = response?.data;
      if (loginData?.access_token) {
        // Access token solo en memoria. El refresh token llega en una cookie
        // HttpOnly (Set-Cookie) que JavaScript no puede leer.
        setSession(loginData);

        await loadSessionMenu();

        const redirectTo = (route.query.redirect as string) || '/';
        router.push(redirectTo);
      } else {
        throw new Error('No se recibió el token de autenticación');
      }
    },
    onError: (err: any) => {
      console.error('Error en el login:', err);
      error.value =
        err?.message ||
        (err instanceof Error ? err.message : 'Error desconocido en el login');
    },
  });

  const isLoading = computed(() => loginMutation.isPending.value);

  const login = async (user: string, password: string) => {
    error.value = null;
    try {
      await loginMutation.mutateAsync({
        user_name: user,
        password: password,
      });
    } catch {
      // El error se gestiona reactivamente en onError
    }
  };

  return {
    login,
    isLoading,
    error,
    loginMutation,
  };
}

export default useLogin;

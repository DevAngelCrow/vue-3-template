// src/modules/auth/composables/useLogin.ts
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useMutation } from '@tanstack/vue-query';

import authServices from '@/core/services/auth.services';
import { useAuthStore } from '@/core/store/useAuthStore';
import type { Login } from '@/core/services/interfaces/auth/login.interface';
import type { ApiResponseLogin } from '@/core/services/interfaces/auth/apiResponseLogin.interface';
import type { UserStateStore } from '@/core/interfaces/userState.store.interface';

export function useLogin() {
  const router = useRouter();
  const route = useRoute();
  const {
    setToken,
    setUserInfo,
    setTokenType,
    setRefreshToken,
    setMenu,
    setProfileImg,
  } = useAuthStore();

  const error = ref<string | null>(null);

  const loginMutation = useMutation({
    mutationFn: async (credentials: Login): Promise<ApiResponseLogin> => {
      return authServices.login(credentials);
    },
    onSuccess: async (response: ApiResponseLogin) => {
      const loginData = response?.data;
      if (loginData?.access_token) {
        setToken(loginData);

        if (loginData.refresh_token) {
          setRefreshToken({ refresh_token: loginData.refresh_token });
        }

        const userPayload = (typeof loginData.user === 'object' &&
        loginData.user !== null
          ? loginData.user
          : loginData) as unknown as UserStateStore;

        if (userPayload?.id || (loginData as any)?.id) {
          setUserInfo(userPayload);
        }

        if (loginData.token_type) {
          setTokenType(loginData.token_type);
        }

        try {
          const menu = await authServices.getMenu();
          if (menu.statusCode === 200 && menu.data) {
            setMenu(menu.data.menus);
            setProfileImg(menu.data.profile_img);
            localStorage.setItem('menu', JSON.stringify(menu.data.menus));
          }
        } catch (menuError) {
          console.warn('No se pudo cargar el menú tras el login:', menuError);
        }

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

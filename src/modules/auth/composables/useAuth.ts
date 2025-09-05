// composables/useAuth.ts
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';

export function useAuth() {
  //personal info
  const firstName = ref<string>('');
  const middleName = ref<string>('');
  const lastName = ref<string>('');
  const birthDate = ref<string>('');
  const gender = ref<number>();
  const maritalStatus = ref<number>();
  const imgFile = ref<File | null>();
  const phoneNumber = ref<string>();
  const status = ref<number>();
  const nationalities = ref<number[]>();

  //address info

  const street = ref<string>();
  const streetNumber = ref<string>();
  const neighborhood = ref<string>();
  const district = ref<number>();
  const houseNumber = ref<string>();
  const block = ref<string>();
  const pathway = ref<string>();
  const current = ref<boolean>(false);

  //personal document info

  const documentType = ref<number>();
  const documentNumber = ref<string>();

  //user info

  const email = ref<string>('');
  const password = ref<string>();

  const router = useRouter();
  const route = useRoute();
  const isLoading = ref(false);
  const isLoggingOut = ref();
  const error = ref<string | null>(null);
  const API_URL =
    import.meta.env.VITE_VUE_APP_API_URL || 'http://127.0.0.1:8000';

  const login = async (user: string, password: string) => {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          user_name: user,
          password: password,
        }),
      });

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ message: 'Error en el servidor' }));

        if (response.status === 401) {
          throw new Error(errorData.message || 'Credenciales incorrectas');
        }

        throw new Error(
          errorData.message ||
            `Error ${response.status}: ${response.statusText}`,
        );
      }

      const data = await response.json();

      if (data.access_token) {
        localStorage.setItem('auth_token', data.access_token);

        if (data.user) {
          localStorage.setItem('user', JSON.stringify(data.user));
        }

        if (data.token_type) {
          localStorage.setItem('token_type', data.token_type);
        }
        const redirectTo = (route.query.redirect as string) || '/';
        router.push(redirectTo);
      } else {
        throw new Error('No se recibió el token de autenticación');
      }
    } catch (err) {
      console.error('Error en el login:', err);
      error.value =
        err instanceof Error ? err.message : 'Error desconocido en el login';
    } finally {
      isLoading.value = false;
    }
  };

  const logout = async () => {
    isLoggingOut.value = true;
    try {
      const token = localStorage.getItem('auth_token');
      const tokenType = localStorage.getItem('token_type') || 'Bearer';

      if (token) {
        await fetch(`${API_URL}/api/auth/logout`, {
          method: 'POST',
          headers: {
            Authorization: `${tokenType} ${token}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        }).catch(() => {
          console.warn('No se pudo notificar al servidor sobre el logout');
        });
      }
    } catch (error) {
      console.error('Error durante logout:', error);
    } finally {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('token_type');
      localStorage.removeItem('user');
      router.push('/login');
    }
  };

  const isAuthenticated = (): boolean => {
    const token = localStorage.getItem('auth_token');
    return !!token;
  };

  const getCurrentUser = () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  };

  const getToken = () => {
    return localStorage.getItem('auth_token');
  };

  const getAuthHeader = () => {
    const token = localStorage.getItem('auth_token');
    const tokenType = localStorage.getItem('token_type') || 'Bearer';
    return token ? `${tokenType} ${token}` : null;
  };

  return {
    login,
    logout,
    isAuthenticated,
    getCurrentUser,
    getToken,
    getAuthHeader,
    isLoading,
    error,
    firstName,
    middleName,
    lastName,
    birthDate,
    gender,
    email,
    maritalStatus,
    imgFile,
    phoneNumber,
    status,
    nationalities,
    street,
    streetNumber,
    neighborhood,
    district,
    houseNumber,
    block,
    pathway,
    current,
    documentType,
    documentNumber,
    password,
  };
}

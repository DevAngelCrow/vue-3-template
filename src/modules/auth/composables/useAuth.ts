// composables/useAuth.ts
import { nextTick, ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useForm } from 'vee-validate';
import * as yup from 'yup';

import { emailFormat, passwordValidation } from '@/core/utils/validationRules';
import { useAlertStore } from '@/core/store';
import authServices from '@/core/services/auth.services';
import { sanitizedValueInput } from '@/core/utils/inputTextValidations';
import { useAuthStore } from '@/core/store/useAuthStore';

export function useAuth() {
  const { setToken, setUserInfo, setTokenType, setRefreshToken, setMenu } =
    useAuthStore();
  const alert = useAlertStore();
  const router = useRouter();
  const route = useRoute();
  const isLoading = ref(false);
  const isLoggingOut = ref(false);
  const error = ref<string | null>(null);
  const API_URL =
    import.meta.env.VITE_VUE_APP_API_URL || 'http://127.0.0.1:8000';

  const form = useForm({
    validationSchema: yup.object({
      email: emailFormat(undefined, true, undefined),
      password: passwordValidation(),
    }),
  });

  const [email, emailAttrs] = form.defineField('email');
  const [password, passwordAttrs] = form.defineField('password');

  const login = async (user: string, password: string) => {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await fetch(`${API_URL}/api/v1/auth/login`, {
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
      if (data.data.access_token) {
        setToken(data.data);
        if (data.data.refresh_token) {
          setRefreshToken(data.data);
        }
        if (data.data.user) {
          setUserInfo(data.data.user);
        }

        if (data.data.token_type) {
          setTokenType(data.data.token_type);
        }

        const menu = await authServices.getMenu();

        if (menu.statusCode === 200) {
          setMenu(menu.data);
          localStorage.setItem('menu', JSON.stringify(menu.data));
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
      const token = localStorage.getItem('access_token');
      const refreshToken = localStorage.getItem('refresh_token');
      const tokenType = localStorage.getItem('token_type') || 'Bearer';

      if (token) {
        await fetch(`${API_URL}/api/v1/auth/logout`, {
          method: 'POST',
          headers: {
            Authorization: `${tokenType} ${refreshToken}`,
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
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('token_type');
      localStorage.removeItem('user');
      localStorage.removeItem('menu');
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

  // Eliminar duplicado y dejar solo una función useAuth y registerUser

  const registerUser = async (data: { email: string; password: string }) => {
    try {
      // Crear FormData y agregar solo email y password
      const form = new FormData();
      form.append('email', data.email);
      form.append('password', data.password);
      const response = await authServices.signUp(form);
      // Manejar respuesta genérica
      if (response.status === 201) {
        alert.showAlert({
          type: 'success',
          title: 'Registro exitoso',
          content: 'El usuario ha sido registrado correctamente',
        });
        router.push('/login');
      } else {
        let errorMsg = 'No se pudo registrar el usuario';
        if (
          response.data &&
          typeof response.data === 'object' &&
          'message' in response.data
        ) {
          errorMsg = (response.data as any).message || errorMsg;
        }
        alert.showAlert({
          type: 'error',
          title: 'Error en el registro',
          content: errorMsg,
        });
      }
    } catch (error) {
      console.error(error);
      alert.showAlert({
        type: 'error',
        title: `Error en el registro del usuario`,
        content: 'Ocurrió un error al momento del registro del usuario',
      });
    }
  };

  // Declarar validationInputEmail para evitar error de propiedad no encontrada
  const validationInputEmail = (
    value: string,
    input: string,
    regex: RegExp = /[^a-zA-Z0-9._%+\-@]/g,
  ) => {
    const sanitizedValue = sanitizedValueInput(value, regex);
    nextTick(() => {
      form?.setFieldValue(input, sanitizedValue);
    });
  };

  const validationInputAlphanumeric = (
    value: string,
    input: string,
    regex: RegExp = /[^a-zA-ZáÁéÉíÍóÓúÚñÑ@.0-9 ]/g,
  ) => {
    const sanitizedValue = sanitizedValueInput(value, regex);
    nextTick(() => {
      form?.setFieldValue(input, sanitizedValue);
    });
  };

  const validationInputPassword = (
    value: string,
    input: string,
    regex: RegExp = /[^a-zA-ZáÁéÉíÍóÓúÚñÑ@.0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]*$/,
  ) => {
    let sanitizedValue: string | undefined = sanitizedValueInput(value, regex);
    nextTick(() => {
      form?.setFieldValue(input, sanitizedValue);
    });
  };

  return {
    ...form,
    login,
    logout,
    isAuthenticated,
    getCurrentUser,
    getToken,
    getAuthHeader,
    isLoading,
    error,
    registerUser,
    validationInputAlphanumeric,
    validationInputEmail,
    validationInputPassword,
    email,
    emailAttrs,
    password,
    passwordAttrs,
  };
}

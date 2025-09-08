// composables/useAuth.ts
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useForm } from 'vee-validate';
import * as yup from 'yup';

import { emailFormat, passwordValidation } from '@/core/utils/validationRules';
import { PrimeVueFile } from '@/types/PrimeVueFile';

import { NationalitiesArray } from '../interfaces/nationalitiesArray.interface';
import { DistrictsModelAutocomplete } from '../interfaces/districtsArray.interface';

function createForm() {
  const { errors, defineField, handleSubmit, validateField } = useForm({
    validationSchema: yup.object({
      //personal info
      firstName: yup
        .string()
        .required('El primer nombre es requerido')
        .min(3, 'El nombre debe tener al menos 3 caracteres'),
      middleName: yup
        .string()
        .min(3, 'El segundo nombre debe tener al menos 3 caracteres'),
      lastName: yup
        .string()
        .required('El apellido es requerido')
        .min(3, 'El apellido debe tener al menos 3 caracteres'),
      birthDate: yup.date().required('La fecha de nacimiento es requerida'),
      gender: yup.number().required('El género es requerido'),
      maritalStatus: yup.number().required('El estado civil es requerido'),
      phoneNumber: yup
        .string()
        .required('El número de teléfono es requerido')
        .min(9)
        .max(9),
      status: yup.number() /*.required('El campo de estado es requerido')*/,
      nationalities: yup
        .array<NationalitiesArray>()
        .required('El campo de nacionalidades es requerido')
        .min(1, 'Debes agregar al menos una nacionalidad'),
      imgFile: yup
        .mixed<PrimeVueFile[]>()
        .required('La imágen de del perfil es requerida')
        .test('fileSize', 'El tamaño de la imágen es muy grande', value => {
          if (!value) return false;
          return value[0].size <= 1000000;
        })
        .test('fileType', 'Formato no permitido', value => {
          if (!value) return false;
          return ['image/jpeg', 'image/png', 'image/jpg'].includes(
            value[0].type,
          );
        }),
      //address info
      street: yup
        .string()
        .required('El campo de nombre de calle es requerido')
        .min(3),
      streetNumber: yup
        .string()
        .required('El campo de número de calle es requerido')
        .min(3),
      neighborhood: yup
        .string()
        .required('El campo de colonia/reparto es requerido')
        .min(5),
      district: yup
        .mixed<DistrictsModelAutocomplete>()
        .required('El campo de distrito es requerido'),
      houseNumber: yup
        .string()
        .required('El campo de numero de casa es requerido')
        .min(1),
      block: yup.string().required('El campo del block es requerido').min(1),
      pathway: yup.string().required('El campo de pasaje es requerido').min(1),
      current: yup.boolean(),

      //personal document info

      documentType: yup.number().required('El tipo del documento es requerido'),
      documentNumber: yup
        .string()
        .required('El número del documento es requerido')
        .min(1),
      //user info
      email: emailFormat(undefined, true, undefined),
      password: passwordValidation(),
      userName: yup.string().required('El nombre del usuario es requerido'),
    }),
  });

  return {
    errors,
    handleSubmit,
    validateField,
    firstName: defineField('firstName')[0],
    firstNameAttrs: defineField('firstName')[1],
    middleName: defineField('middleName')[0],
    middleNameAttrs: defineField('middleName')[1],
    lastName: defineField('lastName')[0],
    lastNameAttrs: defineField('lastName')[1],
    birthDate: defineField('birthDate')[0],
    birthDateAttrs: defineField('birthDate')[1],
    gender: defineField('gender')[0],
    genderAttrs: defineField('gender')[1],
    maritalStatus: defineField('maritalStatus')[0],
    maritalStatusAttrs: defineField('maritalStatus')[1],
    phoneNumber: defineField('phoneNumber')[0],
    phoneNumberAttrs: defineField('phoneNumber')[1],
    status: defineField('status')[0],
    statusAttrs: defineField('status')[1],
    nationalities: defineField('nationalities')[0],
    nationalitiesAttrs: defineField('nationalities')[1],
    imgFile: defineField('imgFile')[0],
    imgFileAttrs: defineField('imgFile')[1],
    street: defineField('street')[0],
    streetAttrs: defineField('street')[1],
    streetNumber: defineField('streetNumber')[0],
    streetNumberAttrs: defineField('streetNumber')[1],
    neighborhood: defineField('neighborhood')[0],
    neighborhoodAttrs: defineField('neighborhood')[1],
    district: defineField('district')[0],
    districtAttrs: defineField('district')[1],
    houseNumber: defineField('houseNumber')[0],
    houseNumberAttrs: defineField('houseNumber')[1],
    block: defineField('block')[0],
    blockAttrs: defineField('block')[1],
    pathway: defineField('pathway')[0],
    pathwayAttrs: defineField('pathway')[1],
    current: defineField('current')[0],
    currentAttrs: defineField('current')[1],
    documentType: defineField('documentType')[0],
    documentTypeAttrs: defineField('documentType')[1],
    documentNumber: defineField('documentNumber')[0],
    documentNumberAttrs: defineField('documentNumber')[1],
    email: defineField('email')[0],
    emailAttrs: defineField('email')[1],
    password: defineField('password')[0],
    passwordAttrs: defineField('password')[1],
    userName: defineField('userName')[0],
    userNameAttrs: defineField('userName')[1],
  };
}

let form: ReturnType<typeof createForm> | null = null;

export function useAuth() {
  if (!form) {
    form = createForm();
  }

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
    ...form,
  };
}

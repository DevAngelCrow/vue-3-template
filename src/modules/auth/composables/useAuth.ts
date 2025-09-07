// composables/useAuth.ts
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useForm } from 'vee-validate';
import * as yup from 'yup';

import { emailFormat, passwordValidation } from '@/core/utils/validationRules';

export function useAuth() {
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
      status: yup.number().required('El campo de estado es requerido'),
      nationalities: yup
        .array()
        .of(
          yup
            .number()
            .required('El campo de nacionalidades es requerido')
            .min(1, 'Debes agregar al menos una nacionalidad'),
        ),
      imgFile: yup
        .mixed<File>()
        .required('La imágen de del perfil es requerida')
        .test('fileSize', 'El tamaño de la imágen es muy grande', value => {
          if (!value) return false;
          return value.size <= 1000000;
        })
        .test('fileType', 'Formato no permitido', value => {
          if (!value) return false;
          return ['image/jpeg', 'image/png'].includes(value.type);
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
      district: yup.number().required('El campo de distrito es requerido'),
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
    }),
  });

  const [firstName, firstNameAttrs] = defineField('firstName');
  const [middleName, middleNameAttrs] = defineField('middleName');
  const [lastName, lastNameAttrs] = defineField('lastName');
  const [birthDate, birthDateAttrs] = defineField('birthDate');
  const [gender, genderAttrs] = defineField('gender');
  const [maritalStatus, maritalStatusAttrs] = defineField('maritalStatus');
  const [phoneNumber, phoneNumberAttrs] = defineField('phoneNumber');
  const [status, statusAttrs] = defineField('status');
  const [nationalities, nationalitiesAttrs] = defineField('nationalities');
  const [imgFile, imgFileAttrs] = defineField('imgFile');
  const [street, streetAttrs] = defineField('street');
  const [streetNumber, streetNumberAttrs] = defineField('streetNumber');
  const [neighborhood, neighborhoodAttrs] = defineField('neighborhood');
  const [district, districtAttrs] = defineField('district');
  const [houseNumber, houseNumberAttrs] = defineField('houseNumber');
  const [block, blockAttrs] = defineField('block');
  const [pathway, pathwayAttrs] = defineField('pathway');
  const [current, currentAttrs] = defineField('current');
  const [documentType, documentTypeAttrs] = defineField('documentType');
  const [documentNumber, documentNumberAttrs] = defineField('documentNumber');
  const [email, emailAttrs] = defineField('email');
  const [password, passwordAttrs] = defineField('password');

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
    firstNameAttrs,
    middleName,
    middleNameAttrs,
    lastName,
    lastNameAttrs,
    birthDate,
    birthDateAttrs,
    gender,
    genderAttrs,
    email,
    emailAttrs,
    maritalStatus,
    maritalStatusAttrs,
    imgFile,
    imgFileAttrs,
    phoneNumber,
    phoneNumberAttrs,
    status,
    statusAttrs,
    nationalities,
    nationalitiesAttrs,
    street,
    streetAttrs,
    streetNumber,
    streetNumberAttrs,
    neighborhood,
    neighborhoodAttrs,
    district,
    districtAttrs,
    houseNumber,
    houseNumberAttrs,
    block,
    blockAttrs,
    pathway,
    pathwayAttrs,
    current,
    currentAttrs,
    documentType,
    documentTypeAttrs,
    documentNumber,
    documentNumberAttrs,
    password,
    passwordAttrs,
    errors,
    handleSubmit,
    defineField,
    validateField,
  };
}

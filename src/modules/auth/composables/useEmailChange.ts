import { ref } from 'vue';
import { useMutation } from '@tanstack/vue-query';
import { useForm } from 'vee-validate';
import * as yup from 'yup';

import type { ErrorResponse } from '@/core/interfaces/httpClient.interface';
import authServices from '@/core/services/auth.services';
import { useAlertStore } from '@/core/store';
import { emailFormat, requiredText } from '@/core/utils/validationRules';

import type { RequestEmailChangeForm } from '../interfaces/email-change.interface';

const extractErrorMessage = (error: unknown, fallback: string): string => {
  if (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof error.message === 'string' &&
    error.message.trim().length > 0
  ) {
    return error.message;
  }
  return fallback;
};

export function useEmailChange(currentEmail?: () => string | undefined) {
  const alert = useAlertStore();
  const isModalOpen = ref(false);
  const requestError = ref<string | null>(null);

  const { errors, defineField, handleSubmit, resetForm } =
    useForm<RequestEmailChangeForm>({
      validationSchema: yup.object({
        current_password: requiredText('La contraseña actual es obligatoria.'),
        new_email: emailFormat(
          'Formato de correo electrónico no válido',
          true,
          'El nuevo correo electrónico es obligatorio',
        ).test(
          'different-email',
          'El nuevo correo debe ser diferente al correo actual',
          value => {
            const existing = currentEmail?.()?.trim().toLowerCase();
            if (!value || !existing) return true;
            return value.trim().toLowerCase() !== existing;
          },
        ),
      }),
      initialValues: {
        current_password: '',
        new_email: '',
      },
    });

  const [currentPassword, currentPasswordAttrs] =
    defineField('current_password');
  const [newEmail, newEmailAttrs] = defineField('new_email');

  const requestMutation = useMutation({
    mutationFn: (payload: RequestEmailChangeForm) =>
      authServices.requestEmailChange(payload),
    onSuccess: response => {
      requestError.value = null;
      isModalOpen.value = false;
      resetForm();
      alert.showAlert({
        type: 'success',
        title: 'Confirmación enviada',
        content:
          response.message ||
          'Revisa tu nuevo correo electrónico para confirmar el cambio (el enlace expira en 15 minutos).',
        timeout: 5000,
      });
    },
    onError: (err: ErrorResponse | unknown) => {
      requestError.value = extractErrorMessage(
        err,
        'No se pudo procesar la solicitud de cambio de correo.',
      );
    },
  });

  const openModal = () => {
    requestError.value = null;
    resetForm();
    isModalOpen.value = true;
  };

  const closeModal = () => {
    requestError.value = null;
    resetForm();
    isModalOpen.value = false;
  };

  const submitRequest = handleSubmit(async values => {
    requestError.value = null;
    try {
      await requestMutation.mutateAsync({
        current_password: values.current_password,
        new_email: values.new_email.trim().toLowerCase(),
      });
    } catch {
      // Manejado reactivamente en requestMutation.onError
    }
  });

  return {
    isModalOpen,
    requestError,
    isSubmitting: requestMutation.isPending,
    errors,
    currentPassword,
    currentPasswordAttrs,
    newEmail,
    newEmailAttrs,
    openModal,
    closeModal,
    submitRequest,
  };
}

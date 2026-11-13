<template>
  <AppModal
    :show="show"
    title="Cambiar correo electrónico"
    width="34rem"
    :show-close-icon="true"
    :footer-buttons="false"
    @close-modal="handleClose"
    @update:show="onUpdateShow"
  >
    <div class="w-full space-y-4 py-2">
      <p class="text-sm text-surface-500 dark:text-surface-400">
        Por seguridad, confirma tu contraseña actual. Enviaremos un enlace de
        verificación válido por 15 minutos a tu nuevo correo electrónico. Al
        confirmarlo se cerrarán tus sesiones activas.
      </p>

      <div
        v-if="requestError"
        role="alert"
        class="flex items-start gap-2 rounded-lg border border-danger-500/40 bg-danger-500/10 p-3 text-sm text-danger-600 dark:text-danger-400"
      >
        <i class="pi pi-exclamation-circle mt-0.5 shrink-0" />
        <span>{{ requestError }}</span>
      </div>

      <form
        class="grid grid-cols-1 items-start gap-x-4 gap-y-5 sm:grid-cols-2 md:grid-cols-6"
        @submit.prevent="emitSubmit"
      >
        <AppInputText
          id="change-email-current-password"
          v-model="currentPasswordModel"
          v-bind="currentPasswordAttrs"
          type="password"
          label="Contraseña actual*"
          placeholder="Ingresa tu contraseña actual"
          prepend-inner-icon="pi pi-lock"
          autocomplete="current-password"
          :error-messages="errors.current_password"
          :disabled="isSubmitting"
          class="col-span-full sm:col-span-2 md:col-span-6"
        />

        <AppInputText
          id="change-email-new-email"
          v-model="newEmailModel"
          v-bind="newEmailAttrs"
          type="email"
          label="Nuevo correo electrónico*"
          placeholder="nuevo@correo.com"
          prepend-inner-icon="pi pi-envelope"
          autocomplete="email"
          :error-messages="errors.new_email"
          :disabled="isSubmitting"
          class="col-span-full sm:col-span-2 md:col-span-6"
        />
      </form>
    </div>

    <template #footer>
      <div
        class="flex w-full flex-col-reverse gap-3 sm:flex-row sm:justify-end"
      >
        <Button
          type="button"
          label="Cancelar"
          outlined
          class="w-full sm:w-auto"
          :disabled="isSubmitting"
          @click="handleClose"
        />
        <Button
          type="button"
          label="Enviar confirmación"
          icon="pi pi-send"
          class="w-full sm:w-auto"
          :loading="isSubmitting"
          :disabled="isSubmitting"
          @click="emitSubmit"
        />
      </div>
    </template>
  </AppModal>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Button } from 'primevue';

defineOptions({ name: 'ChangeEmailModal' });

interface Props {
  show: boolean;
  isSubmitting: boolean;
  requestError: string | null;
  currentPassword: string | undefined;
  currentPasswordAttrs: Record<string, unknown>;
  newEmail: string | undefined;
  newEmailAttrs: Record<string, unknown>;
  errors: Partial<Record<'current_password' | 'new_email', string>>;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  'update:show': [value: boolean];
  'update:currentPassword': [value: string];
  'update:newEmail': [value: string];
  close: [];
  submit: [];
}>();

const currentPasswordModel = computed({
  get: () => props.currentPassword ?? '',
  set: value => emit('update:currentPassword', value),
});

const newEmailModel = computed({
  get: () => props.newEmail ?? '',
  set: value => emit('update:newEmail', value),
});

const handleClose = () => {
  emit('close');
};

const onUpdateShow = (value: boolean) => {
  emit('update:show', value);
  if (!value) {
    emit('close');
  }
};

const emitSubmit = () => {
  emit('submit');
};
</script>

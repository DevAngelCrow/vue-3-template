<template>
  <div class="w-full h-full flex flex-col justify-start gap-5">
    <section name="title">
      <span class="text-2xl font-extrabold">Información de la cuenta</span>
    </section>
    <section name="content" class="w-full gap-4 flex flex-col">
      <div class="flex flex-col gap-2">
        <AppInputText
          class="w-full"
          id="email"
          v-model="email"
          :error-messages="errors.email"
          label="Email*"
          placeholder="juan@mail.com"
          v-bind="emailAttrs"
          :readonly="true"
        />
        <div class="flex justify-end">
          <Button
            type="button"
            label="Cambiar correo"
            icon="pi pi-envelope"
            size="small"
            outlined
            @click="openEmailModal"
          />
        </div>
      </div>

      <AppInputText
        class="w-full"
        id="user_name"
        label="Nombre usuario*"
        v-model="userName"
        v-bind="userNameAttrs"
        :error-messages="errors.userName"
        @update:modelValue="validationInputAlphanumeric(userName, 'userName')"
        :readonly="!editMode"
      />
    </section>

    <ChangeEmailModal
      :show="isModalOpen"
      :is-submitting="isSubmitting"
      :request-error="requestError"
      :current-password="currentPassword"
      :current-password-attrs="currentPasswordAttrs"
      :new-email="newEmail"
      :new-email-attrs="newEmailAttrs"
      :errors="emailChangeErrors"
      @update:show="isModalOpen = $event"
      @update:currentPassword="currentPassword = $event"
      @update:newEmail="newEmail = $event"
      @close="closeEmailModal"
      @submit="submitEmailChange"
    />
  </div>
</template>
<script setup lang="ts">
import { inject } from 'vue';
import { Button } from 'primevue';

import { useAuth } from '../composables/useAuth';
import { useEmailChange } from '../composables/useEmailChange';
import ChangeEmailModal from './ChangeEmailModal.vue';

type useAuthType = ReturnType<typeof useAuth>;

const useAuthInstance = inject<useAuthType>('useAuthInstance')!;
const {
  email,
  emailAttrs,
  userName,
  userNameAttrs,
  errors,
  validationInputAlphanumeric,
  editMode,
} = useAuthInstance;

const {
  isModalOpen,
  requestError,
  isSubmitting,
  errors: emailChangeErrors,
  currentPassword,
  currentPasswordAttrs,
  newEmail,
  newEmailAttrs,
  openModal: openEmailModal,
  closeModal: closeEmailModal,
  submitRequest: submitEmailChange,
} = useEmailChange(() => email.value);
</script>

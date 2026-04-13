<template>
  <div class="py-5 px-5 h-full max-h-full">
    <section id="content" class="w-full flex flex-row flex-wrap gap-5">
      <div class="w-full flex flex-row gap-3 flex-wrap">
        <AppTitle
          title="Usuarios"
          class="w-full md:w-auto flex justify-center items-center"
        />
        <div
          id="inputs"
          class="flex rounded-lg border-2 border-primary py-0.5 px-0.5 gap-3 flex-wrap grow lg:grow-0"
        >
          <AppInputText
            label="Buscar..."
            class="min-w-auto w-auto grow shrink-0 md:w-83.75"
            v-model="filter_name"
            @update:modelValue="validateAlphaInput(filter_name)"
            v-debounce:700.keydown.enter="() => findUser(filter_name)"
          />
          <Button
            class="shrink-0 grow rounded-md"
            v-debounce:700.click="() => findUser(filter_name)"
            >Buscar</Button
          >
          <Button
            class="shrink-0 grow rounded-md"
            outlined
            v-debounce:700.click="cleanSearch"
            >Limpiar</Button
          >
        </div>
      </div>
      <AppDataTable
        class="w-full"
        :headers="headers"
        :items="filteredUsers"
        :paginator="true"
        :per_page="pagination.per_page"
        :total_items="pagination.total_items"
        :page="pagination.page"
        @page-update="handlePagination"
      >
        <template #body-acciones="{ data }">
          <div class="flex gap-0 justify-center">
            <Button
              class="rounded-full mx-0 my-0 px-0 py-0"
              variant="text"
              icon="pi pi-eye"
              @click="openModal('view', data)"
              v-tooltip.bottom="'Ver roles'"
            />
            <Button
              class="rounded-full mx-0 my-0 px-0 py-0"
              variant="text"
              icon="pi pi-pencil"
              @click="openModal('edit', data)"
              v-tooltip.bottom="'Editar roles'"
            />
          </div>
        </template>
        <template #body-is_validated="{ data }">
          <i
            :class="
              data.is_validated
                ? 'pi pi-check-circle text-green-500'
                : 'pi pi-times-circle text-red-500'
            "
          />
        </template>
        <template #body-status.name="{ data }">
          <AppChip
            :label="data?.status?.name"
            :style="{
              backgroundColor: data?.status?.state_color,
              color: data?.status?.text_color,
            }"
          />
        </template>
      </AppDataTable>
    </section>
    <UserRoleFormModal :modal-state="modalState" @close-modal="closeModal" />
  </div>
</template>
<script setup lang="ts">
import { Button } from 'primevue';
import { computed, onMounted, reactive, provide, ref } from 'vue';

import { useUserRole } from '../composables/useUserRole';
import { UsersResponse } from '../interfaces/user-role/users.response.interface';
import UserRoleFormModal from '../components/user-role/UserRoleFormModal.vue';

const userRoleInstance = useUserRole();
provide('useUserRole', userRoleInstance);

const {
  getUsers,
  getUserRoleById,
  getRoles,
  users,
  pagination,
  headers,
  filter_name,
  validateAlphaInput,
  rolesPagination,
} = userRoleInstance;

const modalState = reactive<{
  show: boolean;
  mode: 'closed' | 'view' | 'edit';
  title: string;
  isReadonly: boolean;
  selectedItem: null | number;
  userName: string;
  userEmail: string;
}>({
  show: false,
  mode: 'closed',
  title: '',
  isReadonly: false,
  selectedItem: null,
  userName: '',
  userEmail: '',
});

const localFilter = ref<string | null>(null);

const filteredUsers = computed(() => {
  if (!localFilter.value) return users.value;
  const q = localFilter.value.toLowerCase();
  return users.value.filter(
    u =>
      u.user_name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q),
  );
});

const findUser = (value: string | null) => {
  localFilter.value = value;
};

const cleanSearch = () => {
  filter_name.value = null;
  localFilter.value = null;
};

const openModal = async (action: 'view' | 'edit', data: UsersResponse) => {
  modalState.selectedItem = data.id;
  modalState.userName = data.user_name;
  modalState.userEmail = data.email;
  modalState.isReadonly = action === 'view';

  if (action === 'view') {
    modalState.mode = 'view';
    modalState.title = `Roles de ${data.user_name}`;
    rolesPagination.page = 1;
    rolesPagination.per_page = 10;
    await getUserRoleById(data.id);
  } else {
    modalState.mode = 'edit';
    modalState.title = `Editar roles de ${data.user_name}`;
    rolesPagination.page = 1;
    rolesPagination.per_page = 10;
    await Promise.all([getUserRoleById(data.id), getRoles()]);
  }

  modalState.show = true;
};

const closeModal = () => {
  modalState.show = false;
  modalState.mode = 'closed';
  modalState.title = '';
  modalState.isReadonly = false;
  modalState.selectedItem = null;
  modalState.userName = '';
  modalState.userEmail = '';
};

const handlePagination = (page: number) => {
  if (page + 1 === pagination.page) return;
  pagination.page = page + 1;
};

onMounted(async () => {
  try {
    await getUsers();
  } catch (error) {
    console.error(error);
  }
});
</script>
<style scoped></style>

<template>
  <div class="py-5 px-5 h-full max-h-full flex gap-3 flex-col">
    <AppTitle :title="actionMode.title" />
    <section id="options" class="w-full flex justify-end gap-2">
      <Button
        v-if="actionMode.mode === 'view'"
        class="transform animate-ease-in"
        icon="pi pi-pencil"
        label="Editar"
        @click="enableEditMode"
        severity="primary"
      />
      <Button
        v-if="actionMode.mode === 'edit' || actionMode.mode === 'add'"
        class="transform animate-ease-in"
        icon="pi pi-save"
        label="Guardar"
        @click="onSubMit"
        severity="primary"
      />
      <Button
        v-if="actionMode.mode === 'edit' || actionMode.mode === 'add'"
        class="transform animate-ease-in"
        icon="pi pi-times"
        :label="actionMode.mode === 'add' ? 'Volver' : 'Cancelar'"
        @click="goBack"
        outlined
      />
      <Button
        v-if="actionMode.mode !== 'add'"
        class="transform animate-ease-in"
        icon="pi pi-arrow-left"
        label="Volver"
        @click="router.push({ name: 'role' })"
        outlined
      />
    </section>
    <section id="form">
      <div class="w-full flex flex-wrap gap-5">
        <AppInputText
          class="flex-1 min-w-0"
          id="name"
          label="Nombre*"
          v-model="name"
          :error-messages="errors.name"
          v-bind="nameAttrs"
          :readonly="actionMode.isReadonly"
          maxlength="150"
        />
        <AppInputText
          class="flex-1 min-w-0"
          id="code"
          label="Código*"
          v-model="code"
          :error-messages="errors.code"
          v-bind="codeAttrs"
          :readonly="actionMode.isReadonly"
          maxlength="150"
        />
        <AppInputText
          class="flex-1 min-w-0"
          id="description"
          label="Descripción*"
          v-model="description"
          :error-messages="errors.description"
          v-bind="descriptionAttrs"
          :readonly="actionMode.isReadonly"
          maxlength="150"
        />
        <AppAutocomplete
          class="flex-1 min-w-0"
          id="status"
          label="Estado*"
          v-model="status"
          v-bind="statusAttrs"
          :error-messages="errors.status"
          option-label="name"
          :suggestions="statusFiltered"
          dropdown
          @complete="findAutocomplete"
          :readonly="actionMode.isReadonly"
          :disabled="actionMode.mode === 'add' || actionMode.mode === 'edit'"
        />
      </div>
    </section>
    <section id="permissions" class="w-full">
      <RolePermissionDataTable
        :modal-state="actionMode.mode"
        @update:selected-permissions-ids="
          value => (selectedPermissionsIds = value)
        "
        ref="rolePermissionDataTable"
        :readonly="actionMode.isReadonly"
      />
    </section>
  </div>
</template>
<script setup lang="ts">
import { ref, reactive, onMounted, provide, watch } from 'vue';
import { AutoCompleteCompleteEvent, Button } from 'primevue';
import { useRoute, useRouter } from 'vue-router';

import { useLoaderStore } from '@/core/store';

import { useRole } from '../composables/useRole';
import RolePermissionDataTable from '../components/roles/RolePermissionDataTable.vue';
import { RoleForm } from '../interfaces/role/role.form.interface';

const roleInstance = useRole();
provide('useRole', roleInstance);
const route = useRoute();
const router = useRouter();
const actionMode = reactive<{
  mode: 'add' | 'view' | 'edit';
  title: string;
  description: string;
  isReadonly: boolean;
  selectedItem: null | number;
}>({
  mode: 'view',
  title: 'Crear nuevo rol',
  description: '',
  isReadonly: false,
  selectedItem: null as number | null,
});

const {
  errors,
  name,
  nameAttrs,
  description,
  descriptionAttrs,
  code,
  codeAttrs,
  status,
  statusAttrs,
  globalStatus,
  getRolById,
  setRoleItem,
  handleSubmit,
  addRol,
  getPermissions,
  getCategoryPermissions,
  editRole,
  getStatus,
  permissionsPagination,
} = roleInstance;

const originalData = ref<unknown>(null);
const { startLoading, finishLoading } = useLoaderStore();
const selectedPermissionsIds = ref<Set<number>>(new Set());
const statusFiltered = ref<unknown[]>([]);
const findAutocomplete = (event: AutoCompleteCompleteEvent) => {
  let query = event?.query;
  let _filteredItems = [];
  for (let i = 0; i < globalStatus.value.length; i++) {
    let item = globalStatus.value[i];

    if (item?.name?.toLowerCase().indexOf(query.toLowerCase()) === 0) {
      _filteredItems.push(item);
    }
  }
  statusFiltered.value = _filteredItems;
};

const onSubMit = handleSubmit(async values => {
  try {
    startLoading();
    const form: RoleForm = {
      name: values.name,
      description: values.description,
      id_status: values.status.id,
      code: values.code,
      permissions_id: [...selectedPermissionsIds.value],
    };
    switch (actionMode.mode) {
      case 'add':
        await addRol(form);
        goBack();
        break;
      case 'edit':
        form.id = values.id;
        await editRole(form);
        goBack();
        break;
      //   case 'delete':
      //     success = (await toggleRole(values.id)) ? true : false;
      //     break;
    }
  } catch (error) {
    console.error(error);
  } finally {
    finishLoading();
  }
});
const enableEditMode =  async () => {
  actionMode.mode = 'edit';
  actionMode.title = 'Editar rol';
  actionMode.isReadonly = false;
  permissionsPagination.page = 1;
  await getPermissions();
};
const goBack = async () => {
  if (actionMode.mode === 'add') {
    router.push({ name: 'role' });
    return;
  }
  actionMode.mode = 'view';
  actionMode.title = 'Detalle del rol';
  actionMode.isReadonly = true;
  await getPermissions();
  actionMode.mode = 'view';
  actionMode.title = 'Detalle del rol';
  actionMode.isReadonly = true;
  const rol = await getRolById(+route.params.id);
  if (!rol || !rol.data) {
    console.error('No se pudo obtener el rol');
    return;
  }
  const data = {
    id: rol.data.id,
    name: rol.data.name,
    description: rol.data.description,
    code: rol.data.code,
    status: rol.data.status,
    id_status: rol.data.status.id,
    permissions: rol.data.permissions,
  };
  originalData.value = { ...data };
  setRoleItem(data);
};
watch(() => permissionsPagination.page, (newValue) => {
  console.log('permissionsPagination.page changed:', newValue);
})
onMounted(async () => {
  try {
    await getPermissions();
    await getCategoryPermissions();
    await getStatus();
    if (route?.params?.id) {
      actionMode.mode = 'view';
      actionMode.title = 'Detalle del rol';
      actionMode.isReadonly = true;

      const rol = await getRolById(+route.params.id);

      if (!rol || !rol.data) {
        console.error('No se pudo obtener el rol');
        return;
      }
      const data = {
        id: rol.data.id,
        name: rol.data.name,
        description: rol.data.description,
        code: rol.data.code,
        status: rol.data.status,
        id_status: rol.data.status.id,
        permissions: rol.data.permissions,
      };
      originalData.value = { ...data };
      setRoleItem(data);
      return;
    }
    actionMode.mode = 'add';
    actionMode.title = 'Agregar rol';
    if (actionMode.mode === 'add') {
      status.value = globalStatus.value.find(item => {
        return (
          item?.name?.toLowerCase() === 'activo' &&
          item?.code?.toLowerCase() === 'ac'
        );
      });
    }
  } catch (error) {
    console.error(error);
  }
});
</script>

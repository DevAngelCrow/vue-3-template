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
        v-if="actionMode.mode === 'edit'"
        class="transform animate-ease-in"
        icon="pi pi-save"
        label="Guardar"
        @click="onSubMit"
        severity="primary"
      />
      <Button
        v-if="actionMode.mode === 'edit'"
        class="transform animate-ease-in"
        icon="pi pi-times"
        label="Cancelar"
        @click="goBack"
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
          label="Descripción"
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
import { ref, reactive, onMounted, provide } from 'vue';
import { AutoCompleteCompleteEvent, Button } from 'primevue';
import { useRoute } from 'vue-router';

import { useLoaderStore } from '@/core/store';

import { useRole } from '../composables/useRole';
import RolePermissionDataTable from '../components/roles/RolePermissionDataTable.vue';
import { RoleForm } from '../interfaces/role/role.form.interface';

const roleInstance = useRole();
provide('useRole', roleInstance);
const route = useRoute();
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
    //let success = false;
    switch (actionMode.mode) {
      case 'add':
        (await addRol(form)) ? true : false;
        break;
      //   case 'edit':
      //     form.id = values.id;
      //     success = (await editRole(form)) ? true : false;
      //     break;
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
const enableEditMode = () => {
  actionMode.mode = 'edit';
  actionMode.title = 'Editar rol';
  actionMode.isReadonly = false;
};
const goBack = () => {
  actionMode.mode = 'view';
  actionMode.title = 'Detalle del rol';
  actionMode.isReadonly = true;
};
onMounted(async () => {
  try {
    await getPermissions();
    await getCategoryPermissions();
    if (route.params.id) {
      actionMode.mode = 'view';
      actionMode.title = 'Detalle del rol';
      actionMode.isReadonly = true;
    }
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
  } catch (error) {
    console.error(error);
  }
});
</script>
<style lang="scss" scoped></style>

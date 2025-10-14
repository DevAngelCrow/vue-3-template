<template>
  <div class="w-full flex flex-wrap justify-start gap-2">
    <div class="flex w-full gap-1 flex-wrap">
      <AppInputText
        class="w-[75%] grow order-1"
        label="Buscar permiso..."
        v-model="filter_permission_name"
        @update:model-value="searchPermission"
        @keydown.enter="searchPermission"
      />
      <Button
        class="w-[2%] sm:min-w-[40px] sm:max-w-[40px] xs:w-[6%] grow sm:rounded-full md:grow-0 order-3 md:order-2"
        icon="pi pi-search"
      />
      <Button
        class="w-[2%] sm:min-w-[40px] sm:max-w-[40px] xs:w-[6%] grow sm:rounded-full md:grow-0 order-4 md:order-2"
        icon="pi pi-eraser"
        variant="outlined"
      />
      <div class="grow order-2 md:order-4 flex">
        <AppCircularCounter
          class="flex justify-center items-center"
          :selected="selectedPermissionsIds.size"
          :total="permissionsPagination.total_items"
          color="#082f49"
        />
      </div>
    </div>
    <AppDataTable
      class="w-full"
      :headers="headerPermissions"
      :items="permissionItemsFormated"
      :paginator="true"
      :per_page="permissionsPagination.per_page"
      :total_items="permissionsPagination.total_items"
      :page="permissionsPagination.page"
      @page-update="handlePagination"
    >
      <template #header-Seleccion>
        <div class="flex justify-center flex-row">
          <AppCheckBox
            :readonly="props.readonly"
            binary
            @update:model-value="checkAll"
            v-model="selectAll"
          >
          </AppCheckBox>
          <span>Seleccion</span>
        </div>
      </template>
      <template #body-state="{ data, index }">
        <div class="flex justify-center">
          <AppCheckBox
            :readonly="props.readonly"
            binary
            :model-value="isPermissionSelected(data.id)"
            :id="`${index}`"
            @update:model-value="togglePermission(data.id, $event)"
          />
        </div>
      </template>
    </AppDataTable>
  </div>
</template>
<script setup lang="ts">
import { defineComponent, inject, onMounted, ref, toRef, watch } from 'vue';
import { Button } from 'primevue';

import { useAdmin } from '../../composables/useAdmin';

type AdminType = ReturnType<typeof useAdmin>;

const admin = inject<AdminType>('useAdmin')!;

const props = defineProps<{
  modalState: 'add' | 'view' | 'edit' | 'delete' | 'closed';
  readonly: boolean;
}>();
const modalState = toRef(props, 'modalState');
const emit = defineEmits(['update:selected-permissions-ids', 'close-modal']);

const {
  headerPermissions,
  permissionsPagination,
  permissionsList,
  permissions_ids,
  filter_permission_name,
  getPermissions,
  findPermission,
} = admin;
const selectedPermissionsIds = ref<Set<number>>(new Set());
const selectAll = ref<boolean>(false);
const permissionItemsFormated = ref<
  {
    id: number;
    name: string;
    description: string;
    active: boolean;
    show: boolean;
    state: boolean;
  }[]
>([]);

const searchPermission = async (value: string | null) => {
  if (!value) return;
  await findPermission(value);
  setPermissionsIds(permissionsList.value);
};

const handlePagination = async (page: number) => {
  if (page + 1 === permissionsPagination.page) {
    return;
  }
  permissionsPagination.page = page + 1;
  await getPermissions();
  updateSelectAllState();
};

const isPermissionSelected = (permissionId: number) => {
  return selectedPermissionsIds.value.has(permissionId);
};

const checkAll = (flag: boolean) => {
  if (flag) {
    permissionItemsFormated.value.forEach(item => {
      selectedPermissionsIds.value.add(item.id);
    });
  } else {
    permissionItemsFormated.value.forEach(item => {
      selectedPermissionsIds.value.delete(item.id);
    });
  }
};

const togglePermission = (permissionId: number, isChecked: boolean) => {
  if (isChecked) {
    selectedPermissionsIds.value.add(permissionId);
  } else {
    selectedPermissionsIds.value.delete(permissionId);
  }
  updateSelectAllState();
};
const updateSelectAllState = (): void => {
  if (permissionItemsFormated.value.length === 0) {
    selectAll.value = false;
    return;
  }
  const allCurrentItemsSelected = permissionItemsFormated.value.every(item =>
    selectedPermissionsIds.value.has(item.id),
  );

  selectAll.value = allCurrentItemsSelected;
};
const setPermissionsIds = (
  value: {
    id: number;
    name: string;
    description: string;
    active: boolean;
    show: boolean;
  }[],
) => {
  if (value.length) {
    permissionItemsFormated.value = value.map(item => {
      return {
        ...item,
        state: false,
      };
    });
  }
};

const closeModal = () => {
  permissionItemsFormated.value = permissionsList.value.map(item => {
    return {
      ...item,
      state: false,
    };
  });
  selectedPermissionsIds.value.clear();
  if (permissionsPagination.page > 1) {
    permissionsPagination.page = 1;
    getPermissions();
  }
  emit('close-modal');
};

watch(
  () => selectedPermissionsIds.value.size,
  () => {
    emit('update:selected-permissions-ids', selectedPermissionsIds.value);
  },
);
watch(permissionsList, newVal => {
  setPermissionsIds(newVal);
  updateSelectAllState();
});

onMounted(() => {
  setPermissionsIds(permissionsList.value);
  switch (modalState.value) {
    case 'add':
      updateSelectAllState();
      break;
    case 'view':
      permissions_ids.value?.forEach((id: number) => {
        selectedPermissionsIds.value.add(id);
      });
      permissionItemsFormated.value.forEach(item => {
        isPermissionSelected(item.id);
      });
      updateSelectAllState();
      break;
    case 'edit':
      permissions_ids.value?.forEach((id: number) => {
        selectedPermissionsIds.value.add(id);
      });
      permissionItemsFormated.value.forEach(item => {
        isPermissionSelected(item.id);
      });
      updateSelectAllState();
      break;
  }
});
defineComponent({
  name: 'RoutePermissionDataTable',
});
defineExpose({
  closeModal,
});
</script>
<style scoped></style>

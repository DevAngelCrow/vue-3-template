<template>
  <div class="w-full flex flex-wrap justify-start gap-2">
    <div class="flex h-12 w-full">
      <AppInputText class="w-[85%]" label="Buscar permiso..." />
      <div class="width_circular_counter w-[45%] xs:w-[20%] sm:w-[15%]">
        <AppCircularCounter
          class="flex justify-end"
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
            binary
            @update:model-value="checkAll"
            v-model="selectAll"
          ></AppCheckBox>
          <span>Seleccion</span>
        </div>
      </template>
      <template #body-state="{ data, index }">
        <div class="flex justify-center">
          <AppCheckBox
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
import { inject, ref, watch } from 'vue';

import { useAdmin } from '../../composables/useAdmin';

type AdminType = ReturnType<typeof useAdmin>;

const admin = inject<AdminType>('useAdmin')!;

const { modalState } = defineProps<{
  modalState: 'add' | 'view' | 'edit' | 'delete' | 'closed';
}>();
const emit = defineEmits(['update:selected-permissions-ids', 'close-modal']);

const {
  headerPermissions,
  permissionsPagination,
  permissionsList,
  permissions_ids,
  getPermissions,
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

watch(selectedPermissionsIds, newVal => {
  emit('update:selected-permissions-ids', newVal);
});
watch(permissionsList, newVal => {
  console.log(newVal, 'nuevo');
  setPermissionsIds(newVal);
  updateSelectAllState();
});
watch(
  () => modalState,
  newVal => {
    switch (newVal) {
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
  },
);
defineExpose({
  closeModal,
});
</script>
<style scoped></style>

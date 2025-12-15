<template>
  <div class="w-full flex flex-wrap justify-start gap-2">
    <div class="flex w-full gap-1 flex-wrap">
      <AppInputText
        class="w-[65%] grow order-1"
        label="Buscar permiso..."
        v-model="filter_permission_name"
        v-debounce:700.keydown.enter="
          () => searchPermission(filter_permission_name)
        "
      />
      <Button
        class="rounded_btn_search"
        icon="pi pi-search"
        v-debounce:700.click="() => searchPermission(filter_permission_name)"
      />
      <Button
        class="rounded_btn_clean"
        :icon="
          filter_permission_name?.length ? 'pi pi-filter-slash' : 'pi pi-filter'
        "
        variant="outlined"
        v-debounce:700.click="cleanSearch"
        v-tooltip="'Eliminar filtro'"
      />
      <div class="rounded_counter">
        <AppCircularCounter
          class="item_justify_counter"
          :selected="selectedPermissionsIds.size"
          :total="totalPermissions"
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
    state: boolean;
  }[]
>([]);
let totalPermissions: number = 0;
const permissionsItemsLocal = ref<any>([]);
const permissionsItemsFindLocal = ref<any>([]);
const searchPermission = async (value: string | null) => {
  if (!value) return;
  if (modalState.value === 'view') {
    let _filteredItems = [];
    for (let i = 0; i < permissionsItemsLocal.value.length; i++) {
      let item = permissionsItemsLocal.value[i];
      if (item?.name.toLowerCase().indexOf(value.toLocaleLowerCase()) === 0) {
        _filteredItems.push(item);
      }
    }
    permissionItemsFormated.value = _filteredItems;
    permissionsItemsFindLocal.value = _filteredItems;
    permissionsPagination.total_items = permissionItemsFormated.value.length;
    localPaginationViewMode(0, true);
    return;
  }
  await findPermission(value);
  setPermissionsIds(permissionsList.value);
};

const handlePagination = async (page: number) => {
  if (modalState.value === 'view') {
    localPaginationViewMode(page);
    updateSelectAllState();
    return;
  }
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
  // permissionItemsFormated.value = permissionsList.value.map(item => {
  //   return {
  //     ...item,
  //     state: false,
  //   };
  // });
  selectedPermissionsIds.value.clear();
  if (permissionsPagination.page > 1) {
    permissionsPagination.page = 1;
    getPermissions();
  }
  filter_permission_name.value = null;
  permissionItemsFormated.value = [];
  if (modalState.value === 'view') {
    getPermissions();
  }
  cleanSearch();
  emit('close-modal');
};

const cleanSearch = () => {
  filter_permission_name.value = null;
  if (modalState.value === 'view') {
    permissionItemsFormated.value = [...permissionsItemsLocal.value];
    totalPermissions = permissionsItemsLocal.value.length;
    permissionsPagination.total_items = totalPermissions;
    localPaginationViewMode(0);
    return;
  }
  getPermissions();
};
const localPaginationViewMode = (page: number, find?: boolean) => {
  let permissionsTemporalItems = [...permissionsItemsLocal.value];
  if (find) {
    permissionsTemporalItems = [...permissionsItemsFindLocal.value];
  }
  const currentPage = page + 1;
  const start = (currentPage - 1) * permissionsPagination.per_page;
  const end = currentPage * permissionsPagination.per_page;
  const temporalPermissionsItemFormated = permissionsTemporalItems.slice(
    start,
    end,
  );
  permissionItemsFormated.value = temporalPermissionsItemFormated;
};
watch(
  () => selectedPermissionsIds.value.size,
  () => {
    emit('update:selected-permissions-ids', selectedPermissionsIds.value);
  },
);
watch(permissionsList, newVal => {
  permissionItemsFormated.value = [];
  setPermissionsIds(newVal);
  updateSelectAllState();
  if (modalState.value === 'view') {
    permissionsItemsLocal.value = [...permissionItemsFormated.value];
    localPaginationViewMode(0);
    totalPermissions = permissionsItemsLocal.value.length;
  }
});
onMounted(() => {
  totalPermissions = permissionsPagination.total_items;
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
<style scoped>
.rounded_counter {
  @apply min-w-[100px] max-w-[100px] max-h-[50px] order-4 flex justify-end;
}

.item_justify_counter {
  @apply flex justify-end;
}

@media (min-width: 595px) {
  .rounded_btn_search {
    @apply min-w-[46px];
    @apply max-w-[46px];
    @apply grow;
    @apply order-2;
    /*@apply md:order-2;*/
    @apply rounded-full;
  }

  .rounded_btn_clean {
    @apply min-w-[46px];
    @apply max-w-[46px];
    /*@apply xs:w-[6%];*/
    @apply grow;
    /*@apply order-4;*/
    @apply order-3;
    @apply rounded-full;
  }

  .rounded_counter {
    @apply min-w-[100px] max-w-[100px] max-h-[45px] order-4 flex !justify-end;
  }
}

@media (min-width: 452px) and (max-width: 594px) {
  .rounded_btn_search {
    @apply grow order-2;
    @apply min-w-[46px];
    @apply max-w-[46px];
    @apply rounded-full;
  }

  .rounded_btn_clean {
    @apply grow order-4;
    @apply min-w-[46px];
  }

  .rounded_counter {
    @apply min-w-[100px] max-w-[100px] max-h-[45px] order-3 flex justify-end;
  }
}

@media (min-width: 200px) and (max-width: 451px) {
  .rounded_btn_search {
    @apply grow order-3;
    @apply min-w-[46px];
  }

  .rounded_btn_clean {
    @apply grow order-4;
    @apply min-w-[46px];
  }

  .rounded_counter {
    @apply min-w-[100px] max-w-[100px] order-2 flex justify-end;
  }
}

@media (max-width: 309px) {
  .item_justify_counter {
    @apply flex justify-start;
  }
}
</style>

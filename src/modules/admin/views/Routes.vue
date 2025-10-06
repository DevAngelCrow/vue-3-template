<template>
  <div class="py-5 px-5 h-full max-h-full">
    <section id="content" class="w-full flex flex-row flex-wrap gap-5">
      <div class="w-full flex flex-row gap-3 flex-wrap">
        <AppTitle
          title="Rutas"
          class="w-full md:w-auto flex justify-center items-center"
        />
        <div
          id="inputs"
          class="flex rounded-lg border-2 border-primary py-0.5 px-0.5 gap-3 flex-wrap grow lg:grow-0"
        >
          <AppInputText
            label="Buscar"
            class="min-w-auto w-auto grow flex-shrink-0 md:w-[335px]"
            v-model="filter_name"
            @update:modelValue="validateAlphaInput(filter_name)"
          />
          <Button class="flex-shrink-0 grow rounded-md" @click="getRoutes"
            >Buscar</Button
          >
          <Button
            class="flex-shrink-0 grow rounded-md"
            outlined
            @click="cleanSearch"
            >Limpiar</Button
          >
          <Button
            class="flex-shrink-0 grow rounded-md"
            @click="handledModal(showModal, 'agregar')"
            ><i
              class="pi pi-plus flex justify-center items-center text-center"
              style="font-size: 1.1rem; font-weight: bold"
            ></i
            ><span>Agregar</span></Button
          >
        </div>
      </div>
      <AppDataTable
        class="w-full"
        :headers="headers"
        :items="items"
        :paginator="true"
        :per_page="per_page"
        :total_items="total_items"
        :page="page"
        @page-update="
          (value: number) => {
            page = value + 1;
            getRoutes();
          }
        "
      >
        <template #body-acciones="{ data }">
          <div class="flex gap-0 justify-center">
            <Button
              class="rounded-full mx-0 my-0 px-0 py-0"
              variant="text"
              icon="pi pi-eye"
              @click="handledModal(showModal, 'ver', data)"
            ></Button>
            <Button
              class="rounded-full mx-0 my-0 px-0 py-0"
              variant="text"
              icon="pi pi-pencil"
              @click="handledModal(showModal, 'editar', data)"
            ></Button>
            <Button
              class="rounded-full"
              variant="text"
              icon="pi pi-trash"
              @click=""
            ></Button>
          </div>
        </template>
        <template #body-icon="{ data }">
          <i :class="data.icon"></i>
        </template>
        <template #body-active="{ data }">
          <Chip :class="data ? 'bg-green-600' : 'bg-red-600'">{{
            data ? 'Activo' : 'Inactivo'
          }}</Chip>
        </template>
        <template #body-show="{ data }">
          <i :class="data ? 'pi pi-eye' : 'pi pi-eye-slash'"></i>
        </template>
      </AppDataTable>
    </section>
    <AppModal
      :title="titleModal"
      :show="showModal"
      :title-btn-cancel="onlyReadFlag ? 'Cerrar' : 'Cancelar'"
      :title-btn-confirm="'Guardar'"
      footer-buttons
      show-icon-close
      width="35rem"
      @close-modal="handledModal(showModal, 'cerrar')"
      @confirm-modal="onSubMit"
      :showBtnConfirmFooter="!onlyReadFlag"
    >
      <section
        id="body_modal"
        class="flex justify-center items-center flex-wrap flex-row gap-5 py-1.5"
      >
        <AppInputText
          class="w-full min-w-0"
          id="name"
          label="Nombre*"
          v-model="name"
          :error-messages="errors.name"
          v-bind="nameAttrs"
          :readonly="onlyReadFlag"
        />
        <AppInputText
          class="w-full min-w-0"
          id="title"
          label="Título*"
          v-model="title"
          :error-messages="errors.title"
          v-bind="titleAttrs"
          :readonly="onlyReadFlag"
        />
        <AppInputText
          class="w-full min-w-0"
          id="uri"
          label="Uri*"
          v-model="uri"
          :error-messages="errors.uri"
          v-bind="uriAttrs"
          @update:modelValue="validateInputUri(uri, 'uri')"
          :readonly="onlyReadFlag"
        />
        <AppInputText
          class="w-full min-w-0"
          id="description"
          label="Descripción*"
          v-model="description"
          :error-messages="errors.description"
          v-bind="descriptionAttrs"
          :readonly="onlyReadFlag"
        />
        <div class="w-full flex flex-wrap gap-5">
          <AppInputText
            class="grow w-[50%] min-w-auto"
            id="order"
            label="Orden*"
            v-model="order"
            :error-messages="errors.order"
            v-bind="orderAttrs"
            :readonly="onlyReadFlag"
          />
          <AppInputText
            class="grow w-[50%] min-w-auto"
            id="icon"
            label="Ícono (nombre)*"
            v-model="icon"
            :error-messages="errors.icon"
            v-bind="iconAttrs"
            :readonly="onlyReadFlag"
          />
        </div>
        <div class="w-full flex flex-wrap justify-start">
          <div class="w-[50%]">
            <AppCheckBox
              id="child_route"
              label="Ruta padre"
              v-model="child_route"
              v-bind="child_routeAttrs"
              binary
              :readonly="onlyReadFlag"
            />
          </div>
          <div class="w-[50%]">
            <AppCheckBox
              id="show"
              label="Mostrar"
              v-model="show"
              v-bind="showAttrs"
              binary
              :readonly="onlyReadFlag"
            />
          </div>
        </div>
        <AppAutocomplete
          :class="showParentRoute"
          id="patern_route"
          label="Ruta padre"
          v-model="parent_route"
          v-bind="parent_routeAttrs"
          :error-messages="errors.parent_route"
          option-label="title"
          :suggestions="routesFiltered"
          dropdown
          @complete="findAutocomplete"
          :readonly="onlyReadFlag"
        />
      </section>
    </AppModal>
  </div>
</template>
<script setup lang="ts">
import { AutoCompleteCompleteEvent, Button, Chip } from 'primevue';
import { computed, nextTick, onMounted, ref, watch } from 'vue';

import { TableHeaders } from '@/core/interfaces';
import { useLoaderStore } from '@/core/store';

import { useAdmin } from '../composables/useAdmin';
import { RouteForm } from '../interfaces/route-form.interface';
import { RoutesResponse } from '../interfaces/routes.response.interface';

const { startLoading, finishLoading } = useLoaderStore();
const {
  getRoutes,
  addRoute,
  errors,
  name,
  nameAttrs,
  title,
  titleAttrs,
  uri,
  uriAttrs,
  description,
  descriptionAttrs,
  order,
  orderAttrs,
  icon,
  iconAttrs,
  child_route,
  child_routeAttrs,
  show,
  showAttrs,
  parent_route,
  parent_routeAttrs,
  handleSubmit,
  parentRoutes,
  resetField,
  page,
  total_items,
  per_page,
  items,
  filter_name,
  resetForm,
  validateInputUri,
  validateAlphaInput,
  cleanSearch,
  viewRoute,
  setEditRoute,
} = useAdmin();

const headers = ref<TableHeaders[]>([
  {
    field: 'id',
    header: 'No.',
    sortable: false,
    alignHeaders: 'center',
    alignItems: 'center',
  },
  {
    field: 'name',
    header: 'Nombre',
    sortable: false,
    alignHeaders: 'center',
    alignItems: 'center',
  },
  {
    field: 'description',
    header: 'Descripción',
    sortable: false,
    alignHeaders: 'center',
    alignItems: 'center',
  },
  {
    field: 'icon',
    header: 'Ícono',
    sortable: false,
    alignHeaders: 'center',
    alignItems: 'center',
  },
  {
    field: 'uri',
    header: 'Uri',
    sortable: false,
    alignHeaders: 'center',
    alignItems: 'center',
  },
  {
    field: 'show',
    header: 'Mostrar',
    sortable: false,
    alignHeaders: 'center',
    alignItems: 'center',
  },
  {
    field: 'order',
    header: 'Orden',
    sortable: false,
    alignHeaders: 'center',
    alignItems: 'center',
  },
  {
    field: 'parent_route.uri',
    header: 'Ruta padre',
    sortable: false,
    alignHeaders: 'center',
    alignItems: 'center',
  },
  {
    field: 'active',
    header: 'Estado',
    sortable: false,
    alignHeaders: 'center',
    alignItems: 'center',
  },
  {
    field: 'acciones',
    header: 'Acciones',
    sortable: false,
    alignHeaders: 'center',
    alignItems: 'center',
  },
]);

const titleModal = ref<string>('');

const showModal = ref<boolean>(false);
const routesFiltered = ref<any[]>([]);
const onlyReadFlag = ref<boolean>(false);

const handledModal = (
  flag: boolean,
  action: 'agregar' | 'ver' | 'editar' | 'cerrar',
  data?: RoutesResponse,
) => {
  if (!flag && action === 'agregar') {
    titleModal.value = 'Agregar ruta';
    showModal.value = !flag;
    return;
  }
  if (!flag && action === 'ver' && data) {
    titleModal.value = 'Ver ruta';
    showModal.value = !flag;
    onlyReadFlag.value = true;
    viewRoute(data);
    return;
  }
  if (!flag && action === 'editar' && data) {
    titleModal.value = 'Editar ruta';
    showModal.value = !flag;
    setEditRoute(data);
    return;
  }
  showModal.value = false;
  onlyReadFlag.value = false;
  title.value = '';
  resetForm();
};

const findAutocomplete = (event: AutoCompleteCompleteEvent) => {
  let query = event?.query;
  let _filteredItems = [];
  for (let i = 0; i < parentRoutes.value.length; i++) {
    let item = parentRoutes.value[i];

    if (item?.title?.toLowerCase().indexOf(query.toLowerCase()) === 0) {
      _filteredItems.push(item);
    }
  }
  routesFiltered.value = _filteredItems;
};

const onSubMit = handleSubmit(async values => {
  try {
    startLoading();
    const form: RouteForm = {
      name: values.name,
      description: values.description,
      child_route: values.child_route,
      icon: values.icon,
      order: values.order,
      show: values.show,
      uri: values.uri,
      parent_route: values.parent_route,
      title: values.title,
    };
    await addRoute(form);
    handledModal(showModal.value, 'agregar');
  } catch (error) {
    console.error(error);
  } finally {
    finishLoading();
  }
});

const showParentRoute = computed(() => {
  try {
    if (child_route.value) {
      return 'w-full !max-w-full min-w-auto max-h-20 transition-all transition-discrete duration-300';
    }
    return 'w-full !max-w-full min-w-auto max-h-0 transition-all transition-discrete duration-300 opacity-0';
  } catch (error) {
    console.error(error);
  }
});

watch(
  child_route,
  (newValue, oldValue) => {
    if (oldValue === true && newValue === false) {
      try {
        nextTick(() => {
          resetField('parent_route', { errors: undefined, value: null });
        });
      } catch (error) {
        console.error(error);
      }
    }
  },
  {
    immediate: false,
  },
);

onMounted(async () => {
  try {
    await getRoutes();
  } catch (error) {
    console.error(error);
  }
});
</script>
<style scoped></style>

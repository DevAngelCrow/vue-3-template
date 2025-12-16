<template>
  <div class="py-5 px-5 h-full">
    <section id="content" class="w-full flex flex-row flex-wrap gap-5">
      <div class="w-full flex flex-row gap-3 flex-wrap">
        <AppTitle
          title="Países"
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
            v-debounce:700.keydown.enter="() => findCountry(filter_name)"
          />
          <Button class="flex-shrink-0 grow rounded-md"
          v-debounce:700.click="() => findCountry(filter_name)"
          >Buscar</Button>

          <Button class="flex-shrink-0 grow rounded-md"
          v-debounce:700.click="cleanSearch"
           outlined
            >Limpiar</Button
          >
          <Button
            class="flex-shrink-0 grow rounded-md"
            @click="openModal('add')"
            ><i
              class="pi pi-plus flex justify-center items-center text-center"
              style="font-size: 1.1rem; font-weight: bold"
            ></i
            ><span>Agregar</span>
          </Button>
        </div>
      </div>
      <AppDataTable
        class="w-full"
        :headers="headers"
        :items="countries"
        :paginator="true"
        :per_page="pagination.per_page"
        :total_items="pagination.total_items"
        :page="pagination.page"
        @page-update="handlePagination"
      >
        
        <template #body-acciones="{ data }">
          <div class="flex gap-0 justify-center">
            <Button unstyled class="!outline-none">
              <i
                class="pi pi-eye cursor-pointer hover:text-blue-500 transition-colors p-2"
                @click="openModal('view', data)"
              ></i>
            </Button>
            <Button
              class="rounded-full mx-0 my-0 px-0 py-0"
              variant="text"
              icon="pi pi-pencil"
              @click="openModal('edit', data)"
            ></Button>
            <Button
              class="rounded-full"
              variant="text"
              icon="pi pi-trash"
              @click="openModal('delete', data)"
            ></Button>
          </div>
        </template>

        <template #body-active="{ data }">
          <Chip :class="data ? 'bg-green-600' : 'bg-red-600'">{{
            data ? 'Activo' : 'Inactivo'
          }}</Chip>
        </template>
      </AppDataTable>
    </section>
    <AppModal
      :show="modalState.show"
      show-icon-close
      :title="modalState.title"
      :show-btn-confirm-footer="modalState.mode !== 'view'"
      :title-btn-confirm="getModalButtons().confirmText"
      :title-btn-cancel="getModalButtons().cancelText"
      :show-buttons="true"
      @close-modal="closeModal"
      @confirm-modal="confirmModal"
      width="450px"
    >
      <section
        v-if="modalState.mode !== 'delete'"
        class="flex flex-col gap-6 py-5 w-full"
      >
        <AppInputText
          v-model="name"
          class="lg:w-full grow sm:max-w-[500px]"
          label="Ingrese el nombre del país"
          v-bind="nameAttrs"
          :error-messages="errors.name"
          :disabled="modalState.isReadonly"
        />
        <AppInputText
          v-model="abbreviation"
          class="lg:w-full grow sm:max-w-[500px]"
          label="Ingrese la abreviación del país"
          v-bind="abbreviationAttrs"
          :error-messages="errors.abbreviation"
          :disabled="modalState.isReadonly"
        />
        <AppInputText
          v-model="code"
          class="lg:w-full grow sm:max-w-[500px]"
          label="Ingrese el código del país"
          v-bind="codeAttrs"
          :error-messages="errors.code"
          :disabled="modalState.isReadonly"
        />
      </section>
      <section v-else class="w-full flex flex-wrap gap-5 py-5">
        <div class="w-full flex justify-center text-center items-center">
          <span class="text-center flex">{{ modalState.description }}</span>
        </div>
      </section>
    </AppModal>
  </div>
</template>

<script setup lang="ts">
/** Zona de Imports */
import { onMounted, ref, reactive } from 'vue';
import { Button, Chip } from 'primevue';

import { TableHeaders } from '@/core/interfaces';
import AppTitle from '@/core/components/AppTitle.vue';
import AppModal from '@/core/components/AppModal.vue';
import { useLoaderStore } from '@/core/store';

import { useCountries } from '../../composables/useCountries';
import { CreateCountry } from '../../interfaces/country.create.interface';
import { UpdateCountry } from '../../interfaces/country.update.interface';
const editingCountryId = ref<number | null>(null);

const modalState = reactive<{
  show: boolean;
  mode: 'closed' | 'add' | 'view' | 'edit' | 'delete';
  title: string;
  description: string;
  isReadonly: boolean;
  selectedItem: null | number;
}>({
  show: false,
  mode: 'closed',
  title: '',
  description: '',
  isReadonly: false,
  selectedItem: null as number | null,
});

/** Zona de Variables */
const { startLoading, finishLoading } = useLoaderStore();

const openModal = (
  action: 'add' | 'view' | 'edit' | 'delete',
  country?: any,
) => {
  modalState.mode = action;
  modalState.isReadonly = action === 'view';
  editingCountryId.value = null;

  switch (action) {
    case 'add':
      modalState.title = 'Agregar País';
      resetForm();
      break;
    case 'view':
      modalState.title = 'Ver País';
      setCountriesItem(country!);
      break;
    case 'edit':
      modalState.title = 'Editar País';
      editingCountryId.value = country.id;
      setCountriesItem(country!);
      break;
    case 'delete':
      setCountriesItem(country!);
      modalState.title = country!.active
        ? 'Desactivar País'
        : 'Activar País';
      modalState.description = `¿Está seguro de cambiar el estado del país a ${country!.active ? 'inactivo' : 'activo'}?`;
      modalState.selectedItem = country!.id;
      editingCountryId.value = country!.id;
      break;
  }
  modalState.show = true;
};



/** Zona de Composables */
const {
  getCountries,
  createCountry,
  handleSubmit,
  name,
  nameAttrs,
  abbreviation,
  abbreviationAttrs,
  code,
  codeAttrs,
  errors,
  resetForm,
  updateCountry,
  countries, // Usar el ref del composable
  setCountriesItem,
  deleteCountry,
  pagination,
  filter_name,
  validateAlphaInput,
  findCountry,
  cleanSearch,
} = useCountries();

const closeModal = () => {
  modalState.show = false;
  modalState.mode = 'closed';
  modalState.title = '';
  modalState.description = '';
  modalState.selectedItem = null;
  modalState.isReadonly = false;
  editingCountryId.value = null;
  resetForm();
};

const getModalButtons = () => {
  switch (modalState.mode) {
    case 'add':
      return { confirmText: 'Agregar', cancelText: 'Cancelar' };
    case 'edit':
      return { confirmText: 'Guardar', cancelText: 'Cancelar' };
    case 'delete':
      return { confirmText: 'Confirmar', cancelText: 'Cancelar' };
    case 'view':
      return { confirmText: '', cancelText: 'Cerrar' };
    default:
      return { confirmText: 'Aceptar', cancelText: 'Cancelar' };
  }
};
const confirmModal = handleSubmit(async values => {
  try {
    startLoading();
    let success = false;

    switch (modalState.mode) {
      case 'add':
        // eslint-disable-next-line no-case-declarations
        const form: CreateCountry = {
          name: values.name,
          abbreviation: values.abbreviation,
          code: values.code,
          active: true,
        };
        success = (await createCountry(form)) ? true : false;
        break;

      case 'edit':
        // eslint-disable-next-line no-case-declarations
        const updateForm: UpdateCountry = {
          id: editingCountryId.value!,
          name: values.name,
          abbreviation: values.abbreviation,
          code: values.code,
          active: true,
        };
        success = (await updateCountry(updateForm)) ? true : false;
        break;

      case 'delete':
        if (modalState.selectedItem !== null) {
          success = (await deleteCountry(modalState.selectedItem)) ? true : false;
        }
        break;
    }

    if (success || modalState.mode === 'view') {
      closeModal();
    }
  } catch (error: unknown) {
    console.error(error);
  } finally {
    finishLoading();
  }
});

/** Zona de Headers de la tabla */
const headers = ref<TableHeaders[]>([
  {
    field: 'id', // ---> corresponde al vinculador del item que recibira en su columna respectiva
    header: 'No', //---> corresponde al nombre de la cabecera de la columna
    sortable: false, // ---> si usted require que la columna sea sorteable
    alignHeaders: 'center', // ---> alineación de la cabecera, puede tener valores 'start', 'center' o 'end'
    alignItems: 'center', // ---> alineación de los items bajo esa cabecera ('start', 'center', 'end')
  },
  {
    field: 'name',
    header: 'Nombre',
    sortable: false,
    alignHeaders: 'center',
    alignItems: 'center',
  },
  {
    field: 'abbreviation',
    header: 'Abreviación',
    sortable: false,
    alignHeaders: 'center',
    alignItems: 'center',
  },
  {
    field: 'code',
    header: 'Código',
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

// const items = ref([
//   {
//     vinculador_uno: '1',
//     vinculador_dos: 'El Salvador',
//     vinculador_tres: 'ESA',
//     vinculador_cuatro: '503',
//     vinculador_cinco: 'Activo',
//     vinculador_seis: 'Editar | Eliminar',
//   },
//   {
//     vinculador_uno: '2',
//     vinculador_dos: 'Guatemala',
//     vinculador_tres: 'GTM',
//     vinculador_cuatro: '502',
//     vinculador_cinco: 'Activo',
//     vinculador_seis: 'Editar | Eliminar',
//   },
// ]);

/** Zona de Métodos */
const handlePagination = async (page: number) => {
  if (page + 1 === pagination.page) {
    return;
  }
  pagination.page = page + 1;
  getCountries();
};

onMounted(async () => {
  try {
    await getCountries(); 
  } catch (error) {
    console.log(error);
  }
});
</script>
<style scoped></style>

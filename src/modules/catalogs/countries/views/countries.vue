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
          />
          <Button class="flex-shrink-0 grow rounded-md">Buscar</Button>
          <Button class="flex-shrink-0 grow rounded-md" outlined
            >Limpiar</Button
          >
          <Button
            class="flex-shrink-0 grow rounded-md"
            @click="openModal('create')"
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
        :items="items"
        :paginator="true"
        :per_page="10"
        :total_pages="1"
      >
        <template #body-acciones="{ data }">
          <div class="flex gap-0 justify-center">
            <Button unstyled class="!outline-none">
              <i class="pi pi-eye cursor-pointer hover:text-blue-500 transition-colors p-2" @click="openModal('details', data)"></i>
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
              @click=""
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
          :show="showModal"
          show-icon-close
          :title="isDetailsMode ? 'Detalle País' : (isMode ? 'Editar País' : 'Agregar País')"
          :show-btn-confirm-footer="isDetailsMode ? false : true"
          :title-btn-confirm="isDetailsMode ? '' : 'Guardar'"
          :title-btn-cancel="isDetailsMode ? 'Cerrar' : 'Cancelar'"
          :show-buttons="!isDetailsMode"
          @close-modal="closeModalCreate"
          @confirm-modal="confirmModal"
          width="350px"
        >
          <div class="flex flex-col gap-6 py-5 w-[250px]">
            <AppInputText 
              v-model="name"
              class="lg:w-full grow sm:max-w-[500px]"
              label="Ingrese el nombre del país"
              v-bind="nameAttrs"
              :error-messages="errors.name"
              :disabled="isDetailsMode"
            />
            <AppInputText 
              v-model="abbreviation"
              class="lg:w-full grow sm:max-w-[500px]"
              label="Ingrese la abreviación del país"
              v-bind="abbreviationAttrs"
              :error-messages="errors.abbreviation"
              :disabled="isDetailsMode"
            />

            <AppInputText 
              v-model="code"
              class="lg:w-full grow sm:max-w-[500px]"
              label="Ingrese el código del país"
              v-bind="codeAttrs"
              :error-messages="errors.code"
              :disabled="isDetailsMode"
            />
          </div>
      </AppModal>
  </div>
</template>

<script setup lang="ts">
/** Zona de Imports */
import { onMounted, ref } from 'vue';
import { Button, Chip } from 'primevue';

import { TableHeaders } from '@/core/interfaces';
import AppTitle from '@/core/components/AppTitle.vue';
import AppModal from '@/core/components/AppModal.vue';
import { useLoaderStore } from '@/core/store';

import { useCountries } from '../../composables/useCountries';
import { CountryResponse } from '../../interfaces/country.response.interface';
import { CreateCountry } from '../../interfaces/country.create.interface';
const showModal = ref<boolean>(false);
const isMode = ref<boolean>(false);
const isDetailsMode = ref<boolean>(false);
const editingCountryId = ref<number | null>(null);


/** Zona de Variables */
const { startLoading, finishLoading } = useLoaderStore();
const items = ref<CountryResponse[] | undefined>([]);
const openModal = (type: 'create' | 'edit' | 'details', country?: any) => {
  // Resetear todos los estados
  isMode.value = false;
  isDetailsMode.value = false;
  editingCountryId.value = null;
  
  if (type === 'create') {
    console.log('type', type);
    // Limpiar los campos del formulario
    resetForm();
  } else if (type === 'edit') {
    isMode.value = true;
    // Rellena con los datos del país a editar
    editingCountryId.value = country.id;
    name.value = country.name || '';
    abbreviation.value = country.abbreviation || '';
    code.value = country.code || '';
  } else if (type === 'details') {
    console.log('entro a detalle:', country);
    isDetailsMode.value = true;
    // Rellena con los datos del país a ver
    name.value = country.name || '';
    abbreviation.value = country.abbreviation || '';
    code.value = country.code || '';
  }
  
  showModal.value = true;
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

} = useCountries();

const closeModalCreate = (value: boolean) => {
  showModal.value = value;
  if (!value) {
    // Resetear estados cuando se cierra el modal
    isMode.value = false;
    isDetailsMode.value = false;
  }
};
const confirmModal = handleSubmit(async values => {
   try {
    console.log('values:', values);
    startLoading();

    if(isMode.value && editingCountryId.value !== null) {
      // Modo edición

    }
    const form: CreateCountry= {
      name: values.name,
      abbreviation: values.abbreviation,
      code: values.code,
      active: true,
    };
    await createCountry(form);
    items.value = await getCountries();
    closeModalCreate(false);
    
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
onMounted(async () => {
  try {
    startLoading();
    items.value = await getCountries();
  } catch (error) {
    console.log(error);
  } finally {
    finishLoading();
  }
})
</script>
<style scoped></style>

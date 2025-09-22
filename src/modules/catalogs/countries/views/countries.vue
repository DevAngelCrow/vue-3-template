<template>
  <div class="py-5 px-5 h-screen max-h-screen">
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
        <template #body-acciones>
          <div class="flex gap-0 justify-center">
            <Button
              class="rounded-full mx-0 my-0 px-0 py-0"
              variant="text"
              icon="pi pi-pencil"
              @click=""
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
        <template #body-show="{ data }">
          <i :class="data ? 'pi pi-eye' : 'pi pi-eye-slash'"></i>
        </template>
      </AppDataTable>
    </section>
      <AppModal
          :show="showModal"
          show-icon-close
          :title="isMode ? 'Editar País' : 'Agregar País'"
          :title-btn-confirm="'Guardar'"
          :title-btn-cancel="'Cancelar'"
          @close-modal="closeModalCreate"
          @confirm-modal="confirmModal"
          width="350px"
          @next="next"
          @back="back"
        >
          <div class="flex flex-col gap-6 py-5 w-[250px]">
            <AppInputText 
              v-model="name"
              class="lg:w-full grow sm:max-w-[500px]"
              label="Ingrese el nombre del país"
              v-bind="nameAttrs"
            />
            <AppInputText 
              v-model="abbreviation"
              class="lg:w-full grow sm:max-w-[500px]"
              label="Ingrese la abreviación del país"
              v-bind="abbreviationAttrs"
            />

            <AppInputText 
              v-model="code"
              class="lg:w-full grow sm:max-w-[500px]"
              label="Ingrese el código del país"
              v-bind="codeAttrs"
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
const showModal = ref<boolean>(false);
const isMode = ref<boolean>(false);
const tempCountry = ref({
  nombre: '',
  abreviación: '',
  código: '',
});

/** Zona de Variables */
const { startLoading, finishLoading } = useLoaderStore();
const items = ref<CountryResponse[] | undefined>([]);
const openModal = (type: 'create' | 'edit', country?: any) => {
  if (type === 'create') {
    isMode.value = false;
    tempCountry.value = { nombre: '', abreviación: '', código: '' };
    showModal.value = true;
  } else {
    isMode.value = true;
    // Rellena con los datos del país a editar
    tempCountry.value = {
      nombre: country.vinculador_dos,
      abreviación: country.vinculador_tres,
      código: country.vinculador_cuatro,
    };
    showModal.value = true;
  }
};
const closeModalCreate = (value: boolean) => {
  showModal.value = value;
};
const confirmModal = () => handleSubmit(async values => {
   try {
    startLoading();
    const form = {
      name: values.nombre,
      abbreviation: values.abreviación,
      code: values.código,
      active: true,
    };
    await createCountry(form);
    items.value = await getCountries();
    
   } catch (error: unknown) {
    console.error(error);
  } finally {
    finishLoading();
  }
  closeModalCreate(false);
});

const next = async (callback: Function, step: number) => {
  try {
    let fieldsToValidate: string[] = [];
    if (fieldsToValidate.length > 0) {
      const validationResults = await Promise.all(
        fieldsToValidate.map(field => validateField(field)),
      );
      const allValid = validationResults.every(result => result.valid);

      if (allValid) {
        callback(step + 1);
      }
    } else {
      callback(step + 1);
    }
  } catch (error) {
    console.error(error, 'Error en la validación');
  }
};
const back = (callback: Function, step: number) => {
  try {
    callback(step - 1);
  } catch (error) {
    console.error(error);
  }
};

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

/** Zona de Composables */
const {
  getCountries,
  createCountry,
  handleSubmit,
  validateField,
  name,
  nameAttrs,
  abbreviation,
  abbreviationAttrs,
  code,
  codeAttrs

} = useCountries();

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

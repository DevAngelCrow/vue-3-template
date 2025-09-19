<template>

     <div class="flex flex-row flex-wrap gap-6 px-2 md:px-10 py-10">
        <AppTitle title="Países" 
           title-position="center" 
           class="w-full mb-12"/>

        <AppInputText 
          v-model="filters"
          class="lg:w-full grow sm:max-w-[500px]"
          label="Buscar"
          />
        <Button
            label="Buscar"
            icon-pos="right"
            class="flex sm:w-auto w-full px-7 text-sm"
            >
        </Button>
        <Button
            label="Limpiar"
            icon-pos="right"
            class="flex sm:w-auto w-full px-7 text-sm">
        </Button>

        <Button
          @click="openModal('create')"
          icon="pi pi-plus"
          class="flex w-10 h-10 rounded-full p-0 sm:ml-auto sm:mr-0 mx-auto">
        </Button>

        <AppModal
          :show="showModal"
          show-icon-close
          :title="isMode ? 'Editar País' : 'Agregar País'"
          @close-modal="closeModalCreate"
          @confirm-modal="confirmModal"
          width="350px"
        >
          <div class="flex flex-col gap-6 py-5 w-[230px]">
            <AppInputText 
              v-model="tempCountry.nombre"
              class="lg:w-full grow sm:max-w-[500px]"
              label="Ingrese el nombre del país"
            />
            <AppInputText 
              v-model="tempCountry.abreviación"
              class="lg:w-full grow sm:max-w-[500px]"
              label="Ingrese la abreviación del país"
            />

            <AppInputText 
              v-model="tempCountry.código"
              class="lg:w-full grow sm:max-w-[500px]"
              label="Ingrese el código del país"
            />
          </div>
        </AppModal>


        <AppDataTable
          :items="items"
          :headers="headers"
          :paginator="true"
          :per_page="10"
          :total_pages="1"
          class="w-full"
        >
        <template #body-vinculador_seis="{ data }">
          <i class="pi pi-pencil cursor-pointer hover:text-[#082f49] transition-colors" @click="openModal('edit', data)"></i>
          <i class="pi pi-trash px-[10px] cursor-pointer hover:text-[#c21f0d] transition-colors"></i>
          <i class="pi pi-times-circle  hover:text-[#c21f0d] transition-colors cursor-pointer"></i>
        </template>
        </AppDataTable>
        
     </div>

</template>

<script setup lang="ts">
import { TableHeaders } from '@/core/interfaces';
import { ref } from 'vue';
import { Button } from 'primevue';
import AppTitle from '@/core/components/AppTitle.vue';
import AppModal from '@/core/components/AppModal.vue';
const showModal= ref<boolean>(false);
const isMode = ref<boolean>(false);
const tempCountry = ref({
  nombre: '',
  abreviación: '',
  código: ''
});

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
      código: country.vinculador_cuatro
    };
    showModal.value = true;
  }
}


const closeModalCreate = (value: boolean) => {
  showModal.value = value;
};

const confirmModal = () => {

  closeModalCreate(false);
};

const headers = ref<TableHeaders[]>([
  {
    field: 'vinculador_uno', // ---> corresponde al vinculador del item que recibira en su columna respectiva
    header: 'No', //---> corresponde al nombre de la cabecera de la columna
    sortable: false, // ---> si usted require que la columna sea sorteable
    alignHeaders: 'center', // ---> alineación de la cabecera, puede tener valores 'start', 'center' o 'end'
    alignItems: 'center', // ---> alineación de los items bajo esa cabecera ('start', 'center', 'end')
  },
  {
    field: 'vinculador_dos',
    header: 'Nombre',
    sortable: false,
    alignHeaders: 'center',
    alignItems: 'center',
  },
  {
    field: 'vinculador_tres',
    header: 'Abreviación',
    sortable: false,
    alignHeaders: 'center',
    alignItems: 'center',
  },
  {
    field: 'vinculador_cuatro',
    header: 'Código',
    sortable: false,
    alignHeaders: 'center',
    alignItems: 'center',
  },
  {
    field: 'vinculador_cinco',
    header: 'Estado',
    sortable: false,
    alignHeaders: 'center',
    alignItems: 'center',
  },
  {
    field: 'vinculador_seis',
    header: 'Acciones',
    sortable: false,
    alignHeaders: 'center',
    alignItems: 'center',
  },
]);

const items = ref([
  {
    vinculador_uno: '1',
    vinculador_dos: 'El Salvador',
    vinculador_tres: 'ESA',
    vinculador_cuatro: '503',
    vinculador_cinco: 'Activo',
    vinculador_seis: 'Editar | Eliminar'
  },
  {
    vinculador_uno: '2',
    vinculador_dos: 'Guatemala',
    vinculador_tres: 'GTM',
    vinculador_cuatro: '502',
    vinculador_cinco: 'Activo',
    vinculador_seis: 'Editar | Eliminar'
  },
]);




</script>
<template>
  <div class="py-5 px-5 h-full max-h-full flex items-start justify-center">
    <section
      id="content"
      class="w-full xl:w-[80%] flex flex-row flex-wrap gap-5"
    >
      <AppTitle
        title="Países"
        class="w-full md:w-auto flex justify-center items-center"
      />
      <div
        id="inputs"
        class="flex rounded-lg py-0.5 px-0.5 gap-3 flex-wrap grow lg:grow-0 w-full"
      >
        <AppInputText
          label="Buscar..."
          class="min-w-auto w-full sm:w-[50%] grow lg:grow-0 shrink-0 md:w-45 lg:w-83.75"
          v-model="filter.filter_name"
          append-icon="pi pi-search"
          @input="validateAlphaInput(filter.filter_name)"
          @keydown.enter="debouncedFindCountries"
        />
        <AppSelect
          class="min-w-0 grow lg:grow-0 shrink-0 w-full sm:w-[40%] md:w-auto"
          :options="statusOptions"
          option-label="name"
          label="Estado"
          v-model="filter.status"
          option-value="value"
        />
        <Button
          class="shrink-0 grow md:grow-0 rounded-md"
          @click="debouncedFindCountries"
          >Buscar</Button
        >
        <Button
          class="shrink-0 grow md:grow-0 rounded-md"
          outlined
          @click="debouncedCleanSearch"
          :icon="iconFilter"
          label="Limpiar"
        ></Button>
        <Button
          class="shrink-0 grow md:grow-0 rounded-md ml-auto"
          @click="openModal('create')"
          ><i
            class="pi pi-plus-circle flex justify-center items-center text-center"
            style="font-size: 1.1rem; font-weight: bold"
          ></i
          ><span>Agregar</span>
        </Button>
      </div>
      <AppSkeleton
        :loading="storeLoader.isFetching"
        variant="table"
        :rows="pagination.per_page"
        :headers="headers"
      >
        <AppDataTable
          class="w-full"
          :headers="headers"
          :items="items"
          :paginator="true"
          :per-page="pagination.per_page"
          :total-items="pagination.total_items"
          :page="pagination.page"
          :show-per-page-options="true"
          :per-page-options="[10, 20, 50, 100]"
          @page-update="handlePagination"
          @per-page-update="handlePerPagePagination"
        >
          <template #body-acciones="{ data }">
            <div class="flex gap-0 justify-center">
              <Button
                class="rounded-full mx-0 my-0 px-0 py-0"
                variant="text"
                icon="pi pi-eye"
                @click="openModal('details', data)"
                v-tooltip.bottom="'Ver Detalle'"
              ></Button>
              <Button
                class="rounded-full mx-0 my-0 px-0 py-0"
                variant="text"
                icon="pi pi-pencil"
                @click="openModal('edit', data)"
                v-tooltip.bottom="'Editar'"
              ></Button>
              <Button
                class="rounded-full"
                variant="text"
                :severity="data?.active ? 'danger' : 'success'"
                :icon="data?.active ? 'pi pi-trash' : 'pi pi-check-circle'"
                @click="openModalEstado('changeStatus', data)"
                v-tooltip.bottom="data?.active ? 'Desactivar' : 'Activar'"
              ></Button>
            </div>
          </template>
          <template #body-active="{ data }">
            <AppChipStatus
              :label="data?.status?.name"
              :background-color="data?.status?.state_color"
              :text-color="data?.status?.text_color"
            >
            </AppChipStatus>
          </template>
          <template #body-name="{ data }">
            <div class="flex items-center gap-2">
              <span v-if="data.iso2" class="text-lg">
                <span
                  :class="`fi fi-${data.iso2.toLowerCase()}`"
                  style="
                    width: 1.5em;
                    height: 1.1em;
                    display: inline-block;
                    border-radius: 2px;
                  "
                ></span>
              </span>
              <span>{{ data.name }}</span>
            </div>
          </template>
        </AppDataTable>
      </AppSkeleton>
    </section>
    <AppModal
      :show="showModal"
      show-close-icon
      :title="
        isDetailsMode ? 'Detalle País' : isMode ? 'Editar País' : 'Agregar País'
      "
      :show-confirm-button="!isDetailsMode"
      :confirm-label="isDetailsMode ? '' : 'Guardar'"
      :cancel-label="isDetailsMode ? 'Cerrar' : 'Cancelar'"
      show-footer
      @close-modal="closeModalCreate"
      @confirm-modal="confirmModal"
      width="350px"
    >
      <div class="flex flex-col gap-6 py-5 w-62.5">
        <AppInputText
          v-model="name"
          class="lg:w-full grow sm:max-w-125"
          label="Ingrese el nombre del país"
          v-bind="nameAttrs"
          :error-message="errors.name"
          :disabled="isDetailsMode"
        />
        <AppInputText
          v-model="abbreviation"
          class="lg:w-full grow sm:max-w-125"
          label="Ingrese la abreviación del país"
          v-bind="abbreviationAttrs"
          :error-message="errors.abbreviation"
          :disabled="isDetailsMode"
        />
        <AppInputMask
          v-model="code"
          class="lg:w-full grow sm:max-w-125"
          label="Ingrese el código del país"
          v-bind="codeAttrs"
          :error-message="errors.code"
          :disabled="isDetailsMode"
          mask="999"
          placeholder="000"
        />
        <AppInputText
          v-model="iso2"
          class="lg:w-full grow sm:max-w-125"
          label="Ingrese el código ISO2"
          v-bind="iso2Attrs"
          :error-message="errors.iso2"
          :disabled="isDetailsMode"
          maxlength="2"
        />
        <AppInputText
          v-model="phone_code"
          class="lg:w-full grow sm:max-w-125"
          label="Ingrese el código de teléfono"
          v-bind="phoneCodeAttrs"
          :error-message="errors.phone_code"
          :disabled="isDetailsMode"
          maxlength="10"
        />
      </div>
    </AppModal>

    <AppModal
      :show="showModalCambioStatus"
      show-close-icon
      title="Cambiar estado"
      :show-confirm-button="true"
      confirm-label="Confirmar"
      cancel-label="Cancelar"
      :show-footer="true"
      @close-modal="CloseModalEstado"
      @confirm-modal="confirmModalEstado(idCountry!)"
      width="450px"
    >
      <div class="flex flex-col gap-6 py-5 w-full">
        <p class="text-center">
          ¿Está seguro que desea cambiar el estado del país?
        </p>
      </div>
    </AppModal>
  </div>
</template>

<script setup lang="ts">
/** Zona de Imports */
import { computed, ref } from 'vue';
import { Button } from 'primevue';

import { TableHeaders } from '@/core/interfaces';
import AppTitle from '@/core/components/AppTitle.vue';
import AppModal from '@/core/components/AppModal.vue';
import { useLoaderStore } from '@/core/store';

import { useCountries } from '../../composables/useCountries';
import { CreateCountry } from '../../interfaces/country.create.interface';
import { UpdateCountry } from '../../interfaces/country.update.interface';
const showModal = ref<boolean>(false);
const isMode = ref<boolean>(false);
const isDetailsMode = ref<boolean>(false);
const editingCountryId = ref<string | null>(null);
const showModalCambioStatus = ref<boolean>(false);
const idCountry = ref<string>();

/** Zona de Variables */
const storeLoader = useLoaderStore();
const { startLoading, finishLoading } = storeLoader;
const openModal = (type: 'create' | 'edit' | 'details', country?: any) => {
  // Resetear todos los estados
  isMode.value = false;
  isDetailsMode.value = false;
  editingCountryId.value = null;

  if (type === 'create') {
    // Limpiar los campos del formulario
    resetForm();
  } else if (type === 'edit') {
    isMode.value = true;
    // Rellena con los datos del país a editar
    editingCountryId.value = country.id;
    name.value = country.name || '';
    abbreviation.value = country.abbreviation || '';
    code.value = country.code || '';
    iso2.value = country.iso2 || '';
    phone_code.value = country.phone_code || '';
  } else if (type === 'details') {
    isDetailsMode.value = true;
    // Rellena con los datos del país a ver
    name.value = country.name || '';
    abbreviation.value = country.abbreviation || '';
    code.value = country.code || '';
    iso2.value = country.iso2 || '';
    phone_code.value = country.phone_code || '';
  }

  showModal.value = true;
};

const openModalEstado = (type: 'changeStatus', country?: any) => {
  if (type === 'changeStatus') {
    idCountry.value = country.id;
  }
  showModalCambioStatus.value = true;
};

/** Zona de Composables */
const {
  items,
  createCountry,
  updateCountry,
  changeStatusCountry,
  handleSubmit,
  name,
  nameAttrs,
  abbreviation,
  abbreviationAttrs,
  code,
  codeAttrs,
  iso2,
  iso2Attrs,
  phone_code,
  phoneCodeAttrs,
  errors,
  resetForm,
  filter,
  debouncedFindCountries,
  validateAlphaInput,
  debouncedCleanSearch,
  pagination,
} = useCountries();

const statusOptions = ref<{ name: string; value: boolean | null | 'Todos' }[]>([
  { name: 'Todos', value: 'Todos' },
  { name: 'Activo', value: true },
  { name: 'Inactivo', value: false },
]);
const closeModalCreate = (value: boolean) => {
  showModal.value = value;
  if (!value) {
    // Resetear estados cuando se cierra el modal
    isMode.value = false;
    isDetailsMode.value = false;
    editingCountryId.value = null;
  }
};

const CloseModalEstado = (value: boolean) => {
  showModalCambioStatus.value = value;
};
const confirmModal = handleSubmit(async values => {
  try {
    startLoading();

    if (isMode.value && editingCountryId.value !== null) {
      // Modo edición
      const updateForm: UpdateCountry = {
        name: values.name,
        abbreviation: values.abbreviation,
        code: values.code,
        iso2: values.iso2,
        phone_code: values.phone_code,
        active: true,
      };
      await updateCountry(editingCountryId.value, updateForm);
    } else {
      // Modo creación
      const form: CreateCountry = {
        name: values.name,
        abbreviation: values.abbreviation,
        code: values.code,
        iso2: values.iso2,
        phone_code: values.phone_code,
        active: true,
      };
      await createCountry(form);
    }
    closeModalCreate(false);
  } catch (error: unknown) {
    console.error(error);
  } finally {
    finishLoading();
  }
});
const confirmModalEstado = async (id: string) => {
  try {
    startLoading();
    await changeStatusCountry(id);
    CloseModalEstado(false);
  } catch (error) {
    console.error(error);
  } finally {
    finishLoading();
  }
};
/** Zona de Headers de la tabla */
const headers = ref<TableHeaders[]>([
  {
    field: 'name',
    header: 'Nombre',
    sortable: false,
    alignHeaders: 'start',
    alignItems: 'start',
  },
  {
    field: 'abbreviation',
    header: 'Abreviación',
    sortable: false,
    alignHeaders: 'start',
    alignItems: 'start',
  },
  {
    field: 'code',
    header: 'Código',
    sortable: false,
    alignHeaders: 'center',
    alignItems: 'center',
  },
  {
    field: 'phone_code',
    header: 'Código de Teléfono',
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
    width: 10,
  },
  {
    field: 'acciones',
    header: 'Acciones',
    sortable: false,
    alignHeaders: 'center',
    alignItems: 'center',
  },
]);

const handlePagination = (page: number) => {
  if (page + 1 === pagination.page) return;
  pagination.page = page + 1;
};
const handlePerPagePagination = (perPage: number) => {
  if (perPage === pagination.per_page) return;

  pagination.per_page = perPage;
  pagination.page = 1;
};
const iconFilter = computed(() => {
  const filterValues = Object.values(filter).some(v => v);
  if (!filterValues) {
    return 'pi pi-filter';
  }
  return 'pi pi-filter-slash';
});
</script>
<style scoped></style>

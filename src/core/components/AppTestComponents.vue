<script setup lang="ts">
import { ref } from 'vue';
import { Button, type AutoCompleteCompleteEvent } from 'primevue';

import type { TableHeaders } from '../interfaces';

defineOptions({ name: 'AppTestComponents' });

const showModal = ref<boolean>(false);
const textValue = ref<string>('');
const passwordValue = ref<string>('');
const maskValue = ref<string>('');
const numberValue = ref<number | null>(null);
const moneyValue = ref<number | undefined>(undefined);
const textareaValue = ref<string>('');
const dateValue = ref<string | null>(null);
const timeValue = ref<string | null>(null);
const colorValue = ref<string>('#10b981');
const checkValue = ref<boolean>(false);
const selectValue = ref<string | undefined>(undefined);
const multiSelectValue = ref<unknown[]>([]);
const autoCompleteValue = ref<unknown>(undefined);

interface OptionItem {
  id: string;
  name: string;
}

const sampleOptions = ref<OptionItem[]>([
  { id: '1', name: 'Opción Uno' },
  { id: '2', name: 'Opción Dos' },
  { id: '3', name: 'Opción Tres' },
]);

const filteredOptions = ref<OptionItem[]>([]);

const searchOptions = (event: AutoCompleteCompleteEvent) => {
  const query = event.query.toLowerCase();
  filteredOptions.value = sampleOptions.value.filter(item =>
    item.name.toLowerCase().includes(query),
  );
};

interface SampleRow {
  estado: boolean;
  vinculador_dos: string;
  vinculador_tres: string;
}

const headers = ref<TableHeaders[]>([
  {
    field: 'estado',
    header: 'Selección',
    sortable: false,
    alignHeaders: 'center',
    alignItems: 'center',
    width: 15,
  },
  {
    field: 'vinculador_dos',
    header: 'Columna Dos',
    sortable: true,
    alignHeaders: 'start',
    alignItems: 'start',
  },
  {
    field: 'vinculador_tres',
    header: 'Columna Tres',
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
    width: 15,
  },
]);

const items = ref<SampleRow[]>([
  {
    estado: false,
    vinculador_dos: 'Registro de ejemplo 1',
    vinculador_tres: 'Activo',
  },
  {
    estado: true,
    vinculador_dos: 'Registro de ejemplo 2',
    vinculador_tres: 'Inactivo',
  },
]);
</script>

<template>
  <div class="p-6 flex flex-col gap-6 max-w-6xl mx-auto">
    <AppTitle title="Catálogo de Componentes Base (PrimeVue v5)" />

    <AppCard class="border border-surface-200 shadow-xs">
      <template #title>Entradas y Formularios</template>
      <template #content>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 pt-2">
          <AppInputText
            v-model="textValue"
            label="Texto con ícono"
            prepend-icon="pi pi-user"
            append-icon="pi pi-search"
            class="w-full"
          />
          <AppInputText
            v-model="passwordValue"
            type="password"
            label="Contraseña"
            prepend-icon="pi pi-lock"
            class="w-full"
          />
          <AppInputMask
            v-model="maskValue"
            label="Teléfono"
            mask="9999-9999"
            placeholder="2222-2222"
            class="w-full"
          />
          <AppSelect
            v-model="selectValue"
            :options="sampleOptions"
            option-label="name"
            option-value="id"
            label="Selector simple"
            class="w-full"
          />
          <AppMultiSelect
            v-model="multiSelectValue"
            :options="sampleOptions"
            option-label="name"
            label="Selector múltiple"
            class="w-full"
          />
          <AppAutocomplete
            v-model="autoCompleteValue"
            :suggestions="filteredOptions"
            option-label="name"
            label="Autocompletado"
            dropdown
            class="w-full"
            @complete="searchOptions"
          />
          <AppInputNumber
            v-model="numberValue"
            label="Cantidad"
            show-buttons
            class="w-full"
          />
          <AppInputMoney
            v-model="moneyValue"
            label="Monto (USD)"
            class="w-full"
          />
          <AppDatePicker
            v-model="dateValue"
            label="Fecha"
            class="w-full"
          />
          <AppTimePicker
            v-model="timeValue"
            label="Hora"
            class="w-full"
          />
          <AppColorPicker
            v-model="colorValue"
            label="Color"
            class="w-full"
          />
          <div class="flex items-center gap-4">
            <AppCheckBox
              v-model="checkValue"
              label="Casilla de verificación"
              binary
            />
            <AppCircularCounter :selected="3" :total="10" color="primary" />
          </div>
          <AppInputTextArea
            v-model="textareaValue"
            label="Observaciones"
            class="w-full sm:col-span-2 lg:col-span-3"
          />
        </div>
      </template>
    </AppCard>

    <AppCard class="border border-surface-200 shadow-xs">
      <template #title>
        <div class="flex items-center justify-between">
          <span>Tabla de Datos y Estado</span>
          <Button label="Abrir Modal" icon="pi pi-external-link" @click="showModal = true" />
        </div>
      </template>
      <template #content>
        <AppDataTable
          :headers="headers"
          :items="items"
          :paginator="true"
          :per-page="10"
          :total-items="items.length"
          :page="1"
        >
          <template #body-estado="{ data }">
            <AppCheckBox v-model="data.estado" binary />
          </template>
          <template #body-vinculador_tres="{ data }">
            <AppChipStatus
              :label="data.vinculador_tres"
              :background-color="data.estado ? '#10b981' : '#ef4444'"
              :text-color="data.estado ? '#065f46' : '#991b1b'"
            />
          </template>
          <template #body-acciones>
            <div class="flex gap-1 justify-center">
              <Button icon="pi pi-pencil" variant="text" rounded />
              <Button icon="pi pi-trash" variant="text" severity="danger" rounded />
            </div>
          </template>
        </AppDataTable>
      </template>
    </AppCard>

    <AppModal
      v-model:show="showModal"
      title="Modal de Prueba"
      show-close-icon
      @close-modal="showModal = false"
      @confirm-modal="showModal = false"
    >
      <div class="py-4 text-center">
        Contenido de prueba del modal alineado con PrimeVue v5.
      </div>
    </AppModal>
  </div>
</template>

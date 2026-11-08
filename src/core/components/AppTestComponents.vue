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
const iconValue = ref<string>('pi pi-check');
const stepperValue = ref<string>('1');
const activeTab = ref<string>('info');

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

const tabItems = [
  { value: 'info', label: 'Información General', icon: 'pi pi-info-circle' },
  { value: 'config', label: 'Configuración', icon: 'pi pi-cog' },
  { value: 'audit', label: 'Auditoría', icon: 'pi pi-history', badge: '3' },
];

const stepperSteps = [
  { value: '1', label: 'Datos Básicos', icon: 'pi pi-user' },
  { value: '2', label: 'Dirección', icon: 'pi pi-map-marker' },
  { value: '3', label: 'Confirmación', icon: 'pi pi-check' },
];
</script>

<template>
  <div class="p-6 flex flex-col gap-6 max-w-6xl mx-auto">
    <AppTitle title="Catálogo de Componentes Base (PrimeVue v5)" />

    <!-- Sección de Entradas y Formularios -->
    <AppCard class="border border-surface-200 shadow-xs">
      <template #title>Entradas y Formularios</template>
      <template #content>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 pt-2">
          <AppInputText
            v-model="textValue"
            label="Texto con ícono"
            show-icon
            prepend-inner-icon="pi pi-user"
            class="w-full"
          />
          <AppInputText
            v-model="passwordValue"
            type="password"
            label="Contraseña"
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
          <AppIconSelect
            v-model="iconValue"
            label="Selector de Icono"
            class="w-full"
          />
          <AppDatePicker v-model="dateValue" label="Fecha" class="w-full" />
          <AppTimePicker v-model="timeValue" label="Hora" class="w-full" />
          <AppColorPicker v-model="colorValue" label="Color" class="w-full" />
          <div class="flex items-center gap-4">
            <AppCheckBox
              v-model="checkValue"
              label="Casilla de verificación"
              binary
            />
            <AppCircularCounter :selected="3" :total="10" color="primary" />
          </div>
          <div class="flex items-center gap-2 flex-wrap">
            <AppChip label="Chip Primario" severity="primary" />
            <AppChip
              label="Chip Exitoso"
              severity="success"
              icon="pi pi-check"
            />
            <AppChip
              label="Chip Alerta"
              severity="warn"
              icon="pi pi-exclamation-triangle"
            />
          </div>
          <AppInputextArea
            v-model="textareaValue"
            label="Observaciones"
            class="w-full sm:col-span-2 lg:col-span-3"
          />
        </div>
      </template>
    </AppCard>

    <!-- Sección de Pestañas (AppTab) -->
    <AppCard class="border border-surface-200 shadow-xs">
      <template #title>Navegación por Pestañas (AppTab)</template>
      <template #content>
        <AppTab v-model:active="activeTab" :tabs="tabItems">
          <template #panel-info>
            <div class="p-4 text-sm text-surface-600">
              Contenido del panel de <strong>Información General</strong>.
            </div>
          </template>
          <template #panel-config>
            <div class="p-4 text-sm text-surface-600">
              Configuraciones avanzadas del sistema.
            </div>
          </template>
          <template #panel-audit>
            <div class="p-4 text-sm text-surface-600">
              Historial de cambios y auditoría operativa.
            </div>
          </template>
        </AppTab>
      </template>
    </AppCard>

    <!-- Sección de Asistente de Pasos (AppStepper) -->
    <AppCard class="border border-surface-200 shadow-xs">
      <template #title>Asistente por Pasos (AppStepper)</template>
      <template #content>
        <AppStepper v-model:active="stepperValue" :steps="stepperSteps">
          <template #step-1>
            <div class="p-4 border border-surface-200 rounded-lg text-sm">
              Paso 1: Ingrese la información básica del usuario.
            </div>
          </template>
          <template #step-2>
            <div class="p-4 border border-surface-200 rounded-lg text-sm">
              Paso 2: Ingrese los datos de dirección y contacto.
            </div>
          </template>
          <template #step-3>
            <div class="p-4 border border-surface-200 rounded-lg text-sm">
              Paso 3: Revise y confirme los datos ingresados.
            </div>
          </template>
        </AppStepper>
      </template>
    </AppCard>

    <!-- Sección de Tabla de Datos y Modal -->
    <AppCard class="border border-surface-200 shadow-xs">
      <template #title>
        <div class="flex items-center justify-between">
          <span>Tabla de Datos y Estado</span>
          <Button
            label="Abrir Modal"
            icon="pi pi-external-link"
            @click="showModal = true"
          />
        </div>
      </template>
      <template #content>
        <AppDataTable
          :headers="headers"
          :items="items"
          :paginator="true"
          :per_page="10"
          :total_items="items.length"
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
              <Button
                icon="pi pi-trash"
                variant="text"
                severity="danger"
                rounded
              />
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
        Contenido de prueba del modal alineado con PrimeVue v5 y diseño
        responsivo.
      </div>
    </AppModal>
  </div>
</template>

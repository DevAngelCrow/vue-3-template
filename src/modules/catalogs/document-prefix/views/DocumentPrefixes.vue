<template>
  <div class="py-5 px-5 h-full max-h-full flex items-start justify-center">
    <section
      id="document_prefix_content"
      class="w-full xl:w-[85%] flex flex-row flex-wrap gap-5"
    >
      <AppTitle
        title="Prefijos y Series de Documentos"
        class="w-full md:w-auto flex justify-center items-center"
      />

      <div
        id="inputs"
        class="flex rounded-lg py-0.5 px-0.5 gap-3 flex-wrap grow lg:grow-0 w-full items-center"
      >
        <AppInputText
          label="Buscar prefijo, serie o entidad..."
          class="min-w-auto w-full sm:w-[50%] grow lg:grow-0 shrink-0 md:w-60 lg:w-96"
          v-model="filter.filter_name"
          append-icon="pi pi-search"
        />
        <AppSelect
          class="w-full sm:w-[40%] md:w-auto min-w-0 grow lg:grow-0 shrink-0"
          :options="statusOptions"
          option-label="name"
          label="Estado"
          v-model="filter.status"
          option-value="value"
        />
        <Button
          class="shrink-0 grow md:grow-0 rounded-md"
          outlined
          @click="debouncedCleanSearch"
          label="Limpiar"
          icon="pi pi-filter-slash"
        />
        <Button
          class="shrink-0 grow md:grow-0 rounded-md"
          outlined
          icon="pi pi-refresh"
          label="Actualizar"
          :loading="isFetching"
          @click="refetch()"
        />
        <Button
          class="shrink-0 grow md:grow-0 rounded-md ml-auto"
          icon="pi pi-plus-circle"
          label="Agregar Serie"
          @click="openModal('add')"
        />
      </div>

      <AppSkeleton
        :loading="isFetching"
        variant="table"
        :rows="6"
        :headers="headers"
      >
        <AppDataTable
          class="w-full shadow-xs"
          :headers="headers"
          :items="filteredDocumentPrefixes"
          :paginator="false"
        >
          <template #body-prefix="{ data }">
            <Tag
              :value="data.prefix"
              severity="info"
              class="font-bold font-mono text-sm px-2.5 py-1 tracking-wider"
            />
          </template>

          <template #body-code="{ data }">
            <span class="font-mono text-xs text-surface-600 font-medium">
              {{ data.code }}
            </span>
          </template>

          <template #body-entity_target="{ data }">
            <span
              class="font-mono text-xs bg-surface-100 text-surface-700 px-2 py-0.5 rounded border border-surface-200"
            >
              {{ data.entity_target }}
            </span>
          </template>

          <template #body-current_status="{ data }">
            <span class="text-xs font-mono">
              {{
                data.current_year
                  ? `${data.current_year} (N° ${data.current_value})`
                  : `N° ${data.current_value}`
              }}
            </span>
          </template>

          <template #body-next_preview="{ data }">
            <Tag
              :value="data.next_preview"
              severity="success"
              class="font-bold font-mono text-xs px-2.5 py-1"
            />
          </template>

          <template #body-active="{ data }">
            <AppChipStatus
              :label="
                data?.status?.name || (data?.active ? 'Activo' : 'Inactivo')
              "
              :background-color="data?.status?.state_color"
              :text-color="data?.status?.text_color"
              :active="data?.active"
            />
          </template>

          <template #body-acciones="{ data }">
            <div class="flex gap-1 justify-center">
              <Button
                class="rounded-full"
                variant="text"
                icon="pi pi-eye"
                v-tooltip.bottom="'Ver Detalle y Configuración'"
                @click="openModal('view', data)"
              />
              <Button
                class="rounded-full"
                variant="text"
                icon="pi pi-pencil"
                v-tooltip.bottom="'Editar Serie y Formato'"
                @click="openModal('edit', data)"
              />
              <Button
                class="rounded-full"
                variant="text"
                :severity="data?.active ? 'danger' : 'success'"
                :icon="data?.active ? 'pi pi-trash' : 'pi pi-check-circle'"
                v-tooltip.bottom="
                  data?.active ? 'Desactivar Serie' : 'Activar Serie'
                "
                @click="openModal('delete', data)"
              />
            </div>
          </template>
        </AppDataTable>
      </AppSkeleton>
    </section>

    <DocumentPrefixFormModal
      :modal-state="modalState"
      @close-modal="closeModal"
    />
  </div>
</template>

<script setup lang="ts">
import { provide, ref } from 'vue';
import { Button, Tag } from 'primevue';

import AppTitle from '@/core/components/AppTitle.vue';
import AppInputText from '@/core/components/AppInputText.vue';
import AppSelect from '@/core/components/AppSelect.vue';
import AppDataTable from '@/core/components/AppDataTable.vue';
import AppSkeleton from '@/core/components/AppSkeleton.vue';
import AppChipStatus from '@/core/components/AppChipStatus.vue';

import { useDocumentPrefix } from '../../composables/useDocumentPrefix';
import DocumentPrefixFormModal from '../components/DocumentPrefixFormModal.vue';

const documentPrefixInstance = useDocumentPrefix();
provide('useDocumentPrefix', documentPrefixInstance);

const {
  filter,
  headers,
  filteredDocumentPrefixes,
  isFetching,
  refetch,
  debouncedCleanSearch,
  modalState,
  openModal,
  closeModal,
} = documentPrefixInstance;

const statusOptions = ref<{ name: string; value: boolean | 'Todos' }[]>([
  { name: 'Todos', value: 'Todos' },
  { name: 'Activo', value: true },
  { name: 'Inactivo', value: false },
]);
</script>

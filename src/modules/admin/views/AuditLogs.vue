<template>
  <div class="py-5 px-5 h-full max-h-full flex items-start justify-center">
    <section
      id="audit_logs_content"
      class="w-full xl:w-[90%] flex flex-col gap-5"
    >
      <AppTitle title="Logs de Auditoría" class="w-full md:w-auto" />

      <div
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 w-full items-start"
      >
        <AppSelect
          v-model="filter.action"
          class="lg:col-span-2"
          label="Acción"
          :options="actionOptions"
          option-label="label"
          option-value="value"
          filter
          show-clear
        />
        <AppInputText
          v-model="filter.entity_type"
          class="lg:col-span-1"
          label="Entidad"
          @keydown.enter="debouncedFindAuditLogs"
        />
        <AppInputText
          v-model="filter.user_id"
          class="lg:col-span-1"
          label="ID Usuario"
          @keydown.enter="debouncedFindAuditLogs"
        />
        <AppInputText
          v-model="filter.request_id"
          class="lg:col-span-2"
          label="Request ID"
          @keydown.enter="debouncedFindAuditLogs"
        />
        <AppDatePicker
          v-model="filter.from"
          class="lg:col-span-2"
          label="Desde"
          show-button-bar
        />
        <AppDatePicker
          v-model="filter.to"
          class="lg:col-span-2"
          label="Hasta"
          show-button-bar
        />
        <div
          class="sm:col-span-2 lg:col-span-2 flex flex-col sm:flex-row gap-3 w-full"
        >
          <Button
            class="w-full sm:w-auto rounded-md"
            icon="pi pi-search"
            label="Buscar"
            @click="debouncedFindAuditLogs"
          />
          <Button
            class="w-full sm:w-auto rounded-md"
            outlined
            :icon="iconFilter"
            label="Limpiar"
            @click="debouncedCleanSearch"
          />
        </div>
      </div>

      <AppSkeleton
        :loading="isFetching"
        variant="table"
        :rows="pagination.per_page"
        :headers="headers"
        show-paginator
      >
        <AppDataTable
          class="w-full"
          :headers="headers"
          :items="auditLogs"
          :paginator="true"
          :per_page="pagination.per_page"
          :total_items="pagination.total_items"
          :page="pagination.page"
          :show-per-page-options="true"
          :per-page-options="[10, 20, 50, 100]"
          @page-update="handlePagination"
          @per-page-update="handlePerPagePagination"
        >
          <template #body-created_at="{ data }">
            <span class="whitespace-nowrap text-xs sm:text-sm">
              {{ formatAuditDate(data.created_at) }}
            </span>
          </template>

          <template #body-action="{ data }">
            <AppChip :label="data.action" />
          </template>

          <template #body-user_name="{ data }">
            <span class="text-sm">{{ data.user_name || '—' }}</span>
          </template>

          <template #body-entity_type="{ data }">
            <span class="text-sm">{{ data.entity_type || '—' }}</span>
          </template>

          <template #body-ip_address="{ data }">
            <span class="text-xs font-mono">{{ data.ip_address || '—' }}</span>
          </template>

          <template #body-request_id="{ data }">
            <span class="text-xs font-mono break-all">
              {{ data.request_id || '—' }}
            </span>
          </template>

          <template #body-acciones="{ data }">
            <div class="flex justify-center">
              <Button
                class="rounded-full"
                variant="text"
                icon="pi pi-eye"
                v-tooltip.bottom="'Ver detalle'"
                @click="openDetailModal(data)"
              />
            </div>
          </template>
        </AppDataTable>
      </AppSkeleton>
    </section>

    <AuditLogDetailModal
      :show="detailModalOpen"
      :log="selectedLog"
      :format-date="formatAuditDate"
      @close-modal="closeDetailModal"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { Button } from 'primevue';

import AuditLogDetailModal from '../components/audit/AuditLogDetailModal.vue';
import { useAuditLogs } from '../composables/useAuditLogs';
import type { AuditLogResponse } from '../interfaces/audit/audit-log.interface';

const {
  headers,
  actionOptions,
  pagination,
  filter,
  auditLogs,
  isFetching,
  debouncedFindAuditLogs,
  debouncedCleanSearch,
  formatAuditDate,
} = useAuditLogs();

const detailModalOpen = ref(false);
const selectedLog = ref<AuditLogResponse | null>(null);

const openDetailModal = (log: AuditLogResponse) => {
  selectedLog.value = log;
  detailModalOpen.value = true;
};

const closeDetailModal = () => {
  detailModalOpen.value = false;
  selectedLog.value = null;
};

const handlePagination = (page: number) => {
  if (page + 1 === pagination.page) return;
  pagination.page = page + 1;
};

const handlePerPagePagination = (perPage: number) => {
  if (perPage === pagination.per_page) return;
  pagination.per_page = perPage;
  pagination.page = 1;
};

const iconFilter = computed(() =>
  Object.values(filter).some(Boolean) ? 'pi pi-filter-slash' : 'pi pi-filter',
);
</script>

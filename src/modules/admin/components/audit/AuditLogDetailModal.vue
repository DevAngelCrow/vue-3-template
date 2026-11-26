<template>
  <AppModal
    :title="'Detalle del Log de Auditoría'"
    :show="props.show"
    title-btn-cancel="Cerrar"
    footer-buttons
    show-icon-close
    width="48rem"
    :show-btn-confirm-footer="false"
    @close-modal="emit('close-modal')"
  >
    <div v-if="props.log" class="w-full space-y-4 py-2">
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div class="space-y-1">
          <p class="text-xs font-medium text-surface-500">Acción</p>
          <p class="text-sm font-semibold text-surface-900 break-all">
            {{ props.log.action }}
          </p>
        </div>
        <div class="space-y-1">
          <p class="text-xs font-medium text-surface-500">Fecha</p>
          <p class="text-sm text-surface-800">
            {{ props.formatDate(props.log.created_at) }}
          </p>
        </div>
        <div class="space-y-1">
          <p class="text-xs font-medium text-surface-500">Usuario</p>
          <p class="text-sm text-surface-800 break-all">
            {{ props.log.user_name || '—' }}
          </p>
        </div>
        <div class="space-y-1">
          <p class="text-xs font-medium text-surface-500">ID Usuario</p>
          <p class="text-sm text-surface-800 break-all">
            {{ props.log.user_id || '—' }}
          </p>
        </div>
        <div class="space-y-1">
          <p class="text-xs font-medium text-surface-500">Entidad</p>
          <p class="text-sm text-surface-800 break-all">
            {{ props.log.entity_type || '—' }}
          </p>
        </div>
        <div class="space-y-1">
          <p class="text-xs font-medium text-surface-500">ID Entidad</p>
          <p class="text-sm text-surface-800 break-all">
            {{ props.log.entity_id || '—' }}
          </p>
        </div>
        <div class="space-y-1">
          <p class="text-xs font-medium text-surface-500">Dirección IP</p>
          <p class="text-sm text-surface-800 break-all">
            {{ props.log.ip_address || '—' }}
          </p>
        </div>
        <div class="space-y-1">
          <p class="text-xs font-medium text-surface-500">Request ID</p>
          <p class="text-sm text-surface-800 break-all">
            {{ props.log.request_id || '—' }}
          </p>
        </div>
      </div>

      <div class="space-y-1">
        <p class="text-xs font-medium text-surface-500">User-Agent</p>
        <p class="text-xs text-surface-700 break-all">
          {{ props.log.user_agent || '—' }}
        </p>
      </div>

      <div class="space-y-1">
        <p class="text-xs font-medium text-surface-500">Metadata</p>
        <pre
          class="w-full overflow-x-auto rounded-lg border border-surface-200 bg-surface-50 p-3 text-xs text-surface-800"
          >{{ formattedMetadata }}</pre
        >
      </div>
    </div>
  </AppModal>
</template>

<script setup lang="ts">
import { computed } from 'vue';

import AppModal from '@/core/components/AppModal.vue';

import type { AuditLogResponse } from '../../interfaces/audit/audit-log.interface';

const props = defineProps<{
  show: boolean;
  log: AuditLogResponse | null;
  formatDate: (value: string | null | undefined) => string;
}>();

const emit = defineEmits<{
  (e: 'close-modal'): void;
}>();

const formattedMetadata = computed(() => {
  if (!props.log?.metadata) return 'Sin metadata adicional';
  return JSON.stringify(props.log.metadata, null, 2);
});
</script>

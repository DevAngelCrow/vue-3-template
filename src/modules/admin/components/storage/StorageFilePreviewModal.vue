<template>
  <AppModal
    :title="props.file?.filename || 'Detalle del Archivo'"
    :show="props.show"
    title-btn-cancel="Cerrar"
    footer-buttons
    show-icon-close
    width="45rem"
    :show-btn-confirm-footer="false"
    @close-modal="emit('close-modal')"
  >
    <div v-if="props.file" class="w-full space-y-4 py-2">
      <div
        v-if="isImage && resolvedUrl"
        class="w-full flex justify-center rounded-lg border border-surface-200 bg-surface-50 p-3"
      >
        <img
          :src="resolvedUrl"
          :alt="props.file.filename"
          class="max-h-72 w-auto rounded object-contain"
        />
      </div>

      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div class="space-y-1">
          <p class="text-xs font-medium text-surface-500">Nombre</p>
          <p class="text-sm font-semibold text-surface-900 break-all">
            {{ props.file.filename }}
          </p>
        </div>
        <div class="space-y-1">
          <p class="text-xs font-medium text-surface-500">Tipo MIME</p>
          <p class="text-sm text-surface-800">{{ props.file.mime_type }}</p>
        </div>
        <div class="space-y-1">
          <p class="text-xs font-medium text-surface-500">Tamaño</p>
          <p class="text-sm text-surface-800">
            {{ props.formatSize(props.file.size) }}
          </p>
        </div>
        <div class="space-y-1">
          <p class="text-xs font-medium text-surface-500">Proveedor</p>
          <p class="text-sm text-surface-800">
            {{ props.providerLabel }}
          </p>
        </div>
        <div class="space-y-1">
          <p class="text-xs font-medium text-surface-500">Fecha de creación</p>
          <p class="text-sm text-surface-800">
            {{ props.formatDate(props.file.created_at) }}
          </p>
        </div>
        <div class="space-y-1">
          <p class="text-xs font-medium text-surface-500">ID Usuario</p>
          <p class="text-sm text-surface-800 break-all">
            {{ props.file.id_user || '—' }}
          </p>
        </div>
      </div>

      <div class="space-y-1">
        <p class="text-xs font-medium text-surface-500">Ruta / URL</p>
        <div class="flex flex-col sm:flex-row sm:items-center gap-2">
          <p class="text-xs font-mono text-surface-700 break-all flex-1">
            {{ props.file.path }}
          </p>
          <Button
            v-if="resolvedUrl"
            size="small"
            outlined
            icon="pi pi-external-link"
            label="Abrir"
            @click="openInNewTab"
          />
        </div>
      </div>
    </div>
  </AppModal>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Button } from 'primevue';

import AppModal from '@/core/components/AppModal.vue';

import type { StorageFileResponse } from '../../interfaces/storage/storage-file.interface';

const props = defineProps<{
  show: boolean;
  file: StorageFileResponse | null;
  providerLabel: string;
  resolveUrl: (path: string) => string;
  formatSize: (bytes: number) => string;
  formatDate: (value: string | null | undefined) => string;
}>();

const emit = defineEmits<{
  (e: 'close-modal'): void;
}>();

const isImage = computed(() =>
  Boolean(props.file?.mime_type?.startsWith('image/')),
);

const resolvedUrl = computed(() =>
  props.file?.path ? props.resolveUrl(props.file.path) : '',
);

const openInNewTab = () => {
  if (resolvedUrl.value) {
    window.open(resolvedUrl.value, '_blank', 'noopener,noreferrer');
  }
};
</script>

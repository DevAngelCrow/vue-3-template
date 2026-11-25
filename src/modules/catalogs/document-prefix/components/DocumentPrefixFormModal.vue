<template>
  <AppModal
    :title="props.modalState.title"
    :show="props.modalState.show"
    :title-btn-cancel="modalButtons.cancelText"
    :title-btn-confirm="modalButtons.confirmText"
    footer-buttons
    show-icon-close
    width="50rem"
    @close-modal="closeModal"
    @confirm-modal="onSubmit"
    :show-btn-confirm-footer="props.modalState.mode !== 'view'"
  >
    <section
      v-if="props.modalState.mode !== 'delete'"
      id="body_modal"
      class="flex flex-col gap-4 py-2 w-full"
    >
      <div
        class="w-full p-3.5 rounded-lg bg-surface-50 border border-surface-200 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs"
      >
        <div class="flex items-center gap-2.5">
          <i class="pi pi-sparkles text-primary text-xl"></i>
          <div>
            <span
              class="text-xs font-semibold text-surface-500 uppercase tracking-wider block"
            >
              Vista Previa Proyectada
            </span>
            <span class="text-xs text-surface-600">
              Formato que se generará en el próximo registro:
            </span>
          </div>
        </div>
        <Tag
          :value="livePreview"
          severity="success"
          class="font-mono text-sm font-bold px-3 py-1.5 tracking-wider shadow-xs"
        />
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AppInputText
          id="code"
          label="Código Programático (ej. DOCUMENT)*"
          v-model="code"
          :error-messages="errors.code"
          v-bind="codeAttrs"
          :readonly="props.modalState.isReadonly"
          :disabled="props.modalState.mode === 'edit'"
        />

        <AppInputText
          id="prefix"
          label="Acrónimo / Prefijo visible (ej. DOC)*"
          v-model="prefix"
          :error-messages="errors.prefix"
          v-bind="prefixAttrs"
          :readonly="props.modalState.isReadonly"
        />

        <AppInputText
          id="name"
          label="Nombre de la Serie (ej. Serie General de Documentos)*"
          v-model="name"
          :error-messages="errors.name"
          v-bind="nameAttrs"
          :readonly="props.modalState.isReadonly"
        />

        <AppInputText
          id="entity_target"
          label="Tabla / Entidad Destino (ej. ctl_document_prefix)*"
          v-model="entity_target"
          :error-messages="errors.entity_target"
          v-bind="entityTargetAttrs"
          :readonly="props.modalState.isReadonly"
        />

        <AppInputNumber
          id="padding"
          label="Dígitos de relleno (Padding, ej. 4)*"
          v-model="padding"
          :error-messages="errors.padding"
          v-bind="paddingAttrs"
          :min="2"
          :max="10"
          :readonly="props.modalState.isReadonly"
        />

        <AppInputText
          id="separator"
          label="Separador (ej. -, /, _)*"
          v-model="separator"
          :error-messages="errors.separator"
          v-bind="separatorAttrs"
          :readonly="props.modalState.isReadonly"
        />

        <AppInputNumber
          id="current_value"
          label="Correlativo Actual (último número emitido)*"
          v-model="current_value"
          :error-messages="errors.current_value"
          v-bind="currentValueAttrs"
          :min="0"
          :readonly="props.modalState.isReadonly"
        />

        <div class="flex items-center px-1 pt-2">
          <AppCheckBox
            id="reset_yearly"
            label="Reiniciar correlativo anualmente (incluye año)"
            v-model="reset_yearly"
            :disabled="props.modalState.isReadonly"
          />
        </div>

        <div class="col-span-1 md:col-span-2">
          <AppInputText
            id="description"
            label="Descripción o propósito del documento"
            v-model="description"
            :error-messages="errors.description"
            v-bind="descriptionAttrs"
            :readonly="props.modalState.isReadonly"
          />
        </div>
      </div>
    </section>

    <section
      v-else
      id="body_delete_modal"
      class="w-full flex flex-col items-center justify-center gap-4 py-4"
    >
      <i
        :class="[
          'text-5xl',
          props.modalState.selectedItem?.active
            ? 'pi pi-exclamation-triangle text-amber-500'
            : 'pi pi-info-circle text-emerald-500',
        ]"
      ></i>
      <span class="text-center font-medium text-base text-surface-700">
        {{ props.modalState.description }}
      </span>
      <p class="text-xs text-surface-500 text-center max-w-md">
        {{
          props.modalState.selectedItem?.active
            ? 'Al desactivar este prefijo, el sistema no permitirá generar nuevos números de correlativo hasta que se vuelva a activar.'
            : 'Al activar este prefijo, quedará disponible inmediatamente para la generación de secuencias numéricas.'
        }}
      </p>
    </section>
  </AppModal>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue';
import { Tag } from 'primevue';

import AppModal from '@/core/components/AppModal.vue';
import AppInputText from '@/core/components/AppInputText.vue';
import AppInputNumber from '@/core/components/AppInputNumber.vue';
import AppCheckBox from '@/core/components/AppCheckBox.vue';
import { useLoaderStore } from '@/core/store';

import {
  type DocumentPrefixModalState,
  useDocumentPrefix,
} from '../../composables/useDocumentPrefix';

type DocumentPrefixType = ReturnType<typeof useDocumentPrefix>;

const props = defineProps<{
  modalState: DocumentPrefixModalState;
}>();

const emit = defineEmits<{
  (e: 'close-modal'): void;
}>();

const documentPrefixInstance = inject<DocumentPrefixType>('useDocumentPrefix')!;
const { startLoading, finishLoading } = useLoaderStore();

const {
  errors,
  code,
  codeAttrs,
  prefix,
  prefixAttrs,
  name,
  nameAttrs,
  description,
  descriptionAttrs,
  entity_target,
  entityTargetAttrs,
  padding,
  paddingAttrs,
  reset_yearly,
  separator,
  separatorAttrs,
  current_value,
  currentValueAttrs,
  livePreview,
  handleSubmit,
  addDocumentPrefix,
  editDocumentPrefix,
  toggleDocumentPrefix,
} = documentPrefixInstance;

const onSubmit = handleSubmit(async values => {
  try {
    startLoading();
    let success = false;
    switch (props.modalState.mode) {
      case 'add':
        success = !!(await addDocumentPrefix(values));
        break;
      case 'edit':
        values.id = props.modalState.selectedItem?.id;
        values.active = props.modalState.selectedItem?.active;
        success = !!(await editDocumentPrefix(values));
        break;
      case 'delete':
        if (props.modalState.selectedItem?.id) {
          success = !!(await toggleDocumentPrefix(
            props.modalState.selectedItem.id,
          ));
        }
        break;
    }
    if (success) {
      emit('close-modal');
    }
  } catch (error) {
    console.error(error);
  } finally {
    finishLoading();
  }
});

const closeModal = () => {
  emit('close-modal');
};

const modalButtons = computed(() => {
  switch (props.modalState.mode) {
    case 'edit':
      return { confirmText: 'Guardar Cambios', cancelText: 'Cancelar' };
    case 'delete':
      return { confirmText: 'Confirmar', cancelText: 'Cancelar' };
    case 'view':
      return { confirmText: '', cancelText: 'Cerrar' };
    default:
      return { confirmText: 'Crear Serie', cancelText: 'Cancelar' };
  }
});
</script>

<template>
  <div :class="rootClass">
    <label
      v-if="label"
      :for="computedInputId"
      :class="[
        'block text-sm font-medium mb-1.5',
        { 'text-danger-600': isInvalid },
      ]"
    >
      {{ label }}
    </label>

    <FileUpload
      :id="computedInputId"
      :name="name"
      :multiple="multiple"
      :accept="accept"
      :disabled="disabled || readonly"
      :pt="{
        root: {
          class: [
            errorMessagesClass,
            { 'opacity-60 pointer-events-none': disabled },
          ],
        },
      }"
      :ptOptions="{ mergeProps: true }"
      v-bind="$attrs"
      @select="onSelectedFiles"
    >
      <template #header="{ chooseCallback, clearCallback }">
        <div class="flex flex-wrap justify-between items-center flex-1 gap-4">
          <div class="flex gap-2">
            <Button
              v-if="!readonly"
              :icon="chooseButtonIcon"
              rounded
              variant="outlined"
              severity="secondary"
              :disabled="disabled || readonly"
              aria-label="Seleccionar archivo"
              @click="chooseCallback()"
            />

            <Button
              v-if="!readonly"
              icon="pi pi-times"
              rounded
              variant="outlined"
              severity="danger"
              :disabled="disabled || readonly || !files || files.length === 0"
              aria-label="Limpiar archivos"
              @click="onClearFiles(clearCallback)"
            />
          </div>

          <ProgressBar
            :value="totalSizePercent"
            :showValue="false"
            class="md:w-80 h-1 w-full md:ml-auto"
          >
            <span class="whitespace-nowrap">
              {{ formatSize(totalSize) }} / {{ formatSize(maxSize) }}
            </span>
          </ProgressBar>
        </div>
      </template>

      <template
        #content="{
          uploadedFiles,
          removeUploadedFileCallback,
          removeFileCallback,
        }"
      >
        <div class="flex flex-col justify-center items-center gap-6 pt-4">
          <!-- Archivos seleccionados / cargados localmente -->
          <div v-if="files.length > 0" class="w-full">
            <h5
              class="text-xs font-semibold text-surface-500 uppercase tracking-wider mb-3"
            >
              {{ files.length === 1 ? 'Archivo cargado' : 'Archivos cargados' }}
            </h5>

            <div class="flex flex-wrap gap-4">
              <div
                v-for="(file, index) of files"
                :key="file.name + file.type + file.size"
                class="p-4 rounded-xl flex flex-col border border-surface-200 bg-surface-50/50 items-center gap-3 text-center transition-all"
              >
                <div
                  class="h-20 w-24 flex items-center justify-center overflow-hidden rounded-lg bg-surface-100"
                >
                  <img
                    v-if="isImageFile(file)"
                    role="presentation"
                    :alt="file.name"
                    :src="file.objectURL"
                    class="h-full w-full object-cover"
                  />
                  <i
                    v-else
                    :class="[getFileIcon(file), 'text-3xl text-primary-500']"
                  />
                </div>

                <span
                  class="font-semibold text-xs text-ellipsis max-w-48 whitespace-nowrap overflow-hidden text-surface-800"
                  :title="file.name"
                >
                  {{ file.name }}
                </span>

                <div class="text-[11px] text-surface-500">
                  {{ formatSize(file.size) }}
                </div>

                <Badge value="Cargado" severity="success" class="text-[10px]" />

                <Button
                  v-if="!readonly"
                  icon="pi pi-times"
                  size="small"
                  variant="outlined"
                  rounded
                  severity="danger"
                  :disabled="disabled || readonly"
                  aria-label="Eliminar archivo"
                  @click="
                    onRemoveTemplatingFile(file, removeFileCallback, index)
                  "
                />
              </div>
            </div>
          </div>

          <!-- Archivos completados (subidos al servidor) -->
          <div v-if="uploadedFiles && uploadedFiles.length > 0" class="w-full">
            <h5
              class="text-xs font-semibold text-surface-500 uppercase tracking-wider mb-3"
            >
              Completado
            </h5>

            <div class="flex flex-wrap gap-4">
              <div
                v-for="(file, index) of uploadedFiles"
                :key="file.name + file.type + file.size"
                class="p-4 rounded-xl flex flex-col border border-surface-200 bg-surface-50/50 items-center gap-3 text-center transition-all"
              >
                <div
                  class="h-20 w-24 flex items-center justify-center overflow-hidden rounded-lg bg-surface-100"
                >
                  <img
                    v-if="isImageFile(file as PrimeVueFile)"
                    role="presentation"
                    :alt="file.name"
                    :src="(file as PrimeVueFile).objectURL"
                    class="h-full w-full object-cover"
                  />
                  <i
                    v-else
                    :class="[
                      getFileIcon(file as PrimeVueFile),
                      'text-3xl text-primary-500',
                    ]"
                  />
                </div>

                <span
                  class="font-semibold text-xs text-ellipsis max-w-48 whitespace-nowrap overflow-hidden text-surface-800"
                  :title="file.name"
                >
                  {{ file.name }}
                </span>

                <div class="text-[11px] text-surface-500">
                  {{ formatSize(file.size) }}
                </div>

                <Badge
                  value="Completado"
                  severity="success"
                  class="text-[10px]"
                />

                <Button
                  v-if="!readonly"
                  icon="pi pi-times"
                  size="small"
                  variant="outlined"
                  rounded
                  severity="danger"
                  :disabled="disabled || readonly"
                  aria-label="Eliminar archivo"
                  @click="removeUploadedFileCallback(index)"
                />
              </div>
            </div>
          </div>
        </div>
      </template>

      <template #empty>
        <div class="flex items-center justify-center flex-col py-6">
          <i
            class="pi pi-cloud-upload border-2 border-dashed border-surface-300 rounded-full p-6 text-3xl text-surface-400 mb-4"
          />

          <p class="mb-0 text-center text-surface-700 font-medium">
            {{ computedEmptyText }}
          </p>

          <div class="mt-2 text-xs text-surface-500 text-center space-y-1">
            <p v-if="showFormats" class="mb-0">
              <strong class="font-semibold text-surface-700">Formatos:</strong>
              {{ acceptedFormatsMessage }}
            </p>
            <p v-if="showMaxSize" class="mb-0">
              <strong class="font-semibold text-surface-700"
                >Tamaño máximo:</strong
              >
              {{ formatSize(maxSize) }}
            </p>
            <p v-if="maxDimensions" class="mb-0">
              <strong class="font-semibold text-surface-700"
                >Dimensiones máximas:</strong
              >
              {{ maxDimensions }}
            </p>
          </div>
        </div>
      </template>
    </FileUpload>

    <Message
      v-if="errorMessageText.length > 0"
      :id="errorId"
      class="mt-1 text-xs z-10 w-full"
      :severity="severity"
      :size="size"
      :variant="variant"
      role="alert"
      aria-live="assertive"
    >
      {{ errorMessageText }}
    </Message>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, useId } from 'vue';
import { usePrimeVue } from 'primevue';
import type { FileUploadSelectEvent } from 'primevue/fileupload';
import Button from 'primevue/button';
import FileUpload from 'primevue/fileupload';
import ProgressBar from 'primevue/progressbar';
import Badge from 'primevue/badge';
import Message from 'primevue/message';

import type { PrimeVueFile } from '@/types/PrimeVueFile';

import type {
  AppDragDropFileProps,
  AppDragDropFileEmits,
} from '../interfaces/drag-drop-file.interface';
import { resolveInputRootClass } from '../utils/inputClasses';

defineOptions({
  name: 'AppDragDropFile',
  inheritAttrs: false,
});

const props = withDefaults(defineProps<AppDragDropFileProps>(), {
  multiple: false,
  accept: 'image/*',
  modelValue: () => [],
  class: '',
  errorMessages: '',
  severity: 'error',
  size: 'small',
  variant: 'simple',
  maxSize: 1048576, // 1MB en bytes
  maxDimensions: '',
  showFormats: true,
  showMaxSize: true,
  emptyText: '',
  placeholder: '',
  label: '',
  name: 'dragdrop',
  id: undefined,
  inputId: undefined,
  disabled: false,
  readonly: false,
  invalid: false,
});

const emit = defineEmits<AppDragDropFileEmits>();

const $primevue = usePrimeVue();
const autoId = useId();
const computedInputId = computed(() => props.id || props.inputId || autoId);
const rootClass = computed(() => resolveInputRootClass(props.class));

const totalSize = ref<number>(0);
const totalSizePercent = ref<number>(0);
const errors = ref<string>('');

const files = computed<PrimeVueFile[]>({
  get: () => props.modelValue || [],
  set: val => emit('update:modelValue', val),
});

const computedEmptyText = computed<string>(() => {
  if (props.emptyText) return props.emptyText;
  if (props.placeholder) return props.placeholder;
  return props.multiple
    ? 'Arrastre y suelte archivos aquí para cargarlos.'
    : 'Arrastre y suelte un archivo aquí para cargarlo.';
});

const chooseButtonIcon = computed<string>(() => {
  if (props.accept?.includes('image')) return 'pi pi-images';
  if (props.accept?.includes('pdf') || props.accept?.includes('document'))
    return 'pi pi-file';
  return 'pi pi-upload';
});

const acceptedFormatsMessage = computed<string>(() => {
  if (!props.accept || props.accept === '*/*') {
    return 'Todos los formatos';
  }

  const acceptedTypes = props.accept.split(',').map(type => type.trim());
  const formats: string[] = [];

  acceptedTypes.forEach(type => {
    if (type.startsWith('.')) {
      formats.push(type.toUpperCase().replace('.', ''));
    } else if (type.endsWith('/*')) {
      const baseType = type.split('/')[0];
      const typeNames: Record<string, string> = {
        image: 'Imágenes (JPG, PNG, GIF, etc.)',
        video: 'Videos (MP4, AVI, etc.)',
        audio: 'Audio (MP3, WAV, etc.)',
        application: 'Documentos',
      };
      formats.push(typeNames[baseType] || baseType.toUpperCase());
    } else {
      const extension = type.split('/')[1]?.toUpperCase();
      if (extension) {
        formats.push(extension);
      }
    }
  });

  return formats.length > 0 ? formats.join(', ') : 'Formatos específicos';
});

const revokeFileUrl = (file?: PrimeVueFile) => {
  if (
    file?.objectURL &&
    typeof URL !== 'undefined' &&
    typeof URL.revokeObjectURL === 'function'
  ) {
    try {
      URL.revokeObjectURL(file.objectURL);
    } catch {
      // Ignorar si el navegador ya liberó la URL
    }
  }
};

const isImageFile = (file?: { type?: string; name?: string }): boolean => {
  if (!file) return false;
  if (file.type && file.type.startsWith('image/')) return true;
  if (file.name) {
    return /\.(jpe?g|png|gif|webp|svg|bmp|ico)$/i.test(file.name);
  }
  return false;
};

const getFileIcon = (file?: { type?: string; name?: string }): string => {
  if (!file) return 'pi pi-file';
  const name = file.name?.toLowerCase() || '';
  const type = file.type?.toLowerCase() || '';

  if (type.includes('pdf') || name.endsWith('.pdf')) return 'pi pi-file-pdf';
  if (
    type.includes('word') ||
    type.includes('document') ||
    name.endsWith('.doc') ||
    name.endsWith('.docx')
  ) {
    return 'pi pi-file-word';
  }
  if (
    type.includes('excel') ||
    type.includes('spreadsheet') ||
    name.endsWith('.xls') ||
    name.endsWith('.xlsx') ||
    name.endsWith('.csv')
  ) {
    return 'pi pi-file-excel';
  }
  if (
    name.endsWith('.zip') ||
    name.endsWith('.rar') ||
    name.endsWith('.7z') ||
    type.includes('zip')
  ) {
    return 'pi pi-folder';
  }
  return 'pi pi-file';
};

const onClearFiles = (clearCallback: () => void) => {
  if (props.disabled || props.readonly) return;
  files.value.forEach(revokeFileUrl);
  clearCallback();
  files.value = [];
  totalSize.value = 0;
  totalSizePercent.value = 0;
  errors.value = '';
  emit('clear');
};

const onRemoveTemplatingFile = (
  file: PrimeVueFile,
  removeFileCallback: (_index: number) => void,
  index: number,
) => {
  if (props.disabled || props.readonly) return;
  const fileIndexToRemove = files.value.findIndex(f => f === file);
  if (fileIndexToRemove === -1) return;

  revokeFileUrl(file);
  totalSize.value = Math.max(0, totalSize.value - (file.size || 0));
  removeFileCallback(fileIndexToRemove);

  const newFiles = [...files.value];
  newFiles.splice(fileIndexToRemove, 1);
  files.value = newFiles;

  totalSizePercent.value =
    props.maxSize > 0 && totalSize.value > 0
      ? Math.min(100, (totalSize.value / props.maxSize) * 100)
      : 0;

  emit('remove', file, index);
};

const validateFileType = (
  file: File | undefined | null,
  accept: string,
): boolean => {
  if (!file) return false;
  if (!accept || accept === '*/*') return true;

  const acceptedTypes = accept
    .split(',')
    .map(type => type.trim().toLowerCase());

  return acceptedTypes.some(acceptedType => {
    if (acceptedType.startsWith('.')) {
      return file.name?.toLowerCase().endsWith(acceptedType) || false;
    } else if (acceptedType.endsWith('/*')) {
      const baseType = acceptedType.split('/')[0];
      return file.type?.toLowerCase().startsWith(baseType + '/') || false;
    } else {
      return file.type?.toLowerCase() === acceptedType;
    }
  });
};

const onSelectedFiles = (event: FileUploadSelectEvent) => {
  if (props.disabled || props.readonly) return;

  const selectedFiles = (
    props.multiple ? event.files : [event.files[0]]
  ) as PrimeVueFile[];

  const validFiles = selectedFiles.filter((file): file is PrimeVueFile =>
    Boolean(file && file.name),
  );

  if (validFiles.length === 0) {
    errors.value = 'No se pudieron cargar los archivos seleccionados.';
    emit('error', errors.value);
    return;
  }

  // Validar tipos de archivo
  const invalidFiles = validFiles.filter(
    file => !validateFileType(file, props.accept),
  );

  if (invalidFiles.length > 0) {
    const fileNames = invalidFiles
      .map(f => f.name || 'archivo desconocido')
      .join(', ');
    const fileTypes = invalidFiles.map(f => f.type || 'desconocido').join(', ');
    errors.value = `Tipo de archivo no permitido (${fileTypes}) en: ${fileNames}. Solo se aceptan: ${props.accept}`;
    emit('error', errors.value);
    return;
  }

  // Validar tamaño de archivo
  const oversizedFiles = validFiles.filter(file => file.size > props.maxSize);

  if (oversizedFiles.length > 0) {
    const fileNames = oversizedFiles
      .map(f => f.name || 'archivo desconocido')
      .join(', ');
    const fileSizes = oversizedFiles.map(f => formatSize(f.size)).join(', ');
    errors.value = `Archivo(s) demasiado grande(s): ${fileNames} (${fileSizes}). Máximo permitido: ${formatSize(props.maxSize)}`;
    emit('error', errors.value);
    return;
  }

  errors.value = '';

  if (props.multiple) {
    files.value = [...files.value, ...validFiles];
  } else {
    // Si no es múltiple, revocar el archivo anterior si existía
    if (files.value.length > 0) {
      files.value.forEach(revokeFileUrl);
    }
    files.value = validFiles;
  }

  totalSize.value = files.value.reduce(
    (acc, file) => acc + (file.size || 0),
    0,
  );
  totalSizePercent.value =
    props.maxSize > 0
      ? Math.min(100, (totalSize.value / props.maxSize) * 100)
      : 0;

  emit('select', validFiles);
};

const formatSize = (bytes: number): string => {
  const k = 1024;
  const dm = 3;
  const defaultSizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const sizes = $primevue.config.locale?.fileSizeTypes || defaultSizes;

  if (bytes === 0) return `0 ${sizes[0]}`;

  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};

const errorMessageText = computed<string>(() => {
  if (Array.isArray(props.errorMessages)) {
    return props.errorMessages.filter(Boolean).join(', ');
  }
  if (props.errorMessages && props.errorMessages.length > 0) {
    return props.errorMessages;
  }
  return errors.value;
});

const isInvalid = computed<boolean>(() => {
  return Boolean(props.invalid || errorMessageText.value.length > 0);
});

const errorId = computed<string>(() => `${computedInputId.value}-error`);

const errorMessagesClass = computed<string>(() => {
  return isInvalid.value ? '!border-danger-600' : '';
});
</script>

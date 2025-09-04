<template>
  <FileUpload
    name="dragdrop"
    :multiple="multiple"
    :accept="accept"
    :maxFileSize="1000000"
    @select="onSelectedFiles"
  >
    <template #header="{ chooseCallback, clearCallback, files }">
      <div class="flex flex-wrap justify-between items-center flex-1 gap-4">
        <div class="flex gap-2">
          <Button
            @click="chooseCallback()"
            icon="pi pi-images"
            rounded
            variant="outlined"
            severity="secondary"
          ></Button>
          <Button
            @click="clearCallback()"
            icon="pi pi-times"
            rounded
            variant="outlined"
            severity="danger"
            :disabled="!files || files.length === 0"
          ></Button>
        </div>
        <ProgressBar
          :value="totalSizePercent"
          :showValue="false"
          class="md:w-20rem h-1 w-full md:ml-auto"
        >
          <span class="whitespace-nowrap">{{ totalSize }}B / 1Mb</span>
        </ProgressBar>
      </div>
    </template>
    <template
      #content="{
        files,
        uploadedFiles,
        removeUploadedFileCallback,
        removeFileCallback,
      }"
    >
      <div class="flex flex-col gap-8 pt-4">
        <div v-if="files.length > 0">
          <h5>Pendiente</h5>
          <div class="flex flex-wrap gap-4">
            <template v-if="multiple">
              <div
                v-for="(file, index) of files"
                :key="file.name + file.type + file.size"
                class="p-8 rounded-border flex flex-col border border-surface items-center gap-4"
              >
                <div>
                  <img
                    role="presentation"
                    :alt="file.name"
                    :src="file.objectURL"
                    width="100"
                    height="50"
                  />
                </div>
                <span
                  class="font-semibold text-ellipsis max-w-60 whitespace-nowrap overflow-hidden"
                  >{{ file.name }}</span
                >
                <div>{{ formatSize(file.size) }}</div>
                <Badge value="Pending" severity="warn" />
                <Button
                  icon="pi pi-times"
                  @click="
                    onRemoveTemplatingFile(file, removeFileCallback, index)
                  "
                  variant="outlined"
                  rounded
                  severity="danger"
                />
              </div>
            </template>
            <template v-else>
              <div
                class="p-8 rounded-border flex flex-col border border-surface items-center gap-4"
              >
                <img
                  role="presentation"
                  :alt="files[0].name"
                  :src="files[0].objectURL"
                  width="100"
                  height="50"
                />
                <span class="font-semibold">{{ files[0].name }}</span>
                <div>{{ formatSize(files[0].size) }}</div>
                <Badge value="Pending" severity="warn" />
                <Button
                  icon="pi pi-times"
                  @click="
                    onRemoveTemplatingFile(files[0], removeFileCallback, 0)
                  "
                  variant="outlined"
                  rounded
                  severity="danger"
                />
              </div>
            </template>
          </div>
        </div>

        <div v-if="uploadedFiles.length > 0">
          <h5>Completado</h5>
          <div class="flex flex-wrap gap-4">
            <div
              v-for="(file, index) of uploadedFiles"
              :key="file.name + file.type + file.size"
              class="p-8 rounded-border flex flex-col border border-surface items-center gap-4"
            >
              <div>
                <img
                  role="presentation"
                  :alt="file.name"
                  :src="file.objectURL"
                  width="100"
                  height="50"
                />
              </div>
              <span
                class="font-semibold text-ellipsis max-w-60 whitespace-nowrap overflow-hidden"
                >{{ file.name }}</span
              >
              <div>{{ formatSize(file.size) }}</div>
              <Badge value="Completed" class="mt-4" severity="success" />
              <Button
                icon="pi pi-times"
                @click="removeUploadedFileCallback(index)"
                variant="outlined"
                rounded
                severity="danger"
              />
            </div>
          </div>
        </div>
      </div>
    </template>
    <template #empty>
      <div class="flex items-center justify-center flex-col">
        <i
          class="pi pi-cloud-upload !border-2 !rounded-full !p-8 !text-4xl !text-muted-color"
        />
        <p class="mt-6 mb-0">
          {{
            multiple
              ? 'Arrastre y suelte archivos aquí para cargarlos.'
              : 'Arrastre y suelte la foto de perfil aquí para cargarla'
          }}
        </p>
      </div>
    </template>
  </FileUpload>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import { usePrimeVue } from 'primevue';
import type { FileUploadSelectEvent } from 'primevue/fileupload';
//import { useToast } from 'primevue/usetoast';
import FileUpload from 'primevue/fileupload';
import ProgressBar from 'primevue/progressbar';
import Button from 'primevue/button';
import Badge from 'primevue/badge';
const props = defineProps({
  multiple: {
    type: Boolean,
    default: false,
  },
  accept: {
    type: String,
    default: 'image/*',
  },
});

const $primevue = usePrimeVue();
//const toast = useToast();

const totalSize = ref<number>(0);
const totalSizePercent = ref<number>(0);
const files = ref<File[]>([]);

const onSelectedFiles = (event: FileUploadSelectEvent) => {
  files.value = props.multiple ? event.files : [event.files[0]];
  totalSize.value = files.value.reduce((acc, file) => acc + file.size, 0);
  uploadEvent(() => {});
};

const uploadEvent = (callback: () => void) => {
  totalSizePercent.value = 100;
  callback();
};

const onRemoveTemplatingFile = (
  file: File,
  removeFileCallback: () => void,
  index: number,
) => {
  console.log(file, 'file');
  removeFileCallback();
  totalSize.value -= files.value[index].size;
  totalSizePercent.value = totalSize.value / 10000;
};

const formatSize = (bytes: number): string => {
  const k = 1024;
  const dm = 3;
  const sizes = $primevue.config.locale?.fileSizeTypes;
  if (bytes === 0) return `0 ${sizes[0]}`;
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};
</script>
<style scoped></style>

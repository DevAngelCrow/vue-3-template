<template>
  <!-- <ModalComponent
    :show="show"
    :width="'99%'"
    :title="documentName"
    :footer-buttons="false"
    v-bind="$attrs"
    styles-show-document
  ></ModalComponent> -->
  <AppModal
    class="bg-[#282828] border-none h-full"
    :show="show"
    :width="'99%'"
    :title="documentName"
    :footer-buttons="false"
    :styles-show-document="stylesShowDocument"
  >
    <template #header>
      <div class="text-white flex justify-center w-full">
        <div class="absolute flex justify-center text-center w-full">
          <span class="">{{ documentName }}</span>
        </div>
        <div class="flex justify-end text-end w-full">
          <Button class="bg-transparent border-none" @click="closeModal">
            <i class="pi pi-times"></i>
          </Button>
        </div>  
      </div>
    </template>
    <template #default>
      <embed class="h-[77vh] w-full pa-none flex justify-center"
        :src="fileBlob ? fileBlob : null"
        
      />
    </template>
  </AppModal>
</template>
<script setup>
import AppModal from "./AppModal.vue";
import { Button } from "primevue";
import { ref, watchEffect } from "vue";

const props = defineProps({
  documentName: {
    type: String,
    default: "",
  },
  file: {
    type: String,
    default: "",
  },
  show: {
    type: Boolean,
    default: false,
  },
  validType: {
    type: String,
    default: "application/pdf",
  },
  stylesShowDocument: {
    type: Boolean,
    default: true,
  },
});

const fileBlob = ref(null);
const emit = defineEmits(['close-visor'])
// defineOptions({ inheritAttrs: false })

const fileTypes = [
  "application/pdf",
  "text/plain",
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/svg+xml",
  "image/bmp",
];

const conversion = (dataURI) => {
  let byteString = atob(dataURI.split(",")[1]);
  let mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];
  let ab = new ArrayBuffer(byteString.length);
  let ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  let blob = new Blob([ab], { type: mimeString });
  return blob;
};

const typesValidation = (types) => {
  const typesArray = types.replace(/\s/g, "").split(",");
  const valid = typesArray.filter((item) => fileTypes.includes(item));
  const invalid = typesArray.filter((item) => !fileTypes.includes(item));
  const message = {
    valid_types: valid.join(","),
    invalid_types: invalid.join(","),
  };
  if (invalid.length) {
    message.flag = false;
    return message;
  }
  message.flag = true;
  return message;
};

const closeModal = () => {
  emit("close-visor", false)
}

watchEffect(() => {
  const validation = typesValidation(props.validType);
  if (props.file && validation.flag) {
    const url = conversion(props.file);
    const secondValidation = typesValidation(url.type);
    if (secondValidation.flag) {
      fileBlob.value = URL.createObjectURL(url);
    }
    if (secondValidation.invalid_types.length) {
      throw `Archivos no validos: ${secondValidation.invalid_types}`;
    }
  }
});
</script>

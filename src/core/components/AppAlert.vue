<template>
  <Toast position="top-right" />
</template>
<script setup>
import Toast from "primevue/toast";
import { useToast } from "primevue/usetoast";
import { useAlertStore } from "../store/index";
import { watch } from "vue";

const toast = useToast();
const alert = useAlertStore();

const showTopRight = () => {
  console.log("showTopRight");
  toast.add({
    severity: alert.type,
    summary: alert?.title,
    detail: alert?.content,
    life: alert.timeout,
  });
};

watch(
  () => alert.show,
  (newValue) => {
    if (newValue) {
      showTopRight();
    } else {
      alert.close();
    }
  }
);
</script>

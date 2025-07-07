<template>
  <Toast position="top-right" />
</template>
<script setup>
import Toast from "primevue/toast";
import { useToast } from "primevue/usetoast";
import { useMessageStore } from "../store/index";
import { watch } from "vue";

const toast = useToast();
const alert = useMessageStore();

const showTopRight = () => {
  toast.add({
    severity: alert.type,
    summary: alert?.title,
    detail: alert?.content,
    group: "tr",
    life: alert.timeout,
  });
};

watch(
  () => alert.show,
  (newValue) => {
    if (newValue) {
      showTopRight();
      alert.close();
    }
  }
);
</script>

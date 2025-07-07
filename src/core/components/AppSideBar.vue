<template>
  <Drawer
    v-model:visible="sideBarVisible.sideBar"
    dismissable
    block-scroll
    :pt="{
      header: {
        class: 'flex justify-end items-end',
      },
    }"
  />
</template>
<script setup>
import { Drawer } from "primevue";
import { ref, defineProps } from "vue";
import { useLayoutStore } from "../store/useLayoutStore";

const sideBarVisible = useLayoutStore();
</script>

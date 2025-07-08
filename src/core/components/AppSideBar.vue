<template>
  <Drawer
    class="bg-primary-100 border-2 border-neutral-800"
    v-model:visible="sideBarVisible.sideBar"
    dismissable
    block-scroll
    :pt="{
      header: {
        class: 'flex justify-end items-end',
      },
      merge: true,
    }"
  />
</template>
<script setup>
import { Drawer } from "primevue";
import { ref, defineProps } from "vue";
import { useLayoutStore } from "../store/useLayoutStore";
import { merge } from "@primeuix/themes";

const sideBarVisible = useLayoutStore();
</script>

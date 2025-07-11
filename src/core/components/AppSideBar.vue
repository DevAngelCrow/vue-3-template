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
<script setup lang="ts">
import { Drawer } from 'primevue';

import { useLayoutStore } from '../store/useLayoutStore';

const sideBarVisible = useLayoutStore();
</script>

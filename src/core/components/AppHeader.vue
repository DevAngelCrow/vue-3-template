<template>
  <section class="w-full h-full bg-primary-800">
    <div
      class="w-full h-full bg-transparent flex justify-start items-center align-baseline"
    >
      <Button
        class="bg-transparent border-none flex md:hidden"
        @click="sideBar.showSideBar(!sideBar.sideBar)"
      >
        <i class="pi pi-bars"></i>
      </Button>
      <AppNavBarMenu
        class="flex justify-end align-baseline content-center"
        :menu="items"
      />
    </div>
  </section>
</template>
<script setup lang="ts">
import { Button } from 'primevue';
import { useLayoutStore } from '../store/useLayoutStore';
import AppNavBarMenu from './AppNavBarMenu.vue';
import { ref } from 'vue';
import type { Menu } from '../interfaces/menu.navbar.interface';

const sideBar = useLayoutStore();

const items = ref<Menu[]>([
  {
    label: 'Projects',
    isUser: true,
    items: [
      {
        label: 'User',
        icon: 'pi pi-user',
      },
      {
        label: 'Email',
        icon: 'pi pi-envelope',
      },
      {
        label: 'Log out',
        icon: 'pi pi-sign-out',
      },
    ],
  },
  {
    label: 'Home',
    icon: 'pi pi-home',
  },
  {
    label: 'Features',
    icon: 'pi pi-star',
  },
  {
    label: 'Projects',
    icon: 'pi pi-search',
    items: [
      {
        label: 'Components',
        icon: 'pi pi-bolt',
      },
      {
        label: 'Blocks',
        icon: 'pi pi-server',
      },
      {
        label: 'UI Kit',
        icon: 'pi pi-pencil',
      },
      {
        label: 'Templates',
        icon: 'pi pi-palette',
        items: [
          {
            label: 'Apollo',
            icon: 'pi pi-palette',
          },
          {
            label: 'Ultima',
            icon: 'pi pi-palette',
          },
        ],
      },
    ],
  },
  {
    label: 'Contact',
    icon: 'pi pi-envelope',
  },
]);
</script>
<style scoped></style>

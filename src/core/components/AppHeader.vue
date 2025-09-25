<template>
  <section class="w-full h-full bg-primary">
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
import { ref } from 'vue';

import { useLayoutStore } from '../store/useLayoutStore';
import AppNavBarMenu from './AppNavBarMenu.vue';
import { useAuthStore } from '../store/useAuthStore';
import { Menu } from '../interfaces/userState.store.interface';
import { MenuNavBar } from '../interfaces/menu.navbar.interface';

defineOptions({ name: 'AppHeader' });

const sideBar = useLayoutStore();
const { menuInfo } = useAuthStore();

const menuState: Menu[] = menuInfo;
const menuMapped = menuState
  .filter(
    item =>
      (item.show && item.children.length > 0) ||
      (item.show && item.children.length === 0 && item.parent === null),
  )
  .map(m => {
    const menuItem: MenuNavBar = {
      label: m.title,
      icon: m.icon,
      url: m.uri,
    };
    if (m.title === 'Usuario') {
      menuItem.isUser = true;
    }
    if (m.children && m.children.length > 0) {
      menuItem.items = m.children.map(c => ({
        label: c.title,
        icon: c.icon,
        url: c.uri,
      }));
    }
    return menuItem;
  });

console.log(menuMapped, 'menumapped');
const items = ref<MenuNavBar[]>(menuMapped);
</script>
<style scoped></style>

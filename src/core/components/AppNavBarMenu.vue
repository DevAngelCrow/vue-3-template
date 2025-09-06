<template>
  <div
    class="w-full xs:mr-2 sm:w-[93%] md:w-full h-full border-none rounded-none"
  >
    <Menubar
      class="rounded-none bg-primary border-none h-full hidden md:flex"
      breakpoint="767px"
      :model="menuMapped"
    >
      <template #item="{ item, props, hasSubmenu, root }">
        <div
          class="flex items-center text-white hover:text-primary-950 group"
          v-bind="props.action"
        >
          <i :class="`${item.icon} group-hover:text-primary-700`"></i>
          <span class="group-hover:text-primary-700">
            {{ item.label }}
          </span>
          <i
            v-if="hasSubmenu"
            :class="[
              'pi pi-angle-down ml-auto',
              { 'pi-angle-down': root, 'pi-angle-right': !root },
              'group-focus:text-primary-700',
              'group-active:text-primary-700',
              'group-hover:text-primary-700',
            ]"
          ></i>
        </div>
      </template>
      <template #end>
        <div
          class="hover:bg-surface-400 hover:scale-110 transform transition-all flex justify-center items-center pa-0 ma-0 rounded-full w-full h-full"
          @click="toggle"
          aria-haspopup="true"
          aria-controls="overlay_menu"
        >
          <Avatar
            class="hover:scale-100 hover:px-1 hover:py-1 transform transition-all"
            image="https://i.pravatar.cc/150"
            shape="circle"
            alt="prueba"
            size="xlarge"
          />
          <MenuPrime
            class="mt-2"
            ref="popUp"
            id="overlay_menu"
            :popup="true"
            :model="menuUser"
          />
        </div>
      </template>
    </Menubar>
    <div
      class="hover:bg-surface-400 hover:scale-90 transform transition-all flex justify-center items-center rounded-full md:hidden aspect-square"
      @click="toggle"
      aria-haspopup="true"
      aria-controls="overlay_menu"
    >
      <Avatar
        class="hover:scale-110 hover:px-1 hover:py-1 transform transition-all"
        image="https://i.pravatar.cc/150"
        shape="circle"
        alt="prueba"
        size="xlarge"
      />
      <MenuPrime
        class="mt-2"
        ref="popUp"
        id="overlay_menu"
        :popup="true"
        :model="menuUser"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import { onMounted, type PropType } from 'vue';
import { ref } from 'vue';
import { Menubar, Avatar, Menu as MenuPrime } from 'primevue';

import type { Menu as MenuModel } from '../interfaces/menu.navbar.interface';

defineOptions({ name: 'AppNavBarMenu' });

const { menu } = defineProps({
  menu: {
    type: Array as PropType<MenuModel[]>,
    default: () => [],
  },
});

const menuMapped = ref<MenuModel[]>();
const menuUser = ref<MenuModel[]>();
const popUp = ref<InstanceType<typeof MenuPrime>>();

const toggle = (event: MouseEvent | KeyboardEvent) => {
  popUp.value?.toggle(event);
};

const mapperMenuUser = () => {
  if (menu.length) {
    menuUser.value = menu.filter(item => item.isUser);
    menuMapped.value = menu.filter(item => !item.isUser);
  }
};

onMounted(() => {
  mapperMenuUser();
});
</script>
<style scoped>
@reference "@/core/assets/style.css";

:deep(.p-menubar-item-active > .p-menubar-item-content > .p-menubar-item-link) {
  @apply text-primary transform transition-all;
}

:deep(
  .p-menubar-item.p-focus > .p-menubar-item-content > .p-menubar-item-link
) {
  @apply text-primary transform transition-all;
}

:deep(.p-menubar-submenu .p-menubar-item-link) {
  @apply text-primary;
}
</style>

<template>
  <ul class="flex flex-col m-0 p-0 list-none w-full gap-1">
    <li
      v-for="section in mappedMenu"
      :key="section.id || section.title || section.name"
      class="flex flex-col w-full"
    >
      <!-- Si tiene hijos: Acordeón desplegable -->
      <div v-if="hasChildren(section.children)" class="w-full flex flex-col">
        <div
          v-ripple
          class="flex items-center justify-between w-full px-3 py-2 rounded-lg cursor-pointer transition-colors hover:bg-primary-200/70 select-none"
          @click="toggleItem(section.id)"
        >
          <div class="flex items-center gap-3 overflow-hidden">
            <i
              v-if="section.icon"
              :class="[section.icon, 'text-primary-800 text-base shrink-0']"
            ></i>
            <span class="font-medium text-neutral-800 truncate text-sm">
              {{ section.title || section.label }}
            </span>
          </div>
          <Button
            type="button"
            icon="pi pi-chevron-down"
            variant="text"
            rounded
            class="bg-transparent border-none text-primary-950 p-1 w-7 h-7 transform transition-transform duration-200 shrink-0"
            :class="isOpen(section.id) ? 'rotate-180' : 'rotate-0'"
            @click.stop="toggleItem(section.id)"
          />
        </div>

        <Transition name="slide-accordion">
          <div v-if="isOpen(section.id)" class="w-full pl-3 mt-1">
            <AppMenuItemSideBar
              :mapped-menu="section.children || []"
              class="border-l-2 border-primary-300 pl-1"
            />
          </div>
        </Transition>
      </div>

      <!-- Si NO tiene hijos: Enlace de navegación -->
      <router-link
        v-else-if="section.uri || section.to"
        :to="section.uri || section.to || '/'"
        class="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-neutral-800 hover:bg-primary-200/70 transition-colors"
        @click="handleNavigation"
      >
        <div v-ripple class="flex items-center gap-3 w-full">
          <i
            v-if="section.icon"
            :class="[section.icon, 'text-primary-800 text-base shrink-0']"
          ></i>
          <span class="font-medium text-sm truncate">
            {{ section.title || section.label }}
          </span>
        </div>
      </router-link>
    </li>
  </ul>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Button } from 'primevue';

import type { NavigationItem } from '../interfaces/navigation.interface';
import { useLayoutStore } from '../store/useLayoutStore';

defineOptions({ name: 'AppMenuItemSideBar' });

defineProps<{
  mappedMenu: NavigationItem[];
}>();

const layoutStore = useLayoutStore();
const openItems = ref<Record<string, boolean>>({});

const isOpen = (id: string) => Boolean(openItems.value[id]);

const toggleItem = (id: string) => {
  openItems.value[id] = !openItems.value[id];
};

const hasChildren = (children?: NavigationItem[]) =>
  Boolean(children && children.length > 0);

const handleNavigation = () => {
  // Cierra el sidebar al navegar para mejorar la experiencia en móviles
  layoutStore.showSideBar(false);
};
</script>

<style scoped>
.slide-accordion-enter-active,
.slide-accordion-leave-active {
  transition:
    max-height 0.3s ease-in-out,
    opacity 0.25s ease-in-out;
  overflow: hidden;
}

.slide-accordion-enter-from,
.slide-accordion-leave-to {
  max-height: 0;
  opacity: 0;
}

.slide-accordion-enter-to,
.slide-accordion-leave-from {
  max-height: 500px;
  opacity: 1;
}
</style>

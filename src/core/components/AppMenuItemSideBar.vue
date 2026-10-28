<template>
  <ul class="flex flex-col m-0 p-0 list-none w-full gap-1.5">
    <li
      v-for="section in items"
      :key="section.id || section.title || section.name"
      class="flex flex-col w-full"
    >
      <!-- Si tiene hijos: Acordeón desplegable en tarjeta moderna -->
      <div v-if="hasChildren(section.children)" class="w-full flex flex-col">
        <div
          v-ripple
          :class="[
            'flex items-center justify-between w-full px-3.5 py-2.5 rounded-xl cursor-pointer transition-all duration-200 select-none group',
            isOpen(section.id)
              ? 'bg-primary-500/10 text-primary-950 shadow-xs'
              : 'hover:bg-primary-50/80 text-surface-700',
          ]"
          @click="toggleItem(section.id)"
        >
          <div class="flex items-center gap-3 overflow-hidden">
            <div
              :class="[
                'w-8 h-8 rounded-lg flex items-center justify-center transition-colors shrink-0',
                isOpen(section.id)
                  ? 'bg-primary-600 text-white shadow-xs'
                  : 'bg-primary-100 text-primary-700 group-hover:bg-primary-200/80',
              ]"
            >
              <i v-if="section.icon" :class="[section.icon, 'text-sm']"></i>
            </div>
            <span class="font-semibold text-sm truncate">
              {{ section.title || section.label }}
            </span>
          </div>

          <Button
            type="button"
            icon="pi pi-chevron-down"
            variant="text"
            rounded
            class="bg-transparent border-none text-surface-400 group-hover:text-surface-700 p-1 w-7 h-7 transform transition-transform duration-200 shrink-0"
            :class="
              isOpen(section.id) ? 'rotate-180 text-primary-700' : 'rotate-0'
            "
            @click.stop="toggleItem(section.id)"
          />
        </div>

        <Transition name="slide-accordion">
          <div
            v-if="isOpen(section.id)"
            class="w-full pl-5 pr-1 mt-1 border-l-2 border-primary-400/50 ml-4 space-y-1"
          >
            <AppMenuItemSideBar :items="section.children || []" />
          </div>
        </Transition>
      </div>

      <!-- Si NO tiene hijos: Enlace de navegación directo con estilo píldora -->
      <router-link
        v-else-if="section.uri || section.to"
        v-slot="{ isActive }"
        :to="section.uri || section.to || '/'"
        class="no-underline"
        @click="handleNavigation"
      >
        <div
          v-ripple
          :class="[
            'flex items-center gap-3 w-full px-3.5 py-2.5 rounded-xl transition-all duration-200 group select-none cursor-pointer',
            isActive
              ? 'bg-primary-600 text-white font-semibold shadow-xs'
              : 'hover:bg-primary-50/80 text-surface-700 hover:text-primary-950 font-medium',
          ]"
        >
          <div
            :class="[
              'w-7 h-7 rounded-lg flex items-center justify-center transition-colors shrink-0',
              isActive
                ? 'bg-white/20 text-white'
                : 'bg-surface-100 text-surface-500 group-hover:bg-primary-100 group-hover:text-primary-700',
            ]"
          >
            <i v-if="section.icon" :class="[section.icon, 'text-xs']"></i>
          </div>
          <span class="text-sm truncate">
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
  items: NavigationItem[];
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
  layoutStore.showSideBar(false);
};
</script>

<style scoped>
.slide-accordion-enter-active,
.slide-accordion-leave-active {
  transition:
    max-height 0.3s cubic-bezier(0.4, 0, 0.2, 1),
    opacity 0.2s ease-in-out;
  overflow: hidden;
}

.slide-accordion-enter-from,
.slide-accordion-leave-to {
  max-height: 0;
  opacity: 0;
}

.slide-accordion-enter-to,
.slide-accordion-leave-from {
  max-height: 600px;
  opacity: 1;
}
</style>

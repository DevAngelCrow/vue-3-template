<template>
  <div class="flex flex-col h-full">
    <li
      v-for="(section, index) in mappedMenu"
      :key="section.id || section.title"
      :class="[
        'flex items-start justify-center px-2 pt-3 shrink-0 flex-wrap flex-col gap-1',
      ]"
    >
      <div
        :class="[
          'flex flex-row justify-start items-center flex-wrap w-full overflow-hidden',
          isChildren(section.children)
            ? ' hover:bg-sky-200 hover:rounded-md hover:outline'
            : 'hover:border-dashed hover:border hover:rounded-md hover:cursor-pointer',
        ]"
        :id="section.title"
      >
        <div v-ripple class="flex w-full items-center">
          <i :class="`${section.icon} w-[10%] pl-2`"></i>
          <span
            :class="[
              'w-[80%]',
              isChildren(section?.children) ? 'w-[80%]' : 'w-[90%]',
            ]"
            >{{ section.title }}</span
          >
          <Button
            v-if="isChildren(section.children)"
            icon="pi pi-chevron-down"
            variant="text"
            rounded
            :class="[
              'bg-transparent border-none text-primary-950 w-[10%] transform transition rounded-full no-ripple',
              section.is_open ? 'rotate-180' : 'rotate-0',
            ]"
            @click="() => (section.is_open = !section.is_open)"
          ></Button>
        </div>
        <Transition name="slide-accordion">
          <ul v-if="section.is_open" class="w-full overflow-hidden">
            <AppMenuItemSideBar
              :mapped-menu="section.children"
              :class="['bg-sky-200 rounded-md']"
            />
          </ul>
        </Transition>
      </div>
    </li>
  </div>
</template>
<script setup lang="ts">
import { Button } from 'primevue';

import { Menu } from '../interfaces/userState.store.interface';

const { mappedMenu } = defineProps<{
  mappedMenu: Menu[];
}>();

const isChildren = (value: Menu[]) => {
  if (value && value.length > 0) {
    return true;
  }
  return false;
};
</script>
<style scoped>
.no-ripple :deep(.p-ink) {
  display: none !important;
}

.slide-accordion-enter-active,
.slide-accordion-leave-active {
  transition:
    max-height 0.5s ease-in-out,
    opacity 0.4s ease-in-out;
}

.slide-accordion-leave-active {
  transition:
    max-height 0.3s ease-in,
    opacity 0.3s ease-in;
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

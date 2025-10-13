<template>
  <div
    id="pick_list_custom"
    class="flex justify-center w-full h-auto max-h-[250px] flex-row flex-wrap"
  >
    <section
      id="source_elements"
      class="flex flex-col flex-wrap border border-primary-950 w-[48%] rounded-xl h-full max-h-[250px] overflow-hidden"
    >
      <slot name="source_column">
        <div class="flex flex-col px-1 py-1 gap-2 h-full w-full">
          <AppInputText class="w-full flex-shrink-0" input-size="small" />
          <div class="overflow-y-auto flex-1 min-h-0">
            <ul class="flex flex-col gap-2 w-full">
              <li
                v-for="(item, index) in source"
                :key="index"
                class="flex justify-start hover:cursor-pointer w-full flex-shrink-0"
                @click="selectedItem(item)"
              >
                <Button :class="btnClass(item?.is_selected)" variant="text">{{
                  item[props.labelKey]
                }}</Button>
              </li>
            </ul>
          </div>
        </div>
      </slot>
    </section>
    <section
      id="buttons_section"
      class="flex flex-col flex-wrap w-[4%] justify-center items-center gap-4"
    >
      <Button
        class="flex items-center justify-center text-center"
        rounded
        variant="outlined"
        icon="pi pi-angle-right"
        @click=""
      />
      <Button
        class="flex items-center justify-center text-center"
        rounded
        variant="outlined"
        icon="pi pi-angle-double-right"
        @click=""
      />
      <Button
        class="flex items-center justify-center text-center"
        rounded
        variant="outlined"
        icon="pi pi-angle-left"
        @click=""
      />
      <Button
        class="flex items-center justify-center text-center"
        rounded
        variant="outlined"
        icon="pi pi-angle-double-left"
        @click=""
      />
    </section>
    <section
      id="target_element"
      class="flex flex-col flex-wrap w-[48%] border border-primary-950 rounded-xl overflow-y-hidden max-h-[250px]"
    >
      <slot name="target_column">
        <div class="flex flex-col px-1 py-1 gap-2 h-full w-full">
          <AppInputText class="w-full flex-shrink-0" input-size="small" />
          <div class="overflow-y-auto flex-1 min-h-0">
            <ul class="flex flex-col gap-2 w-full">
              <li
                v-for="(item, index) in target"
                :key="index"
                class="flex justify-start hover:cursor-pointer w-full flex-shrink-0"
                @click="selectedItem(item)"
              >
                <Button :class="btnClass(item?.is_selected)" variant="text">{{
                  item[props.labelKey]
                }}</Button>
              </li>
            </ul>
          </div>
        </div>
      </slot>
    </section>
  </div>
</template>
<script setup lang="ts" generic="T">
import { Button } from 'primevue';
import { computed, onMounted, ref } from 'vue';

const props = defineProps<{
  modelValue: T[][];
  dataKey: string;
  labelKey: string;
  pagination?: boolean;
  rows?: number;
  totalRecords?: number;
  first?: number;
}>();

const source = ref<T[]>([]);
const target = ref<T[]>([]);

//const emit = defineEmits(['update:modelValue', 'update:page']);

const btnClass = computed(() => (flag: boolean) => {
  if (!flag) {
    return 'w-full text-start flex justify-start transition-colors duration-200';
  }
  return 'w-full text-start flex justify-start transition-colors duration-200 bg-surface-300 hover:bg-surface-300';
});

const selectedItem = item => {
  item.is_selected = !item.is_selected;
};
onMounted(() => {
  source.value = props.modelValue[0].map(item => ({
    ...item,
    is_selected: false,
    moved_to_target: false,
    moved_to_source: false,
  }));
  target.value = props.modelValue[1].map(item => ({
    ...item,
    is_selected: false,
    moved_to_target: false,
    moved_to_source: false,
  }));
});
</script>
<style scoped></style>

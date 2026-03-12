<template>
    <Chip class="flex justify-center items-center max-w-[100px] min-w-[100px]">
        <template v-for="(_, name) in $slots" #[name]="slotProps">
            <slot :name="name" v-bind="slotProps || {}" />
        </template>
    </Chip>
</template>

<script setup lang="ts">
import { Chip } from 'primevue';
</script>

<style scoped></style>

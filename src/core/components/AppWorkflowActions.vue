<template>
  <div
    v-if="transitions && transitions.length > 0"
    class="flex items-center gap-2 flex-wrap"
  >
    <Button
      v-for="t in transitions"
      :key="t.event"
      :label="t.label"
      :icon="t.icon"
      :severity="t.severity"
      :disabled="disabled || loading"
      :loading="loading"
      size="small"
      @click="$emit('trigger', t)"
    />
  </div>
</template>

<script setup lang="ts">
import Button from 'primevue/button';

import type { WorkflowTransition } from '../interfaces/workflow.interface';

defineProps<{
  transitions?: WorkflowTransition[];
  disabled?: boolean;
  loading?: boolean;
}>();

defineEmits<{
  (e: 'trigger', transition: WorkflowTransition): void;
}>();
</script>

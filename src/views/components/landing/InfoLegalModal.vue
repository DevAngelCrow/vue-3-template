<template>
  <AppModal
    :show="visible"
    width="48rem"
    show-icon-close
    @close-modal="emit('update:visible', false)"
    @update:show="(val: boolean) => emit('update:visible', val)"
  >
    <template #header>
      <div class="w-full text-left space-y-1 pr-6">
        <span
          class="text-[11px] font-mono uppercase tracking-wider text-primary-700 font-bold block"
        >
          Documentación Modelo · Plantilla Base
        </span>
        <h3
          class="text-base sm:text-lg font-bold text-surface-900 leading-tight"
        >
          Política de Privacidad y Términos de Uso
        </h3>
      </div>
    </template>

    <div class="w-full max-h-[68vh] overflow-y-auto px-1 py-1">
      <AppTab
        v-model="activeTab"
        :tabs="legalTabs"
        animation="slide-left"
        :scrollable="false"
        :lazy="false"
      >
        <template #panel-privacy>
          <div class="space-y-4 pt-3">
            <AppSkeleton
              v-if="loading"
              :loading="true"
              variant="text"
              :count="5"
            />

            <div
              v-else-if="error || !privacyDocument"
              class="rounded-xl border border-danger-200 bg-danger-50 p-4 text-xs text-danger-800 space-y-3"
            >
              <div class="flex items-start gap-2.5">
                <i
                  class="pi pi-exclamation-triangle text-danger-600 mt-0.5 shrink-0"
                ></i>
                <p class="leading-relaxed">
                  No fue posible cargar el documento de Privacidad en este
                  momento.
                </p>
              </div>
              <div>
                <Button
                  type="button"
                  size="small"
                  severity="danger"
                  variant="outlined"
                  icon="pi pi-refresh"
                  label="Reintentar carga"
                  @click="emit('retry')"
                />
              </div>
            </div>

            <div
              v-else
              class="space-y-5 text-xs text-surface-700 leading-relaxed"
            >
              <div
                class="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-surface-200"
              >
                <div class="flex flex-wrap items-center gap-2">
                  <AppChip
                    :label="`Versión v${privacyDocument.version}`"
                    severity="primary"
                    size="small"
                    icon="pi pi-verified"
                  />
                  <span class="text-[11px] text-surface-500 font-medium">
                    Actualizado el
                    {{ formatPublishedDate(privacyDocument.publishedAt) }}
                  </span>
                </div>
              </div>

              <div
                class="p-3.5 rounded-xl bg-primary-50 border border-primary-200 text-primary-950"
              >
                <div
                  class="font-bold text-[11px] font-mono uppercase tracking-wide text-primary-800 mb-0.5"
                >
                  {{ privacyDocument.summaryBadge }}
                </div>
                <p class="text-xs">{{ privacyDocument.subtitle }}</p>
              </div>

              <div
                v-for="(section, idx) in privacyDocument.sections"
                :key="`privacy-sec-${idx}`"
                :class="[
                  'space-y-2',
                  section.tone === 'warn'
                    ? 'p-3.5 rounded-xl bg-warn-50 border border-warn-200 text-warn-950'
                    : '',
                ]"
              >
                <h4
                  :class="
                    section.tone === 'warn'
                      ? 'font-bold text-xs uppercase tracking-wide text-warn-900 flex items-center gap-1.5'
                      : 'font-bold text-sm text-surface-900'
                  "
                >
                  <i
                    v-if="section.tone === 'warn'"
                    class="pi pi-exclamation-circle text-warn-700"
                  ></i>
                  <span>{{ section.heading }}</span>
                </h4>

                <p
                  v-for="(paragraph, pIdx) in section.paragraphs"
                  :key="`privacy-p-${idx}-${pIdx}`"
                >
                  {{ paragraph }}
                </p>

                <ul
                  v-if="section.bullets && section.bullets.length > 0"
                  class="list-disc pl-5 space-y-1 text-surface-600"
                >
                  <li
                    v-for="(bullet, bIdx) in section.bullets"
                    :key="`privacy-b-${idx}-${bIdx}`"
                  >
                    {{ bullet }}
                  </li>
                </ul>

                <div
                  v-if="section.callout"
                  :class="[
                    'p-3 rounded-lg border mt-1.5 text-xs',
                    section.tone === 'warn'
                      ? 'bg-warn-100/70 border-warn-300 text-warn-950'
                      : 'bg-surface-50 border-surface-200 text-surface-800',
                  ]"
                >
                  <div v-if="section.callout.title" class="font-bold mb-0.5">
                    {{ section.callout.title }}
                  </div>
                  <p>{{ section.callout.body }}</p>
                </div>
              </div>
            </div>
          </div>
        </template>

        <template #panel-terms>
          <div class="space-y-4 pt-3">
            <AppSkeleton
              v-if="loading"
              :loading="true"
              variant="text"
              :count="5"
            />

            <div
              v-else-if="error || !termsDocument"
              class="rounded-xl border border-danger-200 bg-danger-50 p-4 text-xs text-danger-800 space-y-3"
            >
              <div class="flex items-start gap-2.5">
                <i
                  class="pi pi-exclamation-triangle text-danger-600 mt-0.5 shrink-0"
                ></i>
                <p class="leading-relaxed">
                  No fue posible cargar los Términos de Uso en este momento.
                </p>
              </div>
              <div>
                <Button
                  type="button"
                  size="small"
                  severity="danger"
                  variant="outlined"
                  icon="pi pi-refresh"
                  label="Reintentar carga"
                  @click="emit('retry')"
                />
              </div>
            </div>

            <div
              v-else
              class="space-y-5 text-xs text-surface-700 leading-relaxed"
            >
              <div
                class="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-surface-200"
              >
                <div class="flex flex-wrap items-center gap-2">
                  <AppChip
                    :label="`Versión v${termsDocument.version}`"
                    severity="primary"
                    size="small"
                    icon="pi pi-verified"
                  />
                  <span class="text-[11px] text-surface-500 font-medium">
                    Actualizado el
                    {{ formatPublishedDate(termsDocument.publishedAt) }}
                  </span>
                </div>
              </div>

              <div
                class="p-3.5 rounded-xl bg-surface-100 border border-surface-200 text-surface-800"
              >
                <div
                  class="font-bold text-[11px] font-mono uppercase tracking-wide text-surface-600 mb-0.5"
                >
                  {{ termsDocument.summaryBadge }}
                </div>
                <p class="text-xs">{{ termsDocument.subtitle }}</p>
              </div>

              <div
                v-for="(section, idx) in termsDocument.sections"
                :key="`terms-sec-${idx}`"
                class="space-y-2"
              >
                <h4 class="font-bold text-sm text-surface-900">
                  {{ section.heading }}
                </h4>

                <p
                  v-for="(paragraph, pIdx) in section.paragraphs"
                  :key="`terms-p-${idx}-${pIdx}`"
                >
                  {{ paragraph }}
                </p>

                <ul
                  v-if="section.bullets && section.bullets.length > 0"
                  class="list-disc pl-5 space-y-1 text-surface-600"
                >
                  <li
                    v-for="(bullet, bIdx) in section.bullets"
                    :key="`terms-b-${idx}-${bIdx}`"
                  >
                    {{ bullet }}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </template>
      </AppTab>
    </div>

    <template #footer>
      <div class="w-full flex justify-end">
        <Button
          type="button"
          severity="primary"
          size="small"
          label="Entendido y Cerrar"
          class="font-semibold !text-xs !py-2 !px-4"
          @click="emit('update:visible', false)"
        />
      </div>
    </template>
  </AppModal>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { Button } from 'primevue';

import type { AppTabItem, AppTabValue } from '@/core/interfaces/tab.interface';
import { FormatDate } from '@/core/utils/dates';

import type { LandingLegalDocument } from './landing.starter.data';

const props = withDefaults(
  defineProps<{
    visible: boolean;
    initialTab?: 'privacy' | 'terms';
    termsDocument?: LandingLegalDocument | null;
    privacyDocument?: LandingLegalDocument | null;
    loading?: boolean;
    error?: boolean;
  }>(),
  {
    initialTab: 'privacy',
    termsDocument: null,
    privacyDocument: null,
    loading: false,
    error: false,
  },
);

const emit = defineEmits<{
  'update:visible': [val: boolean];
  retry: [];
}>();

const legalTabs: AppTabItem[] = [
  {
    value: 'privacy',
    label: 'Política de Privacidad',
    icon: 'pi pi-shield',
  },
  {
    value: 'terms',
    label: 'Términos y Condiciones',
    icon: 'pi pi-file-edit',
  },
];

const activeTab = ref<AppTabValue>(props.initialTab);

watch(
  () => props.initialTab,
  newTab => {
    activeTab.value = newTab;
  },
);

const formatPublishedDate = (date?: string | null): string => {
  if (!date) return '-';
  return FormatDate(date, 'DD/MM/YYYY') || '-';
};
</script>

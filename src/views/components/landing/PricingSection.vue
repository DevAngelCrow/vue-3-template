<template>
  <section
    id="pricing-section"
    class="py-16 lg:py-24 bg-surface-50 border-b border-surface-200 scroll-mt-18"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      <!-- Encabezado Editorial -->
      <div
        class="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-surface-200 pb-6"
      >
        <div class="space-y-2">
          <div
            class="text-xs font-mono uppercase tracking-widest text-primary-700 font-bold"
          >
            04 / Capacidades &amp; Módulos del Starter
          </div>
          <h2 class="text-2xl sm:text-3xl font-bold text-surface-900">
            Explora e incluye patrones técnicos para tu proyecto
          </h2>
          <p class="text-sm text-surface-600 max-w-2xl">
            Filtra por categoría o busca por palabra clave. Los elementos que
            marques aquí se sincronizan reactivamente con el formulario de
            evaluación mediante Pinia.
          </p>
        </div>

        <div class="flex items-center gap-3 self-start md:self-end">
          <span
            class="inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-mono bg-white border border-surface-200 text-surface-700"
          >
            <span class="w-2 h-2 rounded-full bg-success-600"></span>
            {{ filteredCapabilities.length }} capacidad(es) visibles
          </span>
        </div>
      </div>

      <!-- Barra de Búsqueda + Filtros por Categoría -->
      <div
        class="bg-white p-4 sm:p-5 rounded-xl border border-surface-200 shadow-2xs space-y-4"
      >
        <div class="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          <div class="md:col-span-5">
            <AppInputText
              v-model="searchQuery"
              placeholder="Buscar patrón, componente o tecnología (ej. Turnstile, S3)..."
              prepend-inner-icon="pi pi-search"
              :append-icon="searchQuery ? 'pi pi-times' : ''"
              fluid
              @click-end-icon="searchQuery = ''"
            />
          </div>

          <div
            class="md:col-span-7 flex items-center gap-2 overflow-x-auto pb-1"
          >
            <Button
              type="button"
              size="small"
              :severity="
                activeCategoryFilter === 'ALL' ? 'primary' : 'secondary'
              "
              :variant="activeCategoryFilter === 'ALL' ? undefined : 'outlined'"
              :label="`Todas (${LANDING_CAPABILITIES.length})`"
              class="!text-xs font-semibold whitespace-nowrap"
              @click="activeCategoryFilter = 'ALL'"
            />

            <Button
              v-for="cat in categories"
              :key="cat"
              type="button"
              size="small"
              :severity="activeCategoryFilter === cat ? 'primary' : 'secondary'"
              :variant="activeCategoryFilter === cat ? undefined : 'outlined'"
              :label="`${cat} (${getCategoryCount(cat)})`"
              class="!text-xs font-semibold whitespace-nowrap"
              @click="activeCategoryFilter = cat"
            />
          </div>
        </div>

        <div
          v-if="searchQuery || activeCategoryFilter !== 'ALL'"
          class="flex items-center justify-between text-xs text-surface-500 pt-2 border-t border-surface-100"
        >
          <span>
            Filtro activo:
            <strong class="text-surface-900">
              {{
                activeCategoryFilter === 'ALL'
                  ? 'Todas las categorías'
                  : activeCategoryFilter
              }}
              {{ searchQuery ? `· "${searchQuery}"` : '' }}
            </strong>
          </span>
          <Button
            type="button"
            variant="link"
            size="small"
            label="Limpiar filtros"
            class="!text-xs !font-semibold !text-primary-800 !p-0"
            @click="resetFilters"
          />
        </div>
      </div>

      <!-- Grid de Capacidades -->
      <div
        v-if="filteredCapabilities.length > 0"
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
      >
        <article
          v-for="cap in filteredCapabilities"
          :key="cap.id"
          class="bg-white rounded-xl border transition-all flex flex-col justify-between overflow-hidden"
          :class="
            inquiryStore.isSelected(cap.id)
              ? 'border-primary-600 ring-1 ring-primary-600/20 shadow-sm'
              : 'border-surface-200 hover:border-surface-300 shadow-2xs'
          "
        >
          <div>
            <div
              class="px-5 pt-4 pb-3 bg-surface-50/70 border-b border-surface-100 flex items-center justify-between gap-2"
            >
              <span
                class="inline-flex items-center gap-1.5 text-xs font-semibold text-primary-800"
              >
                <i :class="cap.icon" class="text-primary-600 text-xs"></i>
                {{ cap.category }}
              </span>
              <span
                class="text-[11px] font-mono font-bold text-surface-600 bg-surface-200/70 px-2 py-0.5 rounded"
              >
                {{ cap.code }}
              </span>
            </div>

            <div class="p-5 space-y-3">
              <h3 class="text-base font-bold text-surface-900 leading-snug">
                {{ cap.name }}
              </h3>

              <p class="text-xs text-surface-600 leading-relaxed">
                {{ cap.summary }}
              </p>

              <div class="flex flex-wrap items-center gap-1.5 pt-1">
                <AppChip
                  v-for="highlight in cap.highlights"
                  :key="highlight"
                  :label="highlight"
                  severity="secondary"
                  size="small"
                />
              </div>
            </div>
          </div>

          <div
            class="px-5 py-3.5 bg-surface-50/60 border-t border-surface-200/80 space-y-2.5"
          >
            <div class="text-[11px] font-mono text-surface-500">
              {{ cap.stackTag }}
            </div>

            <Button
              type="button"
              :severity="
                inquiryStore.isSelected(cap.id) ? 'primary' : 'secondary'
              "
              :variant="
                inquiryStore.isSelected(cap.id) ? undefined : 'outlined'
              "
              size="small"
              :icon="
                inquiryStore.isSelected(cap.id) ? 'pi pi-check' : 'pi pi-plus'
              "
              :label="
                inquiryStore.isSelected(cap.id)
                  ? 'Incluido en evaluación'
                  : 'Incluir en evaluación'
              "
              class="w-full font-bold !text-xs"
              @click="toggleCapability(cap)"
            />
          </div>
        </article>
      </div>

      <!-- Estado sin resultados -->
      <div
        v-else
        class="bg-white rounded-xl border border-surface-200 p-12 text-center space-y-3"
      >
        <i class="pi pi-search text-3xl text-surface-400"></i>
        <h3 class="text-base font-bold text-surface-900">
          No hay capacidades que coincidan con tu búsqueda
        </h3>
        <p class="text-xs text-surface-500 max-w-md mx-auto">
          Limpia el término de búsqueda o selecciona todas las categorías para
          ver los patrones incluidos en la plantilla.
        </p>
        <Button
          type="button"
          severity="primary"
          size="small"
          label="Restablecer filtros"
          class="font-semibold !text-xs"
          @click="resetFilters"
        />
      </div>

      <!-- Barra de Resumen de Selección Activa -->
      <div
        v-if="selectedCount > 0"
        class="bg-primary-950 text-white rounded-xl p-5 sm:p-6 border border-primary-800 shadow-lg flex flex-col lg:flex-row lg:items-center justify-between gap-4"
      >
        <div class="space-y-1">
          <div class="flex items-center gap-2">
            <span
              class="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-primary-500 text-primary-950"
            >
              EVALUACIÓN ACTIVA
            </span>
            <h3 class="text-base font-bold text-white">
              Tienes {{ selectedCount }} capacidad(es) seleccionada(s)
            </h3>
          </div>
          <p class="text-xs text-surface-300">
            Tu selección permanece sincronizada con el formulario de contacto
            mediante Pinia.
          </p>
        </div>

        <div class="flex flex-wrap items-center gap-3 shrink-0">
          <Button
            type="button"
            variant="outlined"
            severity="secondary"
            size="small"
            label="Limpiar selección"
            class="!text-surface-200 !border-white/25 hover:!bg-white/10 !text-xs font-semibold"
            @click="inquiryStore.clearModules()"
          />
          <Button
            type="button"
            severity="primary"
            size="small"
            icon="pi pi-arrow-right"
            icon-pos="right"
            label="Continuar al Formulario"
            class="font-bold !text-xs !px-5"
            @click="scrollToLandingSection('cta-section')"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { Button } from 'primevue';

import { useLandingInquiryStore } from '@/core/store/useLandingInquiryStore';

import {
  LANDING_CAPABILITIES,
  scrollToLandingSection,
  type LandingCapabilityItem,
} from './landing.starter.data';

const inquiryStore = useLandingInquiryStore();
const { activeCategoryFilter, selectedCount } = storeToRefs(inquiryStore);

const searchQuery = ref('');

const categories: LandingCapabilityItem['category'][] = [
  'Seguridad & IAM',
  'UI PrimeVue 5',
  'Datos & Storage',
];

const getCategoryCount = (cat: LandingCapabilityItem['category']): number => {
  return LANDING_CAPABILITIES.filter(item => item.category === cat).length;
};

const filteredCapabilities = computed(() => {
  const q = searchQuery.value.trim().toLowerCase();
  return LANDING_CAPABILITIES.filter(item => {
    const matchesCategory =
      activeCategoryFilter.value === 'ALL' ||
      item.category === activeCategoryFilter.value;
    if (!matchesCategory) return false;
    if (!q) return true;

    return (
      item.name.toLowerCase().includes(q) ||
      item.code.toLowerCase().includes(q) ||
      item.summary.toLowerCase().includes(q) ||
      item.stackTag.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q)
    );
  });
});

const toggleCapability = (cap: LandingCapabilityItem) => {
  inquiryStore.toggleModule({
    id: cap.id,
    code: cap.code,
    name: cap.name,
    category: cap.category,
  });
};

const resetFilters = () => {
  activeCategoryFilter.value = 'ALL';
  searchQuery.value = '';
};
</script>

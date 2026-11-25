<template>
  <section
    id="how-it-works-section"
    class="py-16 lg:py-24 bg-surface-50 border-b border-surface-200 scroll-mt-18"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      <!-- Encabezado Editorial -->
      <div
        class="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-surface-200 pb-6"
      >
        <div class="space-y-2">
          <div
            class="text-xs font-mono uppercase tracking-widest text-primary-700 font-bold"
          >
            02 / Flujo de Desarrollo
          </div>
          <h2 class="text-2xl sm:text-3xl font-bold text-surface-900">
            ¿Cómo construir nuevos módulos sobre esta arquitectura?
          </h2>
        </div>
        <p class="text-sm text-surface-600 max-w-md">
          Cuatro pasos estandarizados que mantienen coherencia entre el backend
          hexagonal y la capa visual en PrimeVue 5.
        </p>
      </div>

      <!-- 4 Pasos Numerados -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div
          v-for="step in steps"
          :key="step.number"
          class="bg-white rounded-xl border border-surface-200 p-6 flex flex-col justify-between gap-6"
        >
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <span
                class="text-xs font-mono font-bold px-2.5 py-1 rounded bg-primary-950 text-primary-300"
              >
                PASO {{ step.number }}
              </span>
              <i :class="step.icon" class="text-surface-400 text-lg"></i>
            </div>

            <h3 class="text-base font-bold text-surface-900">
              {{ step.title }}
            </h3>

            <p class="text-xs text-surface-600 leading-relaxed">
              {{ step.description }}
            </p>
          </div>

          <div
            class="pt-3 border-t border-surface-100 text-[11px] font-medium text-surface-500"
          >
            {{ step.note }}
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const steps = [
  {
    number: '01',
    title: 'Modela dominio y contratos',
    description:
      'Define entidades, puertos e implementaciones Prisma en hexagonal_template_nestjs con DTOs validados y transacciones seguras con AfterCommitPort.',
    note: 'Aislamiento hexagonal verificado por pruebas.',
    icon: 'pi pi-sitemap',
  },
  {
    number: '02',
    title: 'Conecta queries y estado',
    description:
      'Consume catálogos dinámicos con TanStack Query v5, debounce canónico y supresión selectiva de alertas cuando una vista pública opera desconectada.',
    note: 'Caché reactivo y cero datos quemados.',
    icon: 'pi pi-server',
  },
  {
    number: '03',
    title: 'Ensambla vistas con App*',
    description:
      'Usa wrappers App* con Vee-Validate + Yup, máscaras telefónicas dinámicas por país, tabs animados y scroll automático hacia el primer error.',
    note: 'Jerarquía estricta 1° App* > 2° PrimeVue.',
    icon: 'pi pi-sliders-h',
  },
  {
    number: '04',
    title: 'Valida calidad y tipos',
    description:
      'Ejecuta ESLint, vue-tsc, oxlint --type-aware y Vitest antes de liberar cada módulo garantizando cero any y cero regresiones de contratos.',
    note: 'Build determinista listo para CI/CD.',
    icon: 'pi pi-check-circle',
  },
];
</script>

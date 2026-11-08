<template>
  <footer class="bg-primary-950 text-surface-300 border-t border-white/10">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
      <div
        class="grid grid-cols-1 md:grid-cols-12 gap-8 pb-10 border-b border-white/10"
      >
        <!-- Columna 1: Marca (4 cols) -->
        <div class="md:col-span-4 space-y-4">
          <div class="flex items-center gap-3">
            <div
              class="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center shadow-md shadow-primary-500/20 ring-1 ring-white/20 shrink-0"
            >
              <i class="pi pi-compass text-white text-lg"></i>
            </div>
            <div>
              <div class="text-base font-bold text-white leading-none">
                {{ contactInfo.businessName }}
              </div>
              <div
                class="text-[11px] text-primary-200/75 uppercase tracking-wider mt-1"
              >
                {{ contactInfo.tagline }}
              </div>
            </div>
          </div>
          <p class="text-xs text-surface-400 leading-relaxed max-w-sm">
            Arquitectura frontend robusta con Vue 3.5, Vite 7, TypeScript,
            PrimeVue 5 y Tailwind CSS 4 para aplicaciones empresariales de alto
            rendimiento.
          </p>
        </div>

        <!-- Columna 2: Módulos y Arquitectura (4 cols) -->
        <div class="md:col-span-4 space-y-3">
          <div
            class="text-xs font-mono uppercase tracking-wider text-primary-300 font-semibold"
          >
            Módulos del Sistema
          </div>
          <ul class="grid grid-cols-2 gap-2 text-xs">
            <li v-for="item in moduleList" :key="item.label">
              <span class="text-surface-300 flex items-center gap-1.5">
                <i class="pi pi-check-circle text-primary-400 text-[10px]"></i>
                {{ item.label }}
              </span>
            </li>
          </ul>
        </div>

        <!-- Columna 3: Contacto Directo (4 cols) -->
        <div class="md:col-span-4 space-y-3">
          <div
            class="text-xs font-mono uppercase tracking-wider text-primary-300 font-semibold"
          >
            Contacto y Soporte
          </div>
          <ul class="space-y-2 text-xs text-surface-300">
            <li class="flex items-center gap-2">
              <i class="pi pi-whatsapp text-primary-400 text-xs"></i>
              <span>{{ contactInfo.whatsappDisplay }}</span>
            </li>
            <li class="flex items-center gap-2">
              <i class="pi pi-envelope text-primary-400 text-xs"></i>
              <span>{{ contactInfo.email }}</span>
            </li>
            <li class="flex items-start gap-2">
              <i class="pi pi-map-marker text-primary-400 text-xs mt-0.5"></i>
              <span>
                {{ contactInfo.addressLine1 }} · {{ contactInfo.addressLine2 }}
              </span>
            </li>
          </ul>
        </div>
      </div>

      <!-- Pie Inferior -->
      <div
        class="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-surface-400"
      >
        <div>
          &copy; {{ currentYear }} {{ contactInfo.businessName }}. Todos los
          derechos reservados.
        </div>

        <div class="flex items-center gap-5">
          <RouterLink
            to="/login"
            class="inline-flex items-center gap-1.5 text-surface-400 hover:text-white transition-colors"
          >
            <i class="pi pi-lock text-[11px]"></i>
            <span>Acceso al Sistema</span>
          </RouterLink>
          <RouterLink
            to="/test-view"
            class="inline-flex items-center gap-1.5 text-surface-400 hover:text-white transition-colors"
          >
            <i class="pi pi-palette text-[11px]"></i>
            <span>Catálogo UI</span>
          </RouterLink>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router';

import { LANDING_CONTACT_INFO } from './landing.config';

const contactInfo = LANDING_CONTACT_INFO;
const currentYear = new Date().getFullYear();

const moduleList = [
  { label: 'IAM & Permisos' },
  { label: 'Gestión de Roles' },
  { label: 'Catálogos Base' },
  { label: 'TanStack Query v5' },
  { label: 'Formularios Yup' },
  { label: 'PrimeVue 5 UI' },
];
</script>

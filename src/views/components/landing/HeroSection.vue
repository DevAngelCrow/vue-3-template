<template>
  <section
    id="hero-section"
    class="relative w-full bg-primary-950 text-white overflow-hidden border-b border-primary-900"
  >
    <!-- Cuadrícula arquitectónica sutil de fondo -->
    <div
      class="pointer-events-none absolute inset-0 opacity-[0.06] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:48px_48px]"
    ></div>

    <div
      class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16 lg:py-20"
    >
      <div
        class="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center"
      >
        <!-- Columna Principal: Propuesta de Valor (7 cols) -->
        <div class="lg:col-span-7 space-y-6">
          <div
            class="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-md bg-white/5 border border-white/15 text-xs font-mono uppercase tracking-wider text-primary-300"
          >
            <span class="w-2 h-2 rounded-full bg-primary-400"></span>
            Arquitectura Modular Vue 3.5 + Vite 7 + PrimeVue 5
          </div>

          <h1
            class="text-3xl sm:text-5xl font-bold tracking-tight text-white leading-[1.12]"
          >
            La base frontend definitiva para
            <span class="text-primary-400">aplicaciones empresariales.</span>
          </h1>

          <p
            class="text-base sm:text-lg text-surface-300 leading-relaxed max-w-2xl"
          >
            Diseñada para equipos exigentes: TypeScript estricto, gestión de
            estado de servidor con <strong>TanStack Query v5</strong>,
            validación robusta con <strong>Vee-Validate</strong> y Yup, sistema
            de diseño responsivo con <strong>PrimeVue 5</strong> y Tailwind CSS
            4.
          </p>

          <!-- Acciones Principales con PrimeVue Button -->
          <div class="flex flex-wrap items-center gap-3.5 pt-2">
            <RouterLink to="/login">
              <Button
                type="button"
                icon="pi pi-sign-in"
                label="Acceder al Sistema"
                class="font-bold !text-sm !py-3.5 !px-6 shadow-sm !bg-primary-600 hover:!bg-primary-500 !text-white border-none"
              />
            </RouterLink>

            <RouterLink to="/test-view">
              <Button
                type="button"
                variant="outlined"
                icon="pi pi-palette"
                label="Catálogo de Componentes"
                class="font-semibold !text-sm !py-3.5 !px-5 !border-white/20 !text-white hover:!bg-white/10"
              />
            </RouterLink>
          </div>

          <!-- Franja Operativa de Respaldo -->
          <div
            class="pt-6 mt-4 border-t border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-4"
          >
            <div class="flex items-start gap-3">
              <div
                class="w-8 h-8 rounded-md bg-primary-900 border border-primary-700/60 flex items-center justify-center shrink-0 text-primary-300 mt-0.5"
              >
                <i class="pi pi-shield text-sm"></i>
              </div>
              <div>
                <div class="text-xs font-bold text-white">IAM & Permisos</div>
                <p class="text-xs text-surface-400 mt-0.5 leading-snug">
                  Gestión granular de roles, rutas autorizadas y sesiones con
                  cookie HttpOnly.
                </p>
              </div>
            </div>

            <div class="flex items-start gap-3">
              <div
                class="w-8 h-8 rounded-md bg-primary-900 border border-primary-700/60 flex items-center justify-center shrink-0 text-primary-300 mt-0.5"
              >
                <i class="pi pi-database text-sm"></i>
              </div>
              <div>
                <div class="text-xs font-bold text-white">
                  Catálogos Dinámicos
                </div>
                <p class="text-xs text-surface-400 mt-0.5 leading-snug">
                  Consumo estricto vía endpoints con debounce canónico y caché
                  en memoria.
                </p>
              </div>
            </div>

            <div class="flex items-start gap-3">
              <div
                class="w-8 h-8 rounded-md bg-primary-900 border border-primary-700/60 flex items-center justify-center shrink-0 text-primary-300 mt-0.5"
              >
                <i class="pi pi-mobile text-sm"></i>
              </div>
              <div>
                <div class="text-xs font-bold text-white">Mobile-First UI</div>
                <p class="text-xs text-surface-400 mt-0.5 leading-snug">
                  Jerarquía de 3 niveles y componentes fluidos adaptados a
                  cualquier pantalla.
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Columna Secundaria: Preview Visual (5 cols) -->
        <div class="lg:col-span-5">
          <div
            class="relative rounded-2xl border border-white/15 bg-primary-900/40 p-6 backdrop-blur-xl shadow-2xl"
          >
            <div
              class="flex items-center justify-between pb-4 border-b border-white/10"
            >
              <div class="flex items-center gap-2">
                <span class="w-3 h-3 rounded-full bg-red-500/80"></span>
                <span class="w-3 h-3 rounded-full bg-amber-500/80"></span>
                <span class="w-3 h-3 rounded-full bg-emerald-500/80"></span>
              </div>
              <span class="text-xs font-mono text-primary-200"
                >vue-3-template@0.0.0</span
              >
            </div>

            <div class="space-y-4 pt-5">
              <div
                class="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1"
              >
                <div class="text-xs font-semibold text-primary-300">
                  Composition API + &lt;script setup&gt;
                </div>
                <p class="text-xs text-surface-300">
                  Modularidad desacoplada por feature/módulo con tipado
                  estricto.
                </p>
              </div>

              <div
                class="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1"
              >
                <div class="text-xs font-semibold text-primary-300">
                  PrimeVue 5 + Tailwind CSS 4
                </div>
                <p class="text-xs text-surface-300">
                  Wrappers globales App* con IconField, FloatLabel y Stepper.
                </p>
              </div>

              <div
                class="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1"
              >
                <div class="text-xs font-semibold text-primary-300">
                  Gobernanza de Agentes (AGENTS.md)
                </div>
                <p class="text-xs text-surface-300">
                  7 skills especializados para scaffolding, calidad y contratos.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router';
import { Button } from 'primevue';
</script>

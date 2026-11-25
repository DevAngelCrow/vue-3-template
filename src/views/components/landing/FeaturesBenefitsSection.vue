<template>
  <section
    id="features-section"
    class="py-16 lg:py-24 bg-white border-b border-surface-200 scroll-mt-18"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      <!-- Encabezado Editorial -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end">
        <div class="lg:col-span-7 space-y-2">
          <div
            class="text-xs font-mono uppercase tracking-widest text-primary-700 font-bold"
          >
            01 / Arquitectura Base
          </div>
          <h2 class="text-2xl sm:text-3xl font-bold text-surface-900">
            Capacidades transversales listas desde el primer commit
          </h2>
        </div>
        <div class="lg:col-span-5">
          <p class="text-sm text-surface-600 leading-relaxed">
            La plantilla unifica seguridad HTTP, transacciones atómicas,
            catálogos dinámicos y wrappers PrimeVue 5 tipados para acelerar el
            desarrollo sin comprometer mantenibilidad.
          </p>
        </div>
      </div>

      <!-- Cuadrícula Asimétrica de Capacidades -->
      <div class="grid grid-cols-1 md:grid-cols-12 gap-5">
        <!-- Bloque 1: Backend Hexagonal + Transacciones Atómicas (7 cols) -->
        <div
          class="md:col-span-7 p-6 sm:p-8 rounded-xl bg-surface-50 border border-surface-200 flex flex-col justify-between gap-6"
        >
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <span
                class="w-10 h-10 rounded-lg bg-primary-950 text-primary-300 flex items-center justify-center text-base"
              >
                <i class="pi pi-database"></i>
              </span>
              <span
                class="text-[11px] font-mono uppercase tracking-wider text-surface-500 font-semibold"
              >
                Consistencia &amp; Auditoría
              </span>
            </div>
            <h3 class="text-xl font-bold text-surface-900">
              Transacciones AfterCommit y generador atómico de folios
            </h3>
            <p class="text-sm text-surface-600 leading-relaxed">
              Ejecuta efectos secundarios irreversibles solo tras confirmar el
              commit mediante el puerto
              <code class="font-mono text-xs text-primary-800"
                >AfterCommitPort</code
              >, y genera correlativos anuales sin condiciones de carrera usando
              <code class="font-mono text-xs text-primary-800"
                >SequenceGeneratorService</code
              >.
            </p>
          </div>

          <div
            class="pt-4 border-t border-surface-200/80 flex flex-wrap items-center gap-3 text-xs font-medium text-surface-700"
          >
            <span class="inline-flex items-center gap-1.5">
              <i class="pi pi-check text-success-700 text-xs"></i>
              Prisma 7 con transacciones seguras
            </span>
            <span class="text-surface-300">•</span>
            <span class="inline-flex items-center gap-1.5">
              <i class="pi pi-check text-success-700 text-xs"></i>
              Auditoría y soft-delete en lectura
            </span>
          </div>
        </div>

        <!-- Bloque 2: Seguridad HTTP & Anti-Bot (5 cols) -->
        <div
          class="md:col-span-5 p-6 sm:p-8 rounded-xl bg-primary-950 text-white border border-primary-900 flex flex-col justify-between gap-6"
        >
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <span
                class="w-10 h-10 rounded-lg bg-primary-500 text-primary-950 flex items-center justify-center text-base font-bold"
              >
                <i class="pi pi-shield"></i>
              </span>
              <span
                class="text-[11px] font-mono uppercase tracking-wider text-primary-300 font-semibold"
              >
                Seguridad Activa
              </span>
            </div>
            <h3 class="text-xl font-bold text-white">
              IAM recursivo N-niveles y verificación Turnstile opt-in
            </h3>
            <p class="text-sm text-surface-300 leading-relaxed">
              Control de acceso fail-closed en rutas, poda jerárquica de menús,
              caché Redis O(1) por versión, cabecera
              <code class="font-mono text-xs text-primary-300"
                >TRUST_PROXY</code
              >
              y protección anti-bot bajo demanda.
            </p>
          </div>

          <div
            class="pt-4 border-t border-white/10 text-xs text-primary-200 flex items-center gap-2"
          >
            <i class="pi pi-lock text-primary-400"></i>
            <span>Sesiones con access token en memoria + cookie HttpOnly</span>
          </div>
        </div>

        <!-- Bloque 3: UI Responsiva PrimeVue 5 (6 cols) -->
        <div
          class="md:col-span-6 p-6 sm:p-7 rounded-xl bg-white border border-surface-200 flex flex-col justify-between gap-5"
        >
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <span
                class="w-10 h-10 rounded-lg bg-surface-100 border border-surface-200 text-primary-800 flex items-center justify-center text-base"
              >
                <i class="pi pi-palette"></i>
              </span>
              <span
                class="text-[11px] font-mono uppercase tracking-wider text-surface-500 font-semibold"
              >
                Jerarquía UI 3 Niveles
              </span>
            </div>
            <h3 class="text-lg font-bold text-surface-900">
              Wrappers globales App* sobre PrimeVue 5 y Tailwind CSS 4
            </h3>
            <p class="text-sm text-surface-600 leading-relaxed">
              Biblioteca completa de componentes tipados sin
              <code class="font-mono text-xs text-primary-800">any</code> ni
              aserciones forzadas: tablas dinámicas, skeletons, tabs animados,
              command menu <kbd class="font-mono text-xs">Ctrl+K</kbd> y
              máscaras adaptativas.
            </p>
          </div>

          <div class="flex flex-wrap gap-1.5">
            <AppChip
              v-for="tag in uiTags"
              :key="tag"
              :label="tag"
              severity="secondary"
              size="small"
            />
          </div>
        </div>

        <!-- Bloque 4: Catálogos Dinámicos & Storage Híbrido (6 cols) -->
        <div
          class="md:col-span-6 p-6 sm:p-7 rounded-xl bg-white border border-surface-200 flex flex-col justify-between gap-5"
        >
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <span
                class="w-10 h-10 rounded-lg bg-surface-100 border border-surface-200 text-primary-800 flex items-center justify-center text-base"
              >
                <i class="pi pi-cloud-upload"></i>
              </span>
              <span
                class="text-[11px] font-mono uppercase tracking-wider text-surface-500 font-semibold"
              >
                Storage &amp; Catálogos
              </span>
            </div>
            <h3 class="text-lg font-bold text-surface-900">
              Storage Local / S3 seguro y catálogos geográficos públicos
            </h3>
            <p class="text-sm text-surface-600 leading-relaxed">
              Descarga binaria desde S3 o sistema local con validación de magic
              bytes PDF y nombres UTF-8, junto a catálogos geográficos en caché
              con respaldo silencioso cuando el entorno está desconectado.
            </p>
          </div>

          <div class="pt-2">
            <Button
              type="button"
              label="Explorar capacidades del starter"
              icon="pi pi-arrow-right"
              icon-pos="right"
              variant="link"
              size="small"
              class="!p-0 !text-xs !font-bold !text-primary-800 hover:!text-primary-950"
              @click="scrollToLandingSection('pricing-section')"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { Button } from 'primevue';

import { scrollToLandingSection } from './landing.starter.data';

const uiTags = [
  'AppInputMask ARIA',
  'AppTab Animado',
  'AppSkeleton',
  'AppModal',
  'AppCommandMenu',
  'Tokens Semánticos',
];
</script>

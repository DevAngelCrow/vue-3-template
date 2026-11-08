<template>
  <div class="py-5 px-5 h-full max-h-full flex items-start justify-center">
    <section id="content" class="w-full xl:w-[92%] flex flex-col gap-6">
      <!-- Header del Dashboard -->
      <div
        class="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <AppTitle title="Panel de Control & Operaciones" />
          <p class="text-xs text-surface-500 mt-1">
            Resumen del sistema, acceso rápido a módulos de administración y
            catálogos base.
          </p>
        </div>
        <div class="flex items-center gap-2">
          <RouterLink to="/profile">
            <Button
              label="Mi Perfil"
              icon="pi pi-user"
              outlined
              class="rounded-md"
              size="small"
            />
          </RouterLink>
          <RouterLink to="/test-view">
            <Button
              label="Catálogo UI"
              icon="pi pi-palette"
              class="rounded-md"
              size="small"
            />
          </RouterLink>
        </div>
      </div>

      <!-- Skeleton de Carga Progresiva -->
      <div v-if="isLoading" class="space-y-4">
        <AppSkeleton variant="card" :count="4" class="w-full" />
      </div>

      <div v-else class="space-y-6">
        <!-- 4 Tarjetas de KPIs Principales -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <!-- Sesión y Usuario -->
          <div
            class="p-5 bg-white rounded-xl border border-surface-200 shadow-xs flex items-center justify-between"
          >
            <div>
              <div
                class="text-xs font-semibold text-surface-500 uppercase tracking-wider"
              >
                Sesión Activa
              </div>
              <div
                class="text-xl font-bold text-primary-700 mt-1 truncate max-w-[150px]"
              >
                {{ userName || 'Administrador' }}
              </div>
              <div class="text-[11px] text-surface-400 mt-0.5">
                Autenticado vía JWT
              </div>
            </div>
            <div
              class="w-12 h-12 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center text-xl shrink-0"
            >
              <i class="pi pi-user-check"></i>
            </div>
          </div>

          <!-- Módulos de Catálogo -->
          <div
            class="p-5 bg-white rounded-xl border border-surface-200 shadow-xs flex items-center justify-between"
          >
            <div>
              <div
                class="text-xs font-semibold text-surface-500 uppercase tracking-wider"
              >
                Catálogos Base
              </div>
              <div class="text-2xl font-bold text-emerald-700 mt-1">10</div>
              <div class="text-[11px] text-surface-400 mt-0.5">
                Geografía, documentos y estados
              </div>
            </div>
            <div
              class="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl shrink-0"
            >
              <i class="pi pi-database"></i>
            </div>
          </div>

          <!-- Módulos IAM -->
          <div
            class="p-5 bg-white rounded-xl border border-surface-200 shadow-xs flex items-center justify-between"
          >
            <div>
              <div
                class="text-xs font-semibold text-surface-500 uppercase tracking-wider"
              >
                Seguridad IAM
              </div>
              <div class="text-2xl font-bold text-blue-700 mt-1">Activo</div>
              <div class="text-[11px] text-surface-400 mt-0.5">
                Roles y permisos dinámicos
              </div>
            </div>
            <div
              class="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl shrink-0"
            >
              <i class="pi pi-shield"></i>
            </div>
          </div>

          <!-- Stack Tecnológico -->
          <div
            class="p-5 bg-white rounded-xl border border-surface-200 shadow-xs flex items-center justify-between"
          >
            <div>
              <div
                class="text-xs font-semibold text-surface-500 uppercase tracking-wider"
              >
                PrimeVue & Tailwind
              </div>
              <div class="text-xl font-bold text-purple-700 mt-1">
                v5.0 + v4.1
              </div>
              <div class="text-[11px] text-surface-400 mt-0.5">
                UI Kit corporativo
              </div>
            </div>
            <div
              class="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center text-xl shrink-0"
            >
              <i class="pi pi-code"></i>
            </div>
          </div>
        </div>

        <!-- Secciones de Acceso Rápido y Estado -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <!-- Columna Izquierda: Accesos Rápidos (7 cols) -->
          <div
            class="lg:col-span-7 p-6 bg-white rounded-xl border border-surface-200 shadow-xs space-y-4"
          >
            <div class="flex items-center justify-between">
              <h2 class="text-base font-bold text-surface-900">
                Accesos Rápidos del Sistema
              </h2>
              <span class="text-xs text-surface-400">Navegación directa</span>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <RouterLink
                to="/admin/roles"
                class="p-3.5 rounded-lg border border-surface-200 hover:border-primary-400 hover:bg-primary-50/30 transition-all text-xs font-semibold text-surface-800 flex items-center gap-3 no-underline group"
              >
                <div
                  class="w-8 h-8 rounded-lg bg-primary-100 text-primary-700 flex items-center justify-center group-hover:scale-105 transition-transform"
                >
                  <i class="pi pi-id-card"></i>
                </div>
                <div>
                  <div class="font-bold">Roles de Usuario</div>
                  <div class="text-[11px] text-surface-400 font-normal">
                    Administrar permisos por rol
                  </div>
                </div>
              </RouterLink>

              <RouterLink
                to="/admin/routes"
                class="p-3.5 rounded-lg border border-surface-200 hover:border-primary-400 hover:bg-primary-50/30 transition-all text-xs font-semibold text-surface-800 flex items-center gap-3 no-underline group"
              >
                <div
                  class="w-8 h-8 rounded-lg bg-primary-100 text-primary-700 flex items-center justify-center group-hover:scale-105 transition-transform"
                >
                  <i class="pi pi-sitemap"></i>
                </div>
                <div>
                  <div class="font-bold">Rutas y Menús</div>
                  <div class="text-[11px] text-surface-400 font-normal">
                    Configurar árbol de navegación
                  </div>
                </div>
              </RouterLink>

              <RouterLink
                to="/catalogs/countries"
                class="p-3.5 rounded-lg border border-surface-200 hover:border-primary-400 hover:bg-primary-50/30 transition-all text-xs font-semibold text-surface-800 flex items-center gap-3 no-underline group"
              >
                <div
                  class="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center group-hover:scale-105 transition-transform"
                >
                  <i class="pi pi-globe"></i>
                </div>
                <div>
                  <div class="font-bold">Países y Regiones</div>
                  <div class="text-[11px] text-surface-400 font-normal">
                    Catálogo de división geográfica
                  </div>
                </div>
              </RouterLink>

              <RouterLink
                to="/catalogs/document-types"
                class="p-3.5 rounded-lg border border-surface-200 hover:border-primary-400 hover:bg-primary-50/30 transition-all text-xs font-semibold text-surface-800 flex items-center gap-3 no-underline group"
              >
                <div
                  class="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center group-hover:scale-105 transition-transform"
                >
                  <i class="pi pi-file"></i>
                </div>
                <div>
                  <div class="font-bold">Tipos de Documento</div>
                  <div class="text-[11px] text-surface-400 font-normal">
                    Formatos de identificación
                  </div>
                </div>
              </RouterLink>

              <RouterLink
                to="/admin/permissions"
                class="p-3.5 rounded-lg border border-surface-200 hover:border-primary-400 hover:bg-primary-50/30 transition-all text-xs font-semibold text-surface-800 flex items-center gap-3 no-underline group"
              >
                <div
                  class="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center group-hover:scale-105 transition-transform"
                >
                  <i class="pi pi-key"></i>
                </div>
                <div>
                  <div class="font-bold">Permisos del Sistema</div>
                  <div class="text-[11px] text-surface-400 font-normal">
                    Acciones de API y vistas
                  </div>
                </div>
              </RouterLink>

              <RouterLink
                to="/test-view"
                class="p-3.5 rounded-lg border border-surface-200 hover:border-primary-400 hover:bg-primary-50/30 transition-all text-xs font-semibold text-surface-800 flex items-center gap-3 no-underline group"
              >
                <div
                  class="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center group-hover:scale-105 transition-transform"
                >
                  <i class="pi pi-sparkles"></i>
                </div>
                <div>
                  <div class="font-bold">Galería UI (PrimeVue 5)</div>
                  <div class="text-[11px] text-surface-400 font-normal">
                    Todos los componentes globales
                  </div>
                </div>
              </RouterLink>
            </div>
          </div>

          <!-- Columna Derecha: Resumen de Arquitectura (5 cols) -->
          <div
            class="lg:col-span-5 p-6 bg-white rounded-xl border border-surface-200 shadow-xs space-y-4"
          >
            <div class="flex items-center justify-between">
              <h2 class="text-base font-bold text-surface-900">
                Estado del Frontend
              </h2>
              <span
                class="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800"
              >
                Operativo
              </span>
            </div>

            <div class="space-y-3 pt-1 text-xs">
              <div
                class="flex items-center justify-between p-3 rounded-lg bg-surface-50 border border-surface-200"
              >
                <span class="text-surface-600">TypeScript Estricto</span>
                <span
                  class="font-bold text-emerald-700 flex items-center gap-1"
                >
                  <i class="pi pi-check text-[10px]"></i> Cero `any`
                </span>
              </div>

              <div
                class="flex items-center justify-between p-3 rounded-lg bg-surface-50 border border-surface-200"
              >
                <span class="text-surface-600">TanStack Vue Query</span>
                <span class="font-bold text-surface-800">v5 (skipLoader)</span>
              </div>

              <div
                class="flex items-center justify-between p-3 rounded-lg bg-surface-50 border border-surface-200"
              >
                <span class="text-surface-600">Validación de Formularios</span>
                <span class="font-bold text-surface-800"
                  >Vee-Validate + Yup</span
                >
              </div>

              <div
                class="flex items-center justify-between p-3 rounded-lg bg-surface-50 border border-surface-200"
              >
                <span class="text-surface-600">UI Kit Base</span>
                <span class="font-bold text-surface-800"
                  >PrimeVue 5 + Tailwind 4</span
                >
              </div>

              <div
                class="flex items-center justify-between p-3 rounded-lg bg-surface-50 border border-surface-200"
              >
                <span class="text-surface-600">Skills de Agente</span>
                <span class="font-bold text-surface-800"
                  >7 Habilidades activas</span
                >
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { RouterLink } from 'vue-router';
import { Button } from 'primevue';

import AppTitle from '@/core/components/AppTitle.vue';
import AppSkeleton from '@/core/components/AppSkeleton.vue';
import { useAuthStore } from '@/core/store/useAuthStore';

const authStore = useAuthStore();
const isLoading = ref(false);

const userName = computed(() => {
  return authStore.userInfo?.user_name || 'Administrador';
});
</script>

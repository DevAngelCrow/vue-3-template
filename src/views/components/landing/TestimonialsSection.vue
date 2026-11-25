<template>
  <section
    id="testimonials-section"
    class="py-16 lg:py-24 bg-white border-b border-surface-200 scroll-mt-18"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      <!-- Encabezado Editorial -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end">
        <div class="lg:col-span-7 space-y-2">
          <div
            class="text-xs font-mono uppercase tracking-widest text-primary-700 font-bold"
          >
            03 / Casos de Uso &amp; Patrones
          </div>
          <h2 class="text-2xl sm:text-3xl font-bold text-surface-900">
            Soluciones empresariales construibles sobre la plantilla
          </h2>
        </div>
        <div class="lg:col-span-5">
          <p class="text-sm text-surface-600 leading-relaxed">
            Desde portales públicos protegidos con Turnstile hasta backoffices
            auditados con permisos jerárquicos y almacenamiento híbrido.
          </p>
        </div>
      </div>

      <!-- Tarjetas de Casos de Uso Reutilizables -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <div
          v-for="item in useCases"
          :key="item.code"
          class="p-6 rounded-xl bg-surface-50 border border-surface-200 hover:border-surface-300 transition-all flex flex-col justify-between gap-5"
        >
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <span
                class="w-9 h-9 rounded-lg bg-white border border-surface-200 text-primary-800 flex items-center justify-center text-sm"
              >
                <i :class="item.icon"></i>
              </span>
              <span
                class="text-[11px] font-mono text-surface-500 font-semibold uppercase"
              >
                {{ item.tag }}
              </span>
            </div>

            <h3 class="text-base font-bold text-surface-900">
              {{ item.name }}
            </h3>

            <p class="text-xs text-surface-600 leading-relaxed">
              {{ item.description }}
            </p>
          </div>

          <div class="pt-3 border-t border-surface-200/80 space-y-3">
            <div class="text-[11px] text-surface-500">
              <strong class="text-surface-700">Patrones clave:</strong>
              {{ item.recommended }}
            </div>

            <Button
              type="button"
              variant="link"
              class="!p-0 !text-xs !font-bold !text-primary-800 hover:!text-primary-950"
              :label="`Configurar para ${item.shortLabel}`"
              icon="pi pi-arrow-right"
              icon-pos="right"
              @click="selectUseCaseTopic(item.topicValue)"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { Button } from 'primevue';

import { useLandingInquiryStore } from '@/core/store/useLandingInquiryStore';

import { scrollToLandingSection } from './landing.starter.data';

const inquiryStore = useLandingInquiryStore();

const useCases = [
  {
    code: 'SAAS-B2B',
    name: 'Plataforma SaaS B2B',
    shortLabel: 'SaaS B2B',
    topicValue: 'SaaS B2B Multi-módulo',
    tag: 'Multi-Módulo',
    icon: 'pi pi-building',
    description:
      'Menús dinámicos N-niveles filtrados por rol, navegación rápida con Cmd/Ctrl+K y arquitectura modular desacoplada.',
    recommended:
      'Menú recursivo N-niveles, caché Redis O(1) y guardias fail-closed en rutas.',
  },
  {
    code: 'ERP-OPS',
    name: 'ERP y Operaciones Internas',
    shortLabel: 'ERP Operativo',
    topicValue: 'ERP & Gestión Operativa',
    tag: 'Alta Concurrencia',
    icon: 'pi pi-database',
    description:
      'Flujos transaccionales seguros con numeración consecutiva anual, validaciones en tiempo real y tablas skeletonizadas.',
    recommended:
      'AfterCommitPort, SequenceGeneratorService, AppDataTable y AppSkeleton.',
  },
  {
    code: 'PUBLIC-PORTAL',
    name: 'Portal Público + Backoffice',
    shortLabel: 'Portal Público',
    topicValue: 'Portal Público + Backoffice',
    tag: 'Captación Segura',
    icon: 'pi pi-globe',
    description:
      'Landing conectada a endpoints @Public(), máscaras telefónicas dinámicas por país y verificación Cloudflare Turnstile.',
    recommended:
      'usePublicGeoCatalogs, useTurnstile, scrollToFirstError y skipGlobalAlert.',
  },
  {
    code: 'AUDIT-SEC',
    name: 'Backoffice Auditado y RBAC',
    shortLabel: 'Seguridad IAM',
    topicValue: 'Auditoría & Seguridad IAM',
    tag: 'Gobernanza',
    icon: 'pi pi-shield',
    description:
      'Control estricto de permisos, encabezados de seguridad Helmet, resolución confiable de IP real detrás de proxies y soft-delete.',
    recommended:
      'TRUST_PROXY, cookies HttpOnly, @Permissions y logs estructurados.',
  },
  {
    code: 'DOCS-S3',
    name: 'Gestor Documental Híbrido',
    shortLabel: 'Storage & PDF',
    topicValue: 'Gestor Documental S3 / PDF',
    tag: 'Archivos Binarios',
    icon: 'pi pi-file-pdf',
    description:
      'Carga y lectura en buffer compatible con almacenamiento local o AWS S3, verificación de firma PDF y visores modales.',
    recommended:
      'StorageService getFileBuffer, validación %PDF y AppDocumentVisor.',
  },
  {
    code: 'ENTERPRISE-SUITE',
    name: 'Arquitectura Fullstack Unificada',
    shortLabel: 'Fullstack Base',
    topicValue: 'Arquitectura Fullstack',
    tag: 'Plantilla Base',
    icon: 'pi pi-compass',
    description:
      'Base lista para cualquier dominio combinando Vue 3.5, PrimeVue 5, NestJS hexagonal y contratos estrictos sin any.',
    recommended:
      'Sincronización Vee-Validate + Pinia, AppTab animado y pruebas arquitectura.',
  },
];

const selectUseCaseTopic = (topicValue: string) => {
  inquiryStore.draft.topic = topicValue;
  scrollToLandingSection('cta-section');
};
</script>

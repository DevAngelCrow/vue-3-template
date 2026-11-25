<template>
  <section
    id="faq-section"
    class="py-16 lg:py-24 bg-white border-b border-surface-200 scroll-mt-18"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        <!-- Columna Izquierda: Título y Nota (5 cols) -->
        <div class="lg:col-span-5 space-y-4">
          <div
            class="text-xs font-mono uppercase tracking-widest text-primary-700 font-bold"
          >
            05 / Preguntas Frecuentes
          </div>
          <h2 class="text-2xl sm:text-3xl font-bold text-surface-900">
            Decisiones clave de la plantilla fullstack
          </h2>
          <p class="text-sm text-surface-600 leading-relaxed">
            Conoce cómo operan la jerarquía de componentes, los catálogos
            públicos, la protección Turnstile y el respaldo offline en la
            landing inicial.
          </p>
        </div>

        <!-- Columna Derecha: Acordeón PrimeVue 5 (7 cols) -->
        <div class="lg:col-span-7">
          <Accordion value="0">
            <AccordionPanel
              v-for="(item, idx) in faqs"
              :key="item.question"
              :value="String(idx)"
              class="!mb-3 !rounded-xl !border !border-surface-200 !bg-white overflow-hidden shadow-xs"
            >
              <AccordionHeader
                class="!py-4 !px-5 !text-sm !font-bold !text-surface-900 hover:!bg-surface-50"
              >
                {{ item.question }}
              </AccordionHeader>
              <AccordionContent
                class="!px-5 !pb-4 !pt-1 !text-xs sm:!text-sm !text-surface-600 leading-relaxed !border-t !border-surface-100"
              >
                {{ item.answer }}
              </AccordionContent>
            </AccordionPanel>
          </Accordion>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import Accordion from 'primevue/accordion';
import AccordionContent from 'primevue/accordioncontent';
import AccordionHeader from 'primevue/accordionheader';
import AccordionPanel from 'primevue/accordionpanel';

const faqs = [
  {
    question:
      '¿Cómo funcionan los catálogos públicos si el backend no está encendido?',
    answer:
      'El composable usePublicGeoCatalogs realiza peticiones con skipGlobalAlert: true y retry: false hacia /catalogs/countries/public y /catalogs/geographic-divisions/public. Si la API está en línea, los selectores cargan dinámicamente con caché de 30 minutos; si está apagada, no dispara alertas fantasma y el formulario sigue operando.',
  },
  {
    question:
      '¿Es obligatorio configurar Cloudflare Turnstile en desarrollo local?',
    answer:
      'No. Turnstile es completamente opt-in. Mientras VITE_CLOUDFLARE_TURNSTILE_SITE_KEY en el cliente y CLOUDFLARE_TURNSTILE_SECRET_KEY en el servidor permanezcan vacíos, el widget y la verificación estricta permanecen desactivados para no frenar el desarrollo local.',
  },
  {
    question: '¿Cómo adapta el formulario la máscara telefónica según el país?',
    answer:
      'Al seleccionar un país en AppSelect, la aplicación lee country.phone_mask y country.phone_code desde el catálogo. Cuando existe máscara configurada renderiza AppInputMask con validación dinámica; en caso contrario cae de forma transparente a AppInputText.',
  },
  {
    question:
      '¿Por qué la plantilla prohíbe any, as forzados y elementos HTML interactivos nativos?',
    answer:
      'La jerarquía de 3 niveles (1° App* > 2° PrimeVue > 3° HTML nativo) junto con el tipado estricto garantizan consistencia visual con tokens semánticos, accesibilidad ARIA unificada y compatibilidad total con vue-tsc y oxlint.',
  },
];
</script>

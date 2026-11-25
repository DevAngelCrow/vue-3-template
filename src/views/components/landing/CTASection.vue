<template>
  <section
    id="cta-section"
    class="py-16 lg:py-24 bg-surface-50 border-b border-surface-200 scroll-mt-18"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      <!-- Encabezado Editorial -->
      <div class="space-y-2">
        <div
          class="text-xs font-mono uppercase tracking-widest text-primary-700 font-bold"
        >
          06 / Contacto &amp; Formulario de Referencia
        </div>
        <h2 class="text-2xl sm:text-3xl font-bold text-surface-900">
          Prueba el flujo completo de captura y validación pública
        </h2>
        <p class="text-sm text-surface-600 max-w-2xl">
          Esta sección integra Vee-Validate, Pinia, catálogos geográficos
          <code class="font-mono text-xs text-primary-800">@Public()</code>,
          máscara telefónica dinámica por país, Cloudflare Turnstile opt-in y
          desplazamiento al primer error.
        </p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <!-- Columna Izquierda: Canales & Estado de Integración (5 cols) -->
        <div class="lg:col-span-5 space-y-4">
          <div
            class="bg-primary-950 text-white rounded-xl p-6 sm:p-7 border border-primary-900 space-y-6"
          >
            <div class="border-b border-white/10 pb-4">
              <span
                class="text-[11px] font-mono uppercase tracking-wider text-primary-300 block"
              >
                Canales Configurables
              </span>
              <h3 class="text-lg font-bold text-white mt-0.5">
                Información de Contacto Base
              </h3>
              <p class="text-xs text-surface-300 mt-1">
                Personaliza estos datos desde
                <code class="font-mono text-[11px] text-primary-300"
                  >landing.config.ts</code
                >.
              </p>
            </div>

            <div class="space-y-4">
              <div class="flex items-start gap-3.5">
                <div
                  class="w-9 h-9 rounded-lg bg-white/10 border border-white/15 text-primary-300 flex items-center justify-center shrink-0 mt-0.5"
                >
                  <i class="pi pi-whatsapp text-base"></i>
                </div>
                <div>
                  <div
                    class="text-[11px] font-mono uppercase tracking-wider text-surface-400"
                  >
                    Teléfono &amp; Mensajería Directa
                  </div>
                  <div class="text-sm font-bold text-white mt-0.5">
                    {{ contactInfo.whatsappDisplay }}
                  </div>
                  <div class="text-xs text-surface-300">
                    Fijo: {{ contactInfo.phoneDisplay }}
                  </div>
                </div>
              </div>

              <div class="flex items-start gap-3.5">
                <div
                  class="w-9 h-9 rounded-lg bg-white/10 border border-white/15 text-primary-300 flex items-center justify-center shrink-0 mt-0.5"
                >
                  <i class="pi pi-envelope text-sm"></i>
                </div>
                <div>
                  <div
                    class="text-[11px] font-mono uppercase tracking-wider text-surface-400"
                  >
                    Correo Electrónico
                  </div>
                  <div class="text-sm font-bold text-white mt-0.5 break-all">
                    {{ contactInfo.email }}
                  </div>
                </div>
              </div>

              <div class="flex items-start gap-3.5">
                <div
                  class="w-9 h-9 rounded-lg bg-white/10 border border-white/15 text-primary-300 flex items-center justify-center shrink-0 mt-0.5"
                >
                  <i class="pi pi-map-marker text-sm"></i>
                </div>
                <div>
                  <div
                    class="text-[11px] font-mono uppercase tracking-wider text-surface-400"
                  >
                    Ubicación de Referencia
                  </div>
                  <div class="text-sm font-bold text-white mt-0.5">
                    {{ contactInfo.addressLine1 }} ·
                    {{ contactInfo.addressLine2 }}
                  </div>
                  <div class="text-xs text-surface-300 mt-0.5">
                    {{ contactInfo.coverageArea }}
                  </div>
                </div>
              </div>

              <div class="flex items-start gap-3.5">
                <div
                  class="w-9 h-9 rounded-lg bg-white/10 border border-white/15 text-primary-300 flex items-center justify-center shrink-0 mt-0.5"
                >
                  <i class="pi pi-clock text-sm"></i>
                </div>
                <div>
                  <div
                    class="text-[11px] font-mono uppercase tracking-wider text-surface-400"
                  >
                    Horarios de Atención
                  </div>
                  <div class="text-xs text-surface-200 mt-0.5">
                    {{ contactInfo.scheduleWeekdays }}
                  </div>
                  <div class="text-xs text-surface-300">
                    {{ contactInfo.scheduleWeekend }}
                  </div>
                </div>
              </div>
            </div>

            <!-- Estado de Integraciones Técnicas en Vivo -->
            <div class="pt-4 border-t border-white/10 space-y-2.5 text-xs">
              <div
                class="text-[11px] font-mono uppercase tracking-wider text-surface-400"
              >
                Estado de Integración Pública
              </div>

              <div class="flex items-center justify-between text-surface-200">
                <span>Catálogos geográficos @Public()</span>
                <span
                  class="inline-flex items-center gap-1.5 font-mono text-[11px]"
                  :class="
                    hasCountryOptions ? 'text-success-300' : 'text-surface-300'
                  "
                >
                  <span
                    class="w-2 h-2 rounded-full"
                    :class="
                      hasCountryOptions ? 'bg-success-400' : 'bg-surface-400'
                    "
                  ></span>
                  {{ hasCountryOptions ? 'Conectado' : 'Modo offline' }}
                </span>
              </div>

              <div class="flex items-center justify-between text-surface-200">
                <span>Cloudflare Turnstile</span>
                <span
                  class="font-mono text-[11px]"
                  :class="
                    hasTurnstileSiteKey
                      ? 'text-primary-300'
                      : 'text-surface-300'
                  "
                >
                  {{ hasTurnstileSiteKey ? 'Activo (opt-in)' : 'Desactivado' }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Columna Derecha: Formulario Validado + Selección Pinia (7 cols) -->
        <div class="lg:col-span-7 space-y-6">
          <div
            ref="formContainerRef"
            class="bg-white rounded-xl p-6 sm:p-8 border border-surface-200 shadow-2xs space-y-6"
          >
            <!-- Resumen de Capacidades Seleccionadas -->
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <span
                  class="text-xs font-mono uppercase tracking-wider text-primary-800 font-bold"
                >
                  Capacidades Incluidas desde el Explorador
                </span>
                <Button
                  v-if="selectedModules.length > 0"
                  type="button"
                  variant="link"
                  severity="danger"
                  size="small"
                  label="Limpiar lista"
                  class="!text-xs !p-0 font-medium"
                  @click="inquiryStore.clearModules()"
                />
              </div>

              <div
                v-if="selectedModules.length === 0"
                class="p-4 rounded-lg bg-surface-50 border border-dashed border-surface-300 text-xs text-surface-600 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <span>
                  Opcional: selecciona módulos en el explorador superior para
                  adjuntarlos a tu resumen.
                </span>
                <Button
                  type="button"
                  size="small"
                  label="Ver Capacidades"
                  class="font-semibold !text-xs shrink-0"
                  @click="scrollToLandingSection('pricing-section')"
                />
              </div>

              <div
                v-else
                class="flex flex-wrap items-center gap-2 p-3 rounded-lg bg-surface-50 border border-surface-200"
              >
                <AppChip
                  v-for="mod in selectedModules"
                  :key="mod.id"
                  :label="`${mod.code} · ${mod.name}`"
                  severity="primary"
                  size="small"
                  removable
                  @remove="inquiryStore.removeModule(mod.id)"
                />
              </div>
            </div>

            <!-- Campos del Formulario -->
            <div class="space-y-4">
              <span
                class="text-xs font-mono uppercase tracking-wider text-surface-500 block font-semibold"
              >
                1. Identificación del Solicitante
              </span>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <AppInputText
                    v-model="firstName"
                    v-bind="firstNameAttrs"
                    label="Nombre *"
                    placeholder="Ej. Andrea"
                    prepend-inner-icon="pi pi-user"
                    :error-messages="errors.firstName"
                    fluid
                  />
                </div>

                <div>
                  <AppInputText
                    v-model="lastName"
                    v-bind="lastNameAttrs"
                    label="Apellidos *"
                    placeholder="Ej. Méndez"
                    prepend-inner-icon="pi pi-user"
                    :error-messages="errors.lastName"
                    fluid
                  />
                </div>

                <div class="sm:col-span-2">
                  <AppInputText
                    v-model="companyName"
                    v-bind="companyNameAttrs"
                    label="Empresa u Organización (opcional)"
                    placeholder="Ej. Tecnología Global S.A."
                    prepend-inner-icon="pi pi-building"
                    :error-messages="errors.companyName"
                    fluid
                  />
                </div>
              </div>

              <span
                class="text-xs font-mono uppercase tracking-wider text-surface-500 block font-semibold pt-2"
              >
                2. Contacto y Ubicación Dinámica
              </span>

              <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <AppSelect
                    v-model="idCountry"
                    v-bind="idCountryAttrs"
                    :options="countryOptions"
                    option-label="name"
                    option-value="id"
                    :label="hasCountryOptions ? 'País *' : 'País (opcional)'"
                    placeholder="Catálogo vía API"
                    filter
                    :disabled="!hasCountryOptions"
                    :error-messages="errors.idCountry"
                    fluid
                    @hide="onSelectHide('idCountry')"
                  />
                </div>

                <div>
                  <AppInputMask
                    v-if="activeCountryMask"
                    v-model="phone"
                    v-bind="phoneAttrs"
                    :mask="activeCountryMask"
                    :prefix="activeCountryPhoneCode"
                    :placeholder="activeCountryMask.replace(/9/g, '0')"
                    :auto-clear="false"
                    label="Teléfono *"
                    :error-messages="errors.phone"
                    fluid
                  />
                  <AppInputText
                    v-else
                    v-model="phone"
                    v-bind="phoneAttrs"
                    label="Teléfono *"
                    placeholder="+503 7000-0000"
                    prepend-inner-icon="pi pi-phone"
                    :error-messages="errors.phone"
                    fluid
                  />
                </div>

                <div>
                  <AppInputText
                    v-model="email"
                    v-bind="emailAttrs"
                    type="email"
                    label="Correo Electrónico *"
                    placeholder="nombre@empresa.com"
                    prepend-inner-icon="pi pi-envelope"
                    :error-messages="errors.email"
                    fluid
                  />
                </div>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <AppSelect
                    v-model="idGeographicDivision"
                    v-bind="idGeographicDivisionAttrs"
                    :options="divisionOptions"
                    option-label="name"
                    option-value="id"
                    :label="
                      hasDivisionOptions
                        ? 'Departamento / Estado *'
                        : 'Departamento / Estado'
                    "
                    filter
                    :disabled="!idCountry || !hasDivisionOptions"
                    placeholder="Selecciona división"
                    :error-messages="errors.idGeographicDivision"
                    fluid
                    @hide="onSelectHide('idGeographicDivision')"
                  />
                </div>

                <div>
                  <AppSelect
                    v-model="topic"
                    v-bind="topicAttrs"
                    :options="LANDING_TOPIC_OPTIONS"
                    option-label="name"
                    option-value="name"
                    label="Enfoque del Proyecto"
                    filter
                    :error-messages="errors.topic"
                    fluid
                    @hide="onSelectHide('topic')"
                  />
                </div>

                <div>
                  <AppDatePicker
                    v-model="targetDate"
                    v-bind="targetDateAttrs"
                    label="Fecha tentativa de inicio"
                    :min-date="minTargetDate"
                    show-button-bar
                    :error-messages="errors.targetDate"
                    fluid
                  />
                </div>

                <div class="flex items-center pt-1">
                  <AppCheckBox
                    v-model="draft.requiresOnboarding"
                    label="Requiero acompañamiento técnico"
                  />
                </div>

                <div class="sm:col-span-2">
                  <AppInputTextArea
                    v-model="notes"
                    v-bind="notesAttrs"
                    label="Notas o requerimientos adicionales"
                    placeholder="Describe alcance esperado, integraciones o volumen estimado..."
                    :rows="2"
                    :error-messages="errors.notes"
                    fluid
                  />
                </div>

                <!-- Consentimiento Legal + InfoLegalModal -->
                <div class="sm:col-span-2 pt-3 border-t border-surface-200/80">
                  <div class="flex items-start gap-2.5">
                    <Checkbox
                      v-model="acceptTermsField"
                      v-bind="acceptTermsAttrs"
                      binary
                      input-id="acceptLandingTermsCheckbox"
                      :invalid="Boolean(errors.acceptTerms)"
                      class="mt-0.5"
                    />
                    <label
                      for="acceptLandingTermsCheckbox"
                      class="text-xs text-surface-700 leading-snug cursor-pointer select-none"
                    >
                      He leído y acepto los
                      <Button
                        type="button"
                        variant="link"
                        label="Términos y Condiciones"
                        class="!p-0 !inline !align-baseline !text-xs !underline !font-semibold !text-primary-700 hover:!text-primary-950"
                        @click.prevent.stop="openLegalModal('terms')"
                      />
                      y la
                      <Button
                        type="button"
                        variant="link"
                        label="Política de Privacidad"
                        class="!p-0 !inline !align-baseline !text-xs !underline !font-semibold !text-primary-700 hover:!text-primary-950"
                        @click.prevent.stop="openLegalModal('privacy')"
                      />
                      para gestionar esta consulta.
                      <AppChip
                        :label="`v${LANDING_DEMO_TERMS_DOC.version}`"
                        severity="secondary"
                        size="small"
                        class="ml-1.5 align-middle font-mono !text-[10px]"
                      />
                    </label>
                  </div>
                  <small
                    v-if="errors.acceptTerms"
                    class="text-danger-600 text-[11px] block mt-1 font-medium"
                  >
                    {{ errors.acceptTerms }}
                  </small>
                </div>

                <!-- Contenedor Cloudflare Turnstile opt-in -->
                <div
                  v-if="hasTurnstileSiteKey"
                  class="sm:col-span-2 pt-1 flex justify-start"
                >
                  <div ref="turnstileContainerRef" class="min-h-[65px]"></div>
                </div>

                <div
                  v-else
                  class="sm:col-span-2 p-3 rounded-lg bg-info-50 border border-info-200 text-[11px] text-info-950 leading-relaxed flex items-start gap-2"
                >
                  <i
                    class="pi pi-info-circle text-xs text-info-700 mt-0.5 shrink-0"
                  ></i>
                  <span>
                    <strong>Modo Demo Turnstile:</strong> configura
                    <code class="font-mono"
                      >VITE_CLOUDFLARE_TURNSTILE_SITE_KEY</code
                    >
                    en tu archivo <code class="font-mono">.env</code> para
                    habilitar el widget anti-bot de Cloudflare.
                  </span>
                </div>
              </div>
            </div>

            <!-- Botones de Acción -->
            <div
              class="pt-4 border-t border-surface-200 flex flex-wrap items-center gap-3"
            >
              <Button
                type="button"
                severity="primary"
                :icon="copied ? 'pi pi-check' : 'pi pi-copy'"
                :label="
                  copied ? '¡Resumen Copiado!' : 'Generar y Copiar Resumen'
                "
                class="font-bold !text-xs !py-3 !px-5 shadow-sm"
                :loading="isSubmitting"
                @click="handleSubmit('copy')"
              />

              <Button
                type="button"
                variant="outlined"
                severity="secondary"
                icon="pi pi-envelope"
                label="Preparar Correo"
                class="font-semibold !text-xs !py-3 !px-4"
                :loading="isSubmitting"
                @click="handleSubmit('email')"
              />

              <Button
                type="button"
                variant="text"
                severity="secondary"
                icon="pi pi-refresh"
                label="Reiniciar"
                class="font-semibold !text-xs !py-3 !px-3"
                @click="handleReset"
              />
            </div>

            <!-- Referencia generada en sesión -->
            <div
              v-if="lastReferenceCode"
              class="rounded-lg bg-surface-50 border border-surface-200 px-3.5 py-2.5 flex flex-wrap items-center justify-between gap-2 text-xs text-surface-700"
            >
              <div class="flex items-center gap-2 min-w-0">
                <i
                  class="pi pi-bookmark-fill text-primary-700 text-xs shrink-0"
                ></i>
                <span>
                  Referencia activa:
                  <strong class="font-mono text-primary-900">
                    #{{ lastReferenceCode }}
                  </strong>
                </span>
              </div>
              <span class="text-surface-500 text-[11px]">
                Sincronizado con useLandingInquiryStore
              </span>
            </div>

            <!-- Mensaje de Feedback -->
            <div
              v-if="feedbackMessage"
              :class="[
                'text-xs font-medium rounded-lg px-4 py-3 flex items-start gap-2.5',
                feedbackType === 'error'
                  ? 'text-danger-800 bg-danger-50 border border-danger-200'
                  : feedbackType === 'warn'
                    ? 'text-warn-900 bg-warn-50 border border-warn-300'
                    : 'text-success-800 bg-success-50 border border-success-200',
              ]"
            >
              <i
                :class="[
                  feedbackType === 'error'
                    ? 'pi pi-exclamation-triangle text-danger-600'
                    : feedbackType === 'warn'
                      ? 'pi pi-exclamation-triangle text-warn-700'
                      : 'pi pi-check-circle text-success-600',
                  'mt-0.5 shrink-0',
                ]"
              ></i>
              <span>{{ feedbackMessage }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <InfoLegalModal
      v-model:visible="isLegalModalVisible"
      :initial-tab="legalModalInitialTab"
      :terms-document="LANDING_DEMO_TERMS_DOC"
      :privacy-document="LANDING_DEMO_PRIVACY_DOC"
    />
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { Button, Checkbox } from 'primevue';

import { usePublicGeoCatalogs } from '@/core/composables/usePublicGeoCatalogs';
import { useTurnstile } from '@/core/composables/useTurnstile';
import { useLandingInquiryStore } from '@/core/store/useLandingInquiryStore';
import { FormatDateToISO } from '@/core/utils/dates';
import { scrollToFirstError } from '@/core/utils/formScroll';

import InfoLegalModal from './InfoLegalModal.vue';
import { LANDING_CONTACT_INFO } from './landing.config';
import {
  LANDING_DEMO_PRIVACY_DOC,
  LANDING_DEMO_TERMS_DOC,
  LANDING_TOPIC_OPTIONS,
  scrollToLandingSection,
} from './landing.starter.data';
import { useLandingInquiryForm } from './useLandingInquiryForm';

const contactInfo = LANDING_CONTACT_INFO;
const inquiryStore = useLandingInquiryStore();
const {
  selectedModules,
  draft,
  acceptTerms,
  lastReferenceCode,
  lastSubmittedSignature,
} = storeToRefs(inquiryStore);

const selectedCountryId = computed(() => draft.value.idCountry || undefined);
const { countriesQuery, divisionsQuery } =
  usePublicGeoCatalogs(selectedCountryId);

const countryOptions = computed(() => countriesQuery.data.value ?? []);
const divisionOptions = computed(() => divisionsQuery.data.value ?? []);
const hasCountryOptions = computed(() => countryOptions.value.length > 0);
const hasDivisionOptions = computed(() => divisionOptions.value.length > 0);

const activeCountry = computed(() =>
  countryOptions.value.find(c => c.id === draft.value.idCountry),
);
const activeCountryIso2 = computed(() => activeCountry.value?.iso2);
const activeCountryPhoneCode = computed(
  () => activeCountry.value?.phone_code || '+1',
);
const activeCountryMask = computed<string | null>(() => {
  if (activeCountry.value?.phone_mask) return activeCountry.value.phone_mask;
  if (activeCountry.value?.iso2 === 'US') return '(999) 999-9999';
  return null;
});

const {
  errors,
  minTargetDate,
  firstName,
  firstNameAttrs,
  lastName,
  lastNameAttrs,
  companyName,
  companyNameAttrs,
  idCountry,
  idCountryAttrs,
  phone,
  phoneAttrs,
  email,
  emailAttrs,
  idGeographicDivision,
  idGeographicDivisionAttrs,
  topic,
  topicAttrs,
  targetDate,
  targetDateAttrs,
  notes,
  notesAttrs,
  acceptTermsField,
  acceptTermsAttrs,
  onSelectHide,
  validateBeforeSubmit,
  resetFormValidation,
} = useLandingInquiryForm({
  draft,
  acceptTerms,
  activeCountryIso2,
  activeCountryMask,
  hasCountryOptions,
  hasDivisionOptions,
});

const {
  hasSiteKey: hasTurnstileSiteKey,
  token: turnstileToken,
  containerRef: turnstileContainerRef,
  reset: resetTurnstile,
} = useTurnstile();

const formContainerRef = ref<HTMLElement | null>(null);
const copied = ref(false);
const isSubmitting = ref(false);
const feedbackMessage = ref('');
const feedbackType = ref<'success' | 'warn' | 'error'>('success');

const isLegalModalVisible = ref(false);
const legalModalInitialTab = ref<'privacy' | 'terms'>('privacy');

const openLegalModal = (tab: 'privacy' | 'terms') => {
  legalModalInitialTab.value = tab;
  isLegalModalVisible.value = true;
};

const buildSummaryText = (refCode: string): string => {
  const fullName = `${draft.value.firstName} ${draft.value.lastName}`.trim();
  const formattedDate =
    FormatDateToISO(draft.value.targetDate) || 'Por definir';
  const modulesText =
    selectedModules.value.length > 0
      ? selectedModules.value
          .map(item => `- [${item.code}] ${item.name} (${item.category})`)
          .join('\n')
      : '- Evaluación general de la plantilla';

  return [
    `Referencia: #${refCode}`,
    `Solicitante: ${fullName}`,
    draft.value.companyName.trim()
      ? `Organización: ${draft.value.companyName.trim()}`
      : null,
    `Teléfono: ${draft.value.phone.trim()}`,
    `Correo: ${draft.value.email.trim()}`,
    `Enfoque: ${draft.value.topic}`,
    `Fecha tentativa: ${formattedDate}`,
    `Acompañamiento técnico: ${draft.value.requiresOnboarding ? 'Sí' : 'No'}`,
    '',
    'Capacidades seleccionadas:',
    modulesText,
    draft.value.notes.trim() ? `\nNotas:\n${draft.value.notes.trim()}` : null,
  ]
    .filter((line): line is string => line !== null)
    .join('\n');
};

const handleSubmit = async (mode: 'copy' | 'email') => {
  feedbackMessage.value = '';
  const summary = await validateBeforeSubmit();

  if (!summary.valid) {
    feedbackType.value = 'error';
    feedbackMessage.value = summary.onlyTermsError
      ? 'Debes aceptar los Términos y Condiciones y la Política de Privacidad para continuar.'
      : summary.firstErrorMessage
        ? `Revisa los campos marcados en rojo: ${summary.firstErrorMessage}`
        : 'Revisa los campos obligatorios antes de continuar.';
    await scrollToFirstError(formContainerRef.value);
    return;
  }

  const currentSignature = inquiryStore.buildPayloadSignature();
  const needsReference =
    !lastReferenceCode.value ||
    currentSignature !== lastSubmittedSignature.value;

  if (needsReference && hasTurnstileSiteKey.value && !turnstileToken.value) {
    feedbackType.value = 'warn';
    feedbackMessage.value =
      'Completa la verificación de seguridad de Cloudflare Turnstile antes de enviar.';
    return;
  }

  isSubmitting.value = true;
  try {
    const refCode = needsReference
      ? `TPL-${Date.now().toString(36).toUpperCase()}`
      : lastReferenceCode.value;

    if (needsReference) {
      inquiryStore.markSubmitted(refCode, currentSignature);
    }

    const bodyText = buildSummaryText(refCode);

    if (mode === 'copy') {
      await navigator.clipboard.writeText(bodyText);
      copied.value = true;
      feedbackType.value = 'success';
      feedbackMessage.value = `Resumen #${refCode} validado y copiado al portapapeles.`;
      setTimeout(() => {
        copied.value = false;
      }, 3500);
    } else {
      const fullName =
        `${draft.value.firstName} ${draft.value.lastName}`.trim();
      const subject = encodeURIComponent(
        `Consulta Técnica #${refCode} - ${fullName}`,
      );
      const body = encodeURIComponent(bodyText);
      window.open(
        `mailto:${contactInfo.email}?subject=${subject}&body=${body}`,
        '_blank',
      );
      feedbackType.value = 'success';
      feedbackMessage.value = `Resumen #${refCode} preparado en tu cliente de correo.`;
    }
  } catch {
    feedbackType.value = 'error';
    feedbackMessage.value =
      'No se pudo completar la acción de salida. Verifica los permisos del portapapeles.';
  } finally {
    isSubmitting.value = false;
    if (needsReference && hasTurnstileSiteKey.value) {
      resetTurnstile();
    }
  }
};

const handleReset = () => {
  inquiryStore.resetDraft();
  resetFormValidation();
  feedbackMessage.value = '';
  copied.value = false;
  resetTurnstile();
};
</script>

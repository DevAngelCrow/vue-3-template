<template>
  <div class="min-h-screen flex flex-col bg-surface-50 text-surface-900">
    <HeaderSection />
    <main class="flex-1">
      <HeroSection />
      <FeaturesBenefitsSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <PricingSection />
      <FAQSection />
      <CTASection />
    </main>
    <FooterSection />

    <!-- Botón flotante oficial AppFloatButton para contacto -->
    <AppFloatButton
      icon="pi pi-whatsapp"
      class="!bg-emerald-600 hover:!bg-emerald-500 shadow-xl"
      title="Contactar por WhatsApp"
      @event-click="openWhatsApp"
    />
  </div>
</template>

<script setup lang="ts">
import CTASection from './components/landing/CTASection.vue';
import FAQSection from './components/landing/FAQSection.vue';
import FeaturesBenefitsSection from './components/landing/FeaturesBenefitsSection.vue';
import FooterSection from './components/landing/FooterSection.vue';
import HeaderSection from './components/landing/HeaderSection.vue';
import HeroSection from './components/landing/HeroSection.vue';
import HowItWorksSection from './components/landing/HowItWorksSection.vue';
import { LANDING_CONTACT_INFO } from './components/landing/landing.config';
import PricingSection from './components/landing/PricingSection.vue';
import TestimonialsSection from './components/landing/TestimonialsSection.vue';

defineOptions({
  name: 'LandingView',
});

const openWhatsApp = () => {
  const cleanPhone = LANDING_CONTACT_INFO.whatsappNumber.replace(/\D/g, '');
  if (!cleanPhone) return;
  const text = encodeURIComponent(
    `¡Hola ${LANDING_CONTACT_INFO.businessName}! Me gustaría consultar sobre la plataforma empresarial.`,
  );
  window.open(`https://wa.me/${cleanPhone}?text=${text}`, '_blank');
};
</script>

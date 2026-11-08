<template>
  <header
    id="header-section"
    class="sticky top-0 z-50 w-full bg-primary-950/95 backdrop-blur-md border-b border-white/10 text-white"
  >
    <div
      class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4"
    >
      <!-- Identidad de Marca -->
      <a
        href="#hero-section"
        class="flex items-center gap-3 group no-underline select-none"
        @click.prevent="scrollToSection('hero-section')"
      >
        <div
          class="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center shadow-md shadow-primary-500/20 ring-1 ring-white/20 shrink-0"
        >
          <i class="pi pi-compass text-white text-lg"></i>
        </div>
        <div class="flex flex-col">
          <span
            class="text-base font-bold tracking-tight text-white leading-none"
          >
            {{ contactInfo.businessName }}
          </span>
          <span
            class="text-[11px] text-primary-200/75 font-medium tracking-wider uppercase mt-1"
          >
            Enterprise Suite
          </span>
        </div>
      </a>

      <!-- Navegación Desktop -->
      <nav class="hidden lg:flex items-center gap-7 text-sm font-medium">
        <a
          v-for="item in navItems"
          :key="item.target"
          :href="`#${item.target}`"
          class="text-surface-200 hover:text-primary-300 transition-colors py-1 cursor-pointer"
          @click.prevent="scrollToSection(item.target)"
        >
          {{ item.label }}
        </a>
      </nav>

      <!-- Acciones Derecha -->
      <div class="flex items-center gap-2.5">
        <Button
          v-if="hasActiveSession"
          type="button"
          label="Panel de Control"
          icon="pi pi-th-large"
          size="small"
          class="!bg-primary-600 hover:!bg-primary-500 !text-white !text-xs !font-semibold !rounded-lg !px-3.5 !py-2"
          @click="goToDashboard"
        />
        <template v-else>
          <Button
            type="button"
            label="Iniciar Sesión"
            icon="pi pi-sign-in"
            outlined
            size="small"
            class="!text-xs !font-semibold !rounded-lg !px-3.5 !py-2 !border-white/20 !text-white hover:!bg-white/10"
            @click="goToLogin"
          />
          <Button
            type="button"
            label="Registrarse"
            icon="pi pi-user-plus"
            size="small"
            class="hidden sm:inline-flex !bg-primary-600 hover:!bg-primary-500 !text-white !text-xs !font-semibold !rounded-lg !px-3.5 !py-2 border-none"
            @click="goToSignUp"
          />
        </template>

        <!-- Botón Menú Móvil -->
        <Button
          type="button"
          text
          rounded
          class="lg:hidden !p-2 !text-surface-200 hover:!text-white hover:!bg-white/10"
          :icon="mobileMenuOpen ? 'pi pi-times' : 'pi pi-bars'"
          aria-label="Abrir menú"
          @click="mobileMenuOpen = !mobileMenuOpen"
        />
      </div>
    </div>

    <!-- Menú Desplegable Móvil -->
    <div
      v-if="mobileMenuOpen"
      class="lg:hidden border-t border-white/10 bg-primary-950 px-4 pt-3 pb-5 space-y-2"
    >
      <a
        v-for="item in navItems"
        :key="item.target"
        :href="`#${item.target}`"
        class="block px-3 py-2 rounded-lg text-sm font-medium text-surface-200 hover:bg-white/10 hover:text-primary-300 transition-colors cursor-pointer"
        @click.prevent="handleMobileNav(item.target)"
      >
        {{ item.label }}
      </a>
      <div
        class="pt-3 border-t border-white/10 flex items-center justify-between px-3 gap-2"
      >
        <Button
          type="button"
          label="Iniciar Sesión"
          outlined
          size="small"
          class="w-full !text-xs !border-white/20 !text-white"
          @click="goToLogin"
        />
        <Button
          type="button"
          label="Registrarse"
          size="small"
          class="w-full !text-xs !bg-primary-600 !text-white border-none"
          @click="goToSignUp"
        />
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { Button } from 'primevue';

import { useAuthStore } from '@/core/store/useAuthStore';

import { LANDING_CONTACT_INFO } from './landing.config';

const router = useRouter();
const authStore = useAuthStore();
const contactInfo = LANDING_CONTACT_INFO;

const mobileMenuOpen = ref(false);
const hasActiveSession = computed(() => authStore.validSession());

const navItems = [
  { label: 'Características', target: 'features-section' },
  { label: 'Cómo Funciona', target: 'how-it-works-section' },
  { label: 'Testimonios', target: 'testimonials-section' },
  { label: 'Planes', target: 'pricing-section' },
  { label: 'Preguntas', target: 'faq-section' },
  { label: 'Contacto', target: 'cta-section' },
];

const scrollToSection = (targetId: string) => {
  const el = document.getElementById(targetId);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
};

const handleMobileNav = (target: string) => {
  mobileMenuOpen.value = false;
  scrollToSection(target);
};

const goToLogin = () => {
  router.push('/login');
};

const goToSignUp = () => {
  router.push('/sign-up');
};

const goToDashboard = () => {
  router.push('/dashboard');
};
</script>

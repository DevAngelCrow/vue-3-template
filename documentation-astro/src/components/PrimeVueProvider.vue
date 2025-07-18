<script setup lang="ts">
import PrimeVue from 'primevue/config';
import { getCurrentInstance } from 'vue';
import type { AppContext, App } from 'vue';
import { definePreset } from '@primeuix/themes';
import ToastService from 'primevue/toastservice';
import Aura from '@primeuix/themes/aura';

const appContext: AppContext | undefined = getCurrentInstance()?.appContext;

const Noir = definePreset(Aura, {
  semantic: {
    primary: {
      50: '{zinc.50}',

      100: '{zinc.100}',

      200: '{zinc.200}',

      300: '{zinc.300}',

      400: '{zinc.400}',

      500: '{zinc.500}',

      600: '{zinc.600}',

      700: '{zinc.700}',

      800: '{zinc.800}',

      900: '{zinc.900}',

      950: '{zinc.950}',
    },

    colorScheme: {
      light: {
        primary: {
          color: '{zinc.950}',

          inverseColor: '#ffffff',

          hoverColor: '{zinc.900}',

          activeColor: '{zinc.800}',
        },

        highlight: {
          background: '{zinc.950}',

          focusBackground: '{zinc.700}',

          color: '#ffffff',

          focusColor: '#ffffff',
        },
      },

      dark: {
        primary: {
          color: '{zinc.50}',

          inverseColor: '{zinc.950}',

          hoverColor: '{zinc.100}',

          activeColor: '{zinc.200}',
        },

        highlight: {
          background: 'rgba(250, 250, 250, .16)',

          focusBackground: 'rgba(250, 250, 250, .24)',

          color: 'rgba(255,255,255,.87)',

          focusColor: 'rgba(255,255,255,.87)',
        },
      },
    },
  },
});

if (appContext && appContext.app) {
  const appInstance: App = appContext.app;

  if (!appInstance.config.globalProperties.$primevue) {
    appInstance.use(PrimeVue, {
      theme: {
        preset: Noir,

        options: {
          cssLayer: { name: 'primevue', order: 'theme, base, primevue' },
        },
      },
    });

    appInstance.use(ToastService);
  }
}
</script>

<template><slot></slot></template>

<style is:global></style>

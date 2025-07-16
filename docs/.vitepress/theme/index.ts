import DefaultTheme from 'vitepress/theme';
import './style.css';
import type { Theme } from 'vitepress';
import PrimeVue from 'primevue/config';
import { definePreset } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';
import ToastService from 'primevue/toastservice';

//import "@primeuix/themes/aura/theme.css";
import { registerDirectives } from '../../../src/core/directives/index';
// import {
//   globalFunctions,
//   GlobalFunctions,
// } from '../../../core/utils/globalFunctions';
import { registerGlobalComponents } from './registerGlobalComponents';

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
export default {
  ...DefaultTheme,
  enhanceApp({ app }) {
    app.use(PrimeVue, {
      theme: {
        preset: Noir,
        options: {
          cssLayer: { name: 'primevue', order: 'theme, base, primevue' },
        },
      },
    });

    // const entries = Object.entries(globalFunctions) as [
    //   keyof GlobalFunctions,
    //   GlobalFunctions[keyof GlobalFunctions],
    // ][];
    // entries.forEach(([key, fn]) => {
    //   (app.config.globalProperties as Record<string, unknown>)[`${key}`] = fn;
    // });

    registerGlobalComponents(app);
    registerDirectives(app);
    app.use(ToastService);
  },
} satisfies Theme;

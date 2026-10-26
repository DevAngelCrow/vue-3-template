import { definePreset } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';
export const CustomTheme = definePreset(Aura, {
  semantic: {
    primary: {
      50: '{emerald.50}',
      100: '{emerald.100}',
      200: '{emerald.200}',
      300: '{emerald.300}',
      400: '{emerald.400}',
      500: '{emerald.500}',
      600: '{emerald.600}',
      700: '{emerald.700}',
      800: '{emerald.800}',
      900: '{emerald.900}',
      950: '{emerald.950}',
    },
    surface: {
      50: '{slate.50}',
      100: '{slate.100}',
      200: '{slate.200}',
      300: '{slate.300}',
      400: '{slate.400}',
      500: '{slate.500}',
      600: '{slate.600}',
      700: '{slate.700}',
      800: '{slate.800}',
      900: '{slate.900}',
      950: '{slate.950}',
    },
    // Tokens semánticos propios: expuestos como --p-success-* y --p-danger-*
    // y mapeados a utilidades Tailwind en style.css (bg-danger-600, text-success-700...)
    success: {
      50: '{green.50}',
      100: '{green.100}',
      200: '{green.200}',
      300: '{green.300}',
      400: '{green.400}',
      500: '{green.500}',
      600: '{green.600}',
      700: '{green.700}',
      800: '{green.800}',
      900: '{green.900}',
      950: '{green.950}',
    },
    danger: {
      50: '{red.50}',
      100: '{red.100}',
      200: '{red.200}',
      300: '{red.300}',
      400: '{red.400}',
      500: '{red.500}',
      600: '{red.600}',
      700: '{red.700}',
      800: '{red.800}',
      900: '{red.900}',
      950: '{red.950}',
    },
    colorScheme: {
      light: {
        primary: {
          color: '{emerald.950}',
          inverseColor: '#FFFFFF',
          hoverColor: '{emerald.900}',
          //activeColor: '{emerald.800}',
          //outlined: '{emerald.950}'
        },
        // highlight: {
        //   background: '{emerald.700}',
        //   focusBackground: '{emerald.600}',
        //   color: '#FFFFFF',
        //   focusColor: '#FFFFFF',
        // },
      },
    },
  },
  components: {
    button: {
      colorScheme: {
        light: {
          outlined: {
            primary: {
              color: '{emerald.950}',
              borderColor: '{emerald.950}',
            },
          },
        },
      },
    },
    dialog: {
      root: {
        borderColor: '{emerald.950}',
      },
    },
  },
});

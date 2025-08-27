import { definePreset } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';
export const CustomTheme = definePreset(Aura, {
  semantic: {
    primary: {
      50: '{stone.50}',
      100: '{stone.100}',
      200: '{stone.200}',
      300: '{stone.300}',
      400: '{stone.400}',
      500: '{stone.500}',
      600: '{stone.600}',
      700: '{stone.700}',
      800: '{stone.800}',
      900: '{stone.900}',
      950: '{stone.950}',
    },
    colorScheme: {
      light: {
        primary: {
          color: '{stone.600}',
          inverseColor: '#FFFFFF',
          hoverColor: '{stone.400}',
          activeColor: '{stone.500}',
        },
        highlight: {
          background: '{stone.600}',
          focusBackground: '{stone.500}',
          color: '#FFFFFF',
          focusColor: '#FFFFFF',
        },
        text: {
          color: '{stone.600}',
        },
      },
    },
    surface: {
      50: '{sky.50}',
      100: '{sky.100}',
      200: '{sky.200}',
      300: '{sky.300}',
      400: '{sky.400}',
      500: '{sky.500}',
      600: '{sky.600}',
      700: '{sky.700}',
      800: '{sky.800}',
      900: '{sky.900}',
      950: '{sky.950}',
    },
  },
  components: {
    button: {
      colorScheme: {
        light: {
          root: {
            primary: {
              background: '{sky.900}',
              hoverBackground: '{sky.600}',
              borderColor: '{sky.900}',
              hoverBorderColor: '{sky.900}',
              activeBackground: '{sky.950}',
            },
          },
          outlined: {
            primary: {
              color: '{sky.900}',
              hoverBackground: '{sky.50}',
              borderColor: '{sky.900}',
            },
          },
        },
      },
    },
  },
});

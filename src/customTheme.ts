import { definePreset } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';
export const CustomTheme = definePreset(Aura, {
  semantic: {
    primary: {
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
    surface: {
      50: '{blue.50}',
      100: '{blue.100}',
      200: '{blue.200}',
      300: '{blue.300}',
      400: '{blue.400}',
      500: '{blue.500}',
      600: '{blue.600}',
      700: '{blue.700}',
      800: '{blue.800}',
      900: '{blue.900}',
      950: '{blue.950}',
    },
    colorScheme: {
      light: {
        primary: {
          color: '{sky.950}',
          inverseColor: '#FFFFFF',
          hoverColor: '{sky.900}',
          //activeColor: '{sky.800}',
          //outlined: '{sky.950}'
        },
        // highlight: {
        //   background: '{sky.700}',
        //   focusBackground: '{sky.600}',
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
              color: '{sky.950}',
              borderColor: '{sky.950}',
            },
          },
        },
      },
    },
    dialog: {
      root: {
        borderColor: '{sky.950}',
      },
    },
  },
});

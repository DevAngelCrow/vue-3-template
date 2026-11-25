import {
  definePreset,
  type PaletteDesignToken,
  type Preset,
} from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';
import type { AuraBaseDesignTokens } from '@primeuix/themes/aura/base';

type CustomAuraDesignTokens = Omit<AuraBaseDesignTokens, 'semantic'> & {
  semantic?: AuraBaseDesignTokens['semantic'] & {
    success?: PaletteDesignToken;
    danger?: PaletteDesignToken;
    warn?: PaletteDesignToken;
    info?: PaletteDesignToken;
  };
};

export const CustomTheme = definePreset<Preset<CustomAuraDesignTokens>>(Aura, {
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
    // Tokens semánticos propios: expuestos como --p-success-*, --p-danger-*, --p-warn-*, --p-info-*
    // y mapeados a utilidades Tailwind en style.css (bg-danger-600, text-success-700, bg-warn-50...)
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
    warn: {
      50: '{amber.50}',
      100: '{amber.100}',
      200: '{amber.200}',
      300: '{amber.300}',
      400: '{amber.400}',
      500: '{amber.500}',
      600: '{amber.600}',
      700: '{amber.700}',
      800: '{amber.800}',
      900: '{amber.900}',
      950: '{amber.950}',
    },
    info: {
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
    colorScheme: {
      light: {
        primary: {
          color: '{primary.600}',
          contrastColor: '#FFFFFF',
          hoverColor: '{primary.700}',
          activeColor: '{primary.800}',
        },
      },
    },
  },
  components: {
    button: {
      colorScheme: {
        light: {
          outlined: {
            primary: {
              color: '{primary.600}',
              borderColor: '{primary.600}',
            },
          },
        },
      },
    },
    dialog: {
      root: {
        borderColor: '{surface.200}',
      },
    },
    tabs: {
      tablist: {
        background: '{surface.0}',
        borderColor: '{surface.200}',
      },
      tab: {
        color: '{surface.500}',
        hoverColor: '{primary.600}',
        hoverBackground: '{surface.50}',
        activeColor: '{primary.600}',
        activeBorderColor: '{primary.600}',
      },
      activeBar: {
        background: '{primary.600}',
      },
      tabpanel: {
        background: '{surface.0}',
        color: '{surface.700}',
      },
    },
  },
});

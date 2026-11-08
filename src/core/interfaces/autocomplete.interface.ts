import type {
  AutoCompleteChangeEvent,
  AutoCompleteCompleteEvent,
  AutoCompleteDropdownClickEvent,
  AutoCompleteOptionSelectEvent,
  AutoCompleteOptionUnselectEvent,
} from 'primevue';

/**
 * Propiedades del componente AppAutocomplete
 */
export interface AppAutocompleteProps {
  /** Valor del modelo enlazado con v-model */
  modelValue?: string | number | Record<string, unknown> | unknown[] | null;

  /** Clases CSS adicionales para el contenedor raíz */
  class?: string;

  /** Clases CSS para el elemento input interno de PrimeVue */
  inputClass?: string | Record<string, boolean> | string[];

  /** Texto de marcador de posición (placeholder) */
  placeholder?: string;

  /** Severidad visual del mensaje de error */
  severity?: 'error' | 'secondary' | 'info' | 'success' | 'warn' | 'contrast';

  /** Tamaño visual del componente Message */
  size?: 'small' | 'large';

  /** Tamaño visual del input de PrimeVue */
  inputSize?: 'small' | 'large';

  /** Variante visual del componente Message */
  variant?: 'simple' | 'outlined';

  /** Variante visual de la etiqueta flotante (FloatLabel) */
  labelVariant?: 'on' | 'in' | 'over';

  /** Variante visual del AutoComplete de PrimeVue ('outlined' | 'filled') */
  inputVariant?: 'outlined' | 'filled';

  /** Mensaje o mensajes de error asociados a la validación */
  errorMessages?: string | string[];

  /** Icono al final del input (clase PrimeIcons) */
  appendIcon?: string;

  /** Icono al inicio dentro del input (clase PrimeIcons) */
  prependInnerIcon?: string;

  /** Etiqueta descriptiva del campo */
  label?: string;

  /** ID del contenedor o input */
  id?: string;

  /** ID específico del input interno */
  inputId?: string;

  /** Lista de sugerencias para el desplegable (canónico en PrimeVue) */
  suggestions?: unknown[];

  /** Alias legacy en singular de sugerencias para mantener retrocompatibilidad */
  suggestion?: unknown[];

  /** Propiedad o función para obtener la etiqueta visible de un objeto sugerido */
  optionLabel?: string | ((data: unknown) => string);

  /** Habilita la selección de múltiples elementos en modo chips */
  multiple?: boolean;

  /** Deshabilita la edición manual manteniendo la accesibilidad de lectura */
  readonly?: boolean;

  /** Deshabilita la interacción completa con el campo */
  disabled?: boolean;

  /** Muestra botón dropdown para desplegar las opciones */
  dropdown?: boolean;

  /** Permite que el componente se adapte al 100% del ancho del contenedor */
  fluid?: boolean;

  /** Ancho mínimo personalizado para el componente (por defecto 'min-w-40' cuando dropdown=true) */
  minWidth?: string;

  /** Indica explícitamente si el componente se encuentra en estado inválido */
  invalid?: boolean;

  /** Configuración de autocompletado nativo del navegador */
  autocomplete?: string;

  /** Tipo de campo nativo (mantenido por retrocompatibilidad) */
  type?: string;
}

/**
 * Eventos emitidos por AppAutocomplete
 */
export interface AppAutocompleteEmits {
  (e: 'update:modelValue', value: AppAutocompleteProps['modelValue']): void;
  (e: 'complete', event: AutoCompleteCompleteEvent): void;
  (e: 'change', event: AutoCompleteChangeEvent): void;
  (e: 'option-select', event: AutoCompleteOptionSelectEvent): void;
  (e: 'option-unselect', event: AutoCompleteOptionUnselectEvent): void;
  (e: 'item-select', event: AutoCompleteOptionSelectEvent): void;
  (e: 'item-unselect', event: AutoCompleteOptionUnselectEvent): void;
  (e: 'dropdown-click', event: AutoCompleteDropdownClickEvent): void;
  (e: 'click-end-icon', event?: MouseEvent | KeyboardEvent): void;
  (e: 'focus', event: Event): void;
  (e: 'blur', event: Event): void;
  (e: 'clear'): void;
}

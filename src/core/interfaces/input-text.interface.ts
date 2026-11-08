/**
 * Propiedades del componente AppInputText
 */
export interface AppInputTextProps {
  /** Valor del modelo enlazado mediante v-model */
  modelValue?: string | number | null;

  /** Clases CSS adicionales para el contenedor raíz */
  class?: string;

  /** Clases CSS para el elemento input interno de PrimeVue */
  inputClass?: string | Record<string, boolean> | string[];

  /** Tipo de campo de entrada HTML (text, password, email, etc.) */
  type?: string;

  /** Texto guía o placeholder */
  placeholder?: string;

  /** Severidad visual del componente Message de error */
  severity?: 'error' | 'secondary' | 'info' | 'success' | 'warn' | 'contrast';

  /** Tamaño visual del componente Message */
  size?: 'small' | 'large';

  /** Tamaño visual del InputText de PrimeVue ('small' | 'large') */
  inputSize?: 'small' | 'large';

  /** Variante visual del componente Message */
  variant?: 'simple' | 'outlined';

  /** Posición / variante de la etiqueta flotante (FloatLabel) */
  labelVariant?: 'on' | 'in' | 'over';

  /** Variante visual del InputText de PrimeVue ('outlined' | 'filled') */
  inputVariant?: 'outlined' | 'filled';

  /** Alias legacy de inputVariant para mantener retrocompatibilidad */
  inputVarian?: string;

  /** Mensaje o mensajes de error asociados a la validación */
  errorMessages?: string | string[];

  /** Icono al final del input (clase PrimeIcons) */
  appendIcon?: string;

  /** Icono al inicio dentro del input (clase PrimeIcons) */
  prependInnerIcon?: string;

  /** Configuración de autocompletado nativo del navegador */
  autocomplete?: string;

  /** Etiqueta descriptiva del campo */
  label?: string;

  /** ID del contenedor o input */
  id?: string;

  /** ID específico del input interno */
  inputId?: string;

  /** Modo de solo lectura: impide la edición manual pero mantiene accesibilidad */
  readonly?: boolean;

  /** Deshabilita la interacción completa con el campo */
  disabled?: boolean;

  /** Permite que el componente ocupe el 100% del ancho del contenedor */
  fluid?: boolean;

  /** Indica explícitamente si el campo se encuentra en estado de error */
  invalid?: boolean;
}

/**
 * Eventos emitidos por AppInputText
 */
export interface AppInputTextEmits {
  (e: 'update:modelValue', value: string): void;
  (e: 'click-end-icon', event?: MouseEvent | KeyboardEvent): void;
  (e: 'focus', event: Event): void;
  (e: 'blur', event: Event): void;
  (e: 'change', event: Event): void;
}

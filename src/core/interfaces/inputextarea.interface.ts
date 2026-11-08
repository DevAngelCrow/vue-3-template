/**
 * Propiedades del componente AppInputextArea
 */
export interface AppInputextAreaProps {
  /** Valor del modelo enlazado mediante v-model */
  modelValue?: string | null;

  /** Clases CSS adicionales para el contenedor raíz */
  class?: string;

  /** Texto guía o placeholder */
  placeholder?: string;

  /** Severidad visual del mensaje de error */
  severity?: 'error' | 'secondary' | 'info' | 'success' | 'warn' | 'contrast';

  /** Tamaño visual del componente Message */
  size?: 'small' | 'large';

  /** Variante visual del componente Message */
  variant?: 'simple' | 'outlined';

  /** Posición / variante de la etiqueta flotante (FloatLabel) */
  labelVariant?: 'on' | 'in' | 'over';

  /** Variante visual del Textarea de PrimeVue ('outlined' | 'filled') */
  inputVariant?: 'outlined' | 'filled';

  /** Mensaje o mensajes de error asociados a la validación */
  errorMessages?: string | string[];

  /** Configuración de autocompletado nativo del navegador */
  autocomplete?: string;

  /** Etiqueta descriptiva del campo */
  label?: string;

  /** ID del contenedor o input */
  id?: string;

  /** ID específico del textarea interno */
  inputId?: string;

  /** Número de filas visibles por defecto */
  rows?: number | string;

  /** Número de columnas visibles */
  cols?: number | string;

  /** Redimensiona automáticamente la altura según el contenido */
  autoResize?: boolean;

  /** Ocupa el 100% del ancho del contenedor */
  fluid?: boolean;

  /** Modo de solo lectura: impide la edición manual pero mantiene accesibilidad */
  readonly?: boolean;

  /** Deshabilita la interacción completa con el campo */
  disabled?: boolean;

  /** Marca explícitamente el estado inválido */
  invalid?: boolean;
}

/**
 * Eventos emitidos por AppInputextArea
 */
export interface AppInputextAreaEmits {
  (e: 'update:modelValue', value: string): void;
  (e: 'focus', event: Event): void;
  (e: 'blur', event: Event): void;
  (e: 'change', event: Event): void;
}

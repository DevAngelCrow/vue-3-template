import type {
  MultiSelectAllChangeEvent,
  MultiSelectChangeEvent,
  MultiSelectFilterEvent,
} from 'primevue';

/**
 * Propiedades del componente AppMultiSelect
 */
export interface AppMultiSelectProps {
  /** Valor del modelo enlazado mediante v-model (arreglo de valores seleccionados) */
  modelValue?: unknown[];

  /** Clases CSS adicionales para el contenedor raíz */
  class?: string;

  /** Opciones disponibles en el desplegable */
  options?: unknown[];

  /** Propiedad para obtener la etiqueta visible de cada opción */
  optionLabel?: string | ((data: unknown) => string);

  /** Propiedad para obtener el valor representativo de cada opción */
  optionValue?: string | ((data: unknown) => unknown);

  /** Propiedad para deshabilitar opciones individuales */
  optionDisabled?: string | ((data: unknown) => boolean);

  /** Propiedad para obtener la etiqueta de grupo */
  optionGroupLabel?: string | ((data: unknown) => string);

  /** Propiedad para obtener los hijos de cada grupo */
  optionGroupChildren?: string | ((data: unknown) => unknown[]);

  /** Texto guía o placeholder */
  placeholder?: string;

  /** Severidad visual del mensaje de error */
  severity?: 'error' | 'secondary' | 'info' | 'success' | 'warn' | 'contrast';

  /** Tamaño visual del componente Message */
  size?: 'small' | 'large';

  /** Tamaño visual del MultiSelect de PrimeVue */
  inputSize?: 'small' | 'large';

  /** Variante visual del componente Message */
  variant?: 'simple' | 'outlined';

  /** Posición / variante de la etiqueta flotante (FloatLabel) */
  labelVariant?: 'on' | 'in' | 'over';

  /** Variante visual del MultiSelect de PrimeVue ('outlined' | 'filled') */
  inputVariant?: 'outlined' | 'filled';

  /** Alias legacy de inputVariant para mantener retrocompatibilidad */
  inputVarian?: string;

  /** Mensaje o mensajes de error asociados a la validación */
  errorMessages?: string | string[];

  /** Icono al final del input (clase PrimeIcons) */
  appendIcon?: string;

  /** Icono al inicio dentro del input (clase PrimeIcons) */
  prependInnerIcon?: string;

  /** Bandera opcional de compatibilidad para mostrar iconos */
  showIcon?: boolean;

  /** Configuración de autocompletado nativo */
  autocomplete?: string;

  /** Etiqueta descriptiva del campo */
  label?: string;

  /** ID del contenedor o input */
  id?: string;

  /** ID específico del input interno */
  inputId?: string;

  /** Habilita el filtrado / buscador dentro del panel de opciones */
  filter?: boolean;

  /** Texto guía para el input de búsqueda del filtro */
  filterPlaceholder?: string;

  /** Modo de visualización de los elementos seleccionados ('comma' | 'chip') */
  display?: 'comma' | 'chip';

  /** Cantidad máxima de etiquetas seleccionadas visibles antes de mostrar resumen */
  maxSelectedLabels?: number;

  /** Plantilla para el texto de elementos seleccionados (ej: '{0} elementos seleccionados') */
  selectedItemsLabel?: string;

  /** Permite limpiar la selección */
  showClear?: boolean;

  /** Permite que el componente ocupe el 100% del ancho del contenedor */
  fluid?: boolean;

  /** Ancho mínimo personalizado para el componente (por defecto 'min-w-40') */
  minWidth?: string;

  /** Modo de solo lectura: impide la selección de opciones pero mantiene la accesibilidad */
  readonly?: boolean;

  /** Deshabilita la interacción completa con el campo */
  disabled?: boolean;

  /** Indica explícitamente si el campo se encuentra en estado de error */
  invalid?: boolean;

  /** Tipo de campo (mantenido por retrocompatibilidad) */
  type?: string;
}

/**
 * Eventos emitidos por AppMultiSelect
 */
export interface AppMultiSelectEmits {
  (e: 'update:modelValue', value: unknown[]): void;
  (e: 'change', event: MultiSelectChangeEvent): void;
  (e: 'filter', event: MultiSelectFilterEvent): void;
  (e: 'selectall-change', event: MultiSelectAllChangeEvent): void;
  (e: 'click-end-icon', event?: MouseEvent | KeyboardEvent): void;
  (e: 'focus', event: Event): void;
  (e: 'blur', event: Event): void;
  (e: 'before-show'): void;
  (e: 'before-hide'): void;
  (e: 'show'): void;
  (e: 'hide'): void;
}

import type { PrimeVueFile } from '@/types/PrimeVueFile';

/**
 * Propiedades del componente AppDragDropFile
 */
export interface AppDragDropFileProps {
  /** Permite la selección o arrastre de múltiples archivos */
  multiple?: boolean;

  /** Tipos MIME o extensiones aceptadas (ej: 'image/*', '.pdf,application/pdf') */
  accept?: string;

  /** Lista de archivos enlazados mediante v-model */
  modelValue?: PrimeVueFile[];

  /** Clases CSS adicionales para el contenedor raíz */
  class?: string;

  /** Mensaje o lista de mensajes de error de validación */
  errorMessages?: string | string[];

  /** Nivel de severidad para el componente Message de error */
  severity?: 'error' | 'secondary' | 'info' | 'success' | 'warn' | 'contrast';

  /** Tamaño visual del componente Message */
  size?: 'small' | 'large';

  /** Variante visual del componente Message */
  variant?: 'simple' | 'outlined';

  /** Tamaño máximo permitido por archivo en bytes (por defecto 1MB = 1048576) */
  maxSize?: number;

  /** Dimensiones máximas informativas o permitidas para imágenes (ej: '1920x1080') */
  maxDimensions?: string;

  /** Muestra la lista de formatos permitidos en el área vacía */
  showFormats?: boolean;

  /** Muestra el tamaño máximo permitido en el área vacía */
  showMaxSize?: boolean;

  /** Texto guía cuando no hay archivos seleccionados (reemplaza el texto por defecto) */
  emptyText?: string;

  /** Alias de texto guía / placeholder */
  placeholder?: string;

  /** Etiqueta descriptiva superior para el campo */
  label?: string;

  /** Nombre del campo (name attribute para formularios) */
  name?: string;

  /** Identificador HTML para el componente */
  id?: string;

  /** Identificador HTML específico para el input */
  inputId?: string;

  /** Deshabilita la interacción con el componente */
  disabled?: boolean;

  /** Modo de solo lectura: permite visualizar los archivos pero impide agregar o remover */
  readonly?: boolean;

  /** Indica explícitamente si el campo se encuentra en estado de error */
  invalid?: boolean;
}

/**
 * Eventos emitidos por AppDragDropFile
 */
export interface AppDragDropFileEmits {
  (e: 'update:modelValue', value: PrimeVueFile[]): void;
  (e: 'select', files: PrimeVueFile[]): void;
  (e: 'remove', file: PrimeVueFile, index: number): void;
  (e: 'clear'): void;
  (e: 'error', errorMessage: string): void;
}

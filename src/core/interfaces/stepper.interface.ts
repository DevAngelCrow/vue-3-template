/** Valor identificador de un paso */
export type AppStepperValue = string | number;

/**
 * Definición de un paso cuando se usa el arreglo `steps` de AppStepper
 */
export interface AppStepperItem {
  /** Identificador único del paso (valor del v-model) */
  value: AppStepperValue;

  /** Título visible en la cabecera */
  label: string;

  /** Subtítulo o resumen dinámico bajo el título */
  description?: string;

  /** Clase de ícono opcional en lugar del número (ej. 'pi pi-user') */
  icon?: string;

  /** Marca el paso como completado (círculo success con check) */
  completed?: boolean;

  /** Deshabilita la navegación por cabecera hacia este paso */
  disabled?: boolean;

  /** Marca el paso con estado de error (círculo e indicador danger) */
  invalid?: boolean;

  /** Texto de tooltip para la cabecera (ej. motivo por el que está bloqueado) */
  tooltip?: string;

  /** Oculta el paso cuando es false (por defecto true) */
  visible?: boolean;
}

/**
 * Propiedades del componente AppStepper (wrapper horizontal de PrimeVue Stepper)
 */
export interface AppStepperProps {
  /** Pasos a renderizar */
  steps: AppStepperItem[];

  /** Clases CSS adicionales para el contenedor raíz */
  class?: string;

  /**
   * Modo lineal nativo de PrimeVue (deshabilita el clic en todas las cabeceras
   * no activas). Por defecto `false` para permitir retroceder libremente y
   * controlar el avance mediante `step.disabled`.
   */
  linear?: boolean;
}

/** Evento emitido por AppStepper al cambiar de paso */
export interface AppStepperChangeEvent {
  /** Nuevo paso activo */
  value: AppStepperValue;

  /** Paso activo anterior */
  previousValue?: AppStepperValue;

  /** Definición del paso activo */
  step?: AppStepperItem;
}

/** Eventos emitidos por AppStepper (el v-model se declara con defineModel) */
export interface AppStepperEmits {
  change: [event: AppStepperChangeEvent];
}

/** Props entregadas a los slots de panel `#panel-<value>` y `#panel` */
export interface AppStepperPanelSlotProps {
  /** Paso asociado al panel */
  step: AppStepperItem;

  /** Índice 0-based dentro de los pasos visibles */
  index: number;

  /** Indica si este panel es el paso activo actualmente */
  active: boolean;

  /** Indica si es el primer paso visible */
  isFirst: boolean;

  /** Indica si es el último paso visible */
  isLast: boolean;

  /** Avanza al siguiente paso habilitado */
  next: () => boolean;

  /** Retrocede al paso anterior habilitado */
  prev: () => boolean;

  /** Navega a un paso específico por valor si está habilitado */
  goTo: (...args: [value: AppStepperValue]) => boolean;
}

/** Props entregadas a los slots de cabecera `#step-<value>` */
export interface AppStepperHeaderSlotProps {
  /** Paso asociado a la cabecera */
  step: AppStepperItem;

  /** Índice 0-based dentro de los pasos visibles */
  index: number;

  /** Indica si este paso está activo */
  active: boolean;
}

/** Tipo de función de slot para paneles de AppStepper */
export type AppStepperPanelSlot = (
  ...args: [props: AppStepperPanelSlotProps]
) => unknown;

/** Tipo de función de slot para cabeceras de AppStepper */
export type AppStepperHeaderSlot = (
  ...args: [props: AppStepperHeaderSlotProps]
) => unknown;

/** Métodos expuestos por AppStepper mediante ref */
export interface AppStepperExposed {
  /** Avanza al siguiente paso habilitado. Devuelve false si no es posible */
  next: () => boolean;

  /** Retrocede al paso anterior habilitado. Devuelve false si no es posible */
  prev: () => boolean;

  /** Activa un paso por valor. Devuelve false si no existe, está oculto o deshabilitado */
  goTo: (...args: [value: AppStepperValue]) => boolean;
}

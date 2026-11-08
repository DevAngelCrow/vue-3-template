/** Valor identificador de una pestaña */
export type AppTabValue = string | number;

/**
 * Definición de una pestaña cuando se usa el arreglo `tabs` de AppTab
 */
export interface AppTabItem {
  /** Identificador único de la pestaña (valor del v-model) */
  value: AppTabValue;

  /** Texto visible en la cabecera */
  label: string;

  /** Clase de ícono (ej. 'pi pi-user') */
  icon?: string;

  /** Deshabilita la pestaña */
  disabled?: boolean;

  /** Oculta la pestaña cuando es false (por defecto true). Útil para permisos */
  visible?: boolean;

  /** Contador o texto mostrado en un badge junto a la etiqueta */
  badge?: string | number;

  /** Marca la pestaña con estado de error (ícono en color danger) */
  invalid?: boolean;

  /** Texto de tooltip para la cabecera (ej. motivo por el que está deshabilitada) */
  tooltip?: string;

  /** Muestra un AppSkeleton en el panel de esta pestaña mientras carga */
  loading?: boolean;
}

/**
 * Propiedades del componente AppTab (wrapper de PrimeVue Tabs)
 */
export interface AppTabProps {
  /** Pestañas a renderizar. Si se omite, se usa el slot por defecto (modo PrimeVue) */
  tabs?: AppTabItem[];

  /** Clases CSS adicionales para el contenedor raíz */
  class?: string;

  /** Muestra flechas de navegación cuando las pestañas desbordan (móvil) */
  scrollable?: boolean;

  /** Renderiza el contenido de cada panel solo cuando se activa */
  lazy?: boolean;

  /**
   * Conserva el estado de los paneles ya visitados al cambiar de pestaña
   * (se renderizan una vez y luego se ocultan). Solo aplica en modo arreglo
   * y combinado con `lazy`.
   */
  keepAlive?: boolean;

  /**
   * Sincroniza la pestaña activa con la URL.
   * `true` usa el query param `tab`; un string usa ese nombre de parámetro.
   */
  syncQuery?: boolean | string;

  /** Muestra un AppSkeleton en el panel activo (aplica a todas las pestañas) */
  loading?: boolean;
}

/** Evento emitido por AppTab al cambiar de pestaña */
export interface AppTabChangeEvent {
  /** Nueva pestaña activa */
  value: AppTabValue;

  /** Pestaña activa anterior */
  previousValue?: AppTabValue;

  /** Definición de la pestaña activa (solo en modo arreglo) */
  tab?: AppTabItem;
}

/** Eventos emitidos por AppTab (el v-model se declara con defineModel) */
export interface AppTabEmits {
  change: [event: AppTabChangeEvent];
}

/** Métodos y estado expuestos por AppTab mediante ref */
export interface AppTabExposed {
  /** Activa una pestaña por valor. Devuelve false si no existe, está oculta o deshabilitada */
  activate: (...args: [value: AppTabValue]) => boolean;

  /** Activa la primera pestaña marcada como `invalid`. Devuelve false si no hay ninguna */
  activateFirstInvalid: () => boolean;
}

/** Props que AppTab entrega a los slots panel, panel-<value> y 	ab-<value> */
export interface AppTabSlotProps {
  /** Pestaña asociada al slot */
  tab: AppTabItem;
}

/** Firma de un slot de AppTab */
export type AppTabSlot = (...args: [slotProps: AppTabSlotProps]) => unknown;

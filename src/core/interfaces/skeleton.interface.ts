export type SkeletonVariant =
  | 'text'
  | 'title'
  | 'avatar'
  | 'button'
  | 'chip'
  | 'input'
  | 'card'
  | 'image'
  | 'actions'
  | 'custom';

export type SkeletonShape = 'rectangle' | 'circle';
export type SkeletonAnimation = 'wave' | 'none';

export interface AppSkeletonProps {
  /**
   * Estado de carga.
   * Si el componente tiene un slot por defecto (modo wrapper):
   * - true: Renderiza el skeleton.
   * - false: Renderiza el contenido del slot.
   * Si no tiene slot (modo directo):
   * - true: Renderiza el skeleton.
   * - false: No renderiza nada.
   * @default true
   */
  loading?: boolean;

  /**
   * Variante semántica visual predefinida.
   * @default 'text'
   */
  variant?: SkeletonVariant;

  /**
   * Forma del skeleton ('rectangle' o 'circle').
   * Sobrescribe la forma predeterminada de la variante.
   */
  shape?: SkeletonShape;

  /**
   * Tamaño uniforme (aplica simultáneamente a width y height en avatares o cuadrados).
   */
  size?: string;

  /**
   * Ancho del skeleton (ej: '100%', '8rem', '120px').
   */
  width?: string;

  /**
   * Alto del skeleton (ej: '1.25rem', '40px').
   */
  height?: string;

  /**
   * Radio de borde CSS (ej: '0.375rem', '9999px', '8px').
   */
  borderRadius?: string;

  /**
   * Tipo de animación del skeleton ('wave' o 'none').
   * @default 'wave'
   */
  animation?: SkeletonAnimation;

  /**
   * Número de repeticiones del elemento skeleton (ej: 3 líneas de texto).
   * @default 1
   */
  count?: number;

  /**
   * Clases CSS opcionales para el contenedor o elemento.
   */
  class?: string;
}

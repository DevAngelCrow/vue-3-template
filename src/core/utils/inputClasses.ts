/**
 * Determina si una clase contiene una definición explícita de ancho o flex sizing (w-*, flex-1, grow, etc.)
 */
export function hasCustomWidth(className?: string): boolean {
  if (!className) return false;
  return /(?:^|\s)(?:[a-z0-9_-]+:)*(w-\S+|flex-1|flex-auto|grow)(?:\s|$)/.test(
    className,
  );
}

/**
 * Determina si una clase contiene una definición explícita de ancho mínimo (min-w-*),
 * excluyendo min-w-0 que actúa como reset de flexbox.
 */
export function hasCustomMinWidth(className?: string): boolean {
  if (!className) return false;
  return /(?:^|\s)(?:[a-z0-9_-]+:)*min-w-(?!0\b)\S+(?:\s|$)/.test(className);
}

/**
 * Resuelve las clases base para el contenedor raíz de los componentes de entrada App*.
 * Estandariza un comportamiento responsive (mobile-first):
 * - Aplica w-full y min-w-0 por defecto para que llene el 100% de la celda/columna sin desbordar.
 * - Si el consumidor pasa una clase de ancho explícita (ej. w-36, w-auto, flex-1, grow), no impone w-full.
 * - Respeta clases de max-w-* (ej. max-w-[322px]) combinándolas con w-full.
 */
export function resolveInputRootClass(
  customClass?: string,
  extraClasses?: string[],
): string[] {
  const custom = customClass?.trim() || '';
  const hasWidth = hasCustomWidth(custom);
  return [
    'relative',
    'min-w-0',
    hasWidth ? '' : 'w-full',
    custom,
    ...(extraClasses || []),
  ].filter(Boolean);
}

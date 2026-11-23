export interface SanitizeInputOptions {
  /** Expresión regular con los caracteres a eliminar del texto */
  disallowPattern?: RegExp;
  /** Transformación de capitalización opcional */
  transformCase?: 'upper' | 'lower' | 'none';
  /** Reemplazo de separadores (p. ej. espacios o guiones bajos) antes de filtrar */
  replaceSeparator?: {
    pattern: RegExp;
    with: string;
  };
  /** Colapsa repeticiones consecutivas de un carácter separador (p. ej. '--' -> '-') */
  collapseSeparator?: string;
  /** Recorta espacios al inicio y final */
  trim?: boolean;
  /** Longitud máxima permitida */
  maxLength?: number;
}

export const INPUT_SANITIZE_PRESETS = {
  /** Texto general de búsqueda y formularios (letras con acentos, dígitos, espacios, @ y .) */
  alphanumericText: {
    disallowPattern: /[^a-zA-ZáÁéÉíÍóÓúÚñÑ@.0-9 ]/g,
  },
  /** Códigos/SKUs en mayúsculas con guiones medios (A-Z, 0-9, -) */
  codeDash: {
    transformCase: 'upper',
    replaceSeparator: { pattern: /[\s_]+/g, with: '-' },
    disallowPattern: /[^A-Z0-9-]/g,
    collapseSeparator: '-',
  },
  /** Códigos programáticos en MAYÚSCULAS con guion bajo (ej. DOCUMENT_PREFIX) */
  codeUnderscore: {
    transformCase: 'upper',
    replaceSeparator: { pattern: /[\s-]+/g, with: '_' },
    disallowPattern: /[^A-Z0-9_]/g,
    collapseSeparator: '_',
  },
  /** Solo letras mayúsculas y números sin espacios (ej. prefijos cortos DOC, INV) */
  alphanumericUpper: {
    transformCase: 'upper',
    disallowPattern: /[^A-Z0-9]/g,
  },
  /** Solo dígitos numéricos */
  digitsOnly: {
    disallowPattern: /[^0-9]/g,
  },
  /** Slug URL-safe en minúsculas con guiones medios */
  slug: {
    transformCase: 'lower',
    replaceSeparator: { pattern: /[\s_]+/g, with: '-' },
    disallowPattern: /[^a-z0-9-]/g,
    collapseSeparator: '-',
  },
} as const satisfies Record<string, SanitizeInputOptions>;

export type InputSanitizePreset = keyof typeof INPUT_SANITIZE_PRESETS;

const ensureGlobalRegex = (pattern: RegExp): RegExp => {
  const flags = pattern.flags.includes('g')
    ? pattern.flags
    : `${pattern.flags}g`;
  return new RegExp(pattern.source, flags);
};

const escapeRegexChar = (char: string): string =>
  char.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const resolveOptions = (
  config: InputSanitizePreset | RegExp | SanitizeInputOptions,
): SanitizeInputOptions => {
  if (typeof config === 'string') {
    return INPUT_SANITIZE_PRESETS[config];
  }
  if (config instanceof RegExp) {
    return { disallowPattern: config };
  }
  return config;
};

/**
 * Sanitizador genérico configurable para entradas de texto.
 * Acepta un preset predefinido, una `RegExp` de caracteres no permitidos
 * o un objeto `SanitizeInputOptions` con reglas compuestas.
 */
export const sanitizeInput = (
  value: string | null | undefined,
  config:
    | InputSanitizePreset
    | RegExp
    | SanitizeInputOptions = 'alphanumericText',
): string => {
  try {
    if (!value) {
      return '';
    }

    const options = resolveOptions(config);
    let result = value;

    if (options.trim) {
      result = result.trim();
    }

    if (options.transformCase === 'upper') {
      result = result.toUpperCase();
    } else if (options.transformCase === 'lower') {
      result = result.toLowerCase();
    }

    if (options.replaceSeparator) {
      result = result.replace(
        ensureGlobalRegex(options.replaceSeparator.pattern),
        options.replaceSeparator.with,
      );
    }

    if (options.disallowPattern) {
      result = result.replace(ensureGlobalRegex(options.disallowPattern), '');
    }

    if (options.collapseSeparator) {
      const escaped = escapeRegexChar(options.collapseSeparator);
      result = result.replace(
        new RegExp(`${escaped}+`, 'g'),
        options.collapseSeparator,
      );
    }

    if (
      typeof options.maxLength === 'number' &&
      options.maxLength >= 0 &&
      result.length > options.maxLength
    ) {
      result = result.slice(0, options.maxLength);
    }

    return result;
  } catch (error) {
    console.error(error);
    return '';
  }
};

/**
 * Helper retrocompatible para limpiar caracteres fuera de la expresión regular indicada.
 * @param value Es el texto a limpiar
 * @param regex Expresión regular con los caracteres a eliminar
 * @returns El texto sanitizado
 */
const sanitizedValueInput = (
  value: string,
  regex: RegExp = INPUT_SANITIZE_PRESETS.alphanumericText.disallowPattern,
): string => {
  return sanitizeInput(value, regex);
};

export { sanitizedValueInput };

import dayjs from 'dayjs';
import 'dayjs/locale/es';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isBetween from 'dayjs/plugin/isBetween';
import timezone from 'dayjs/plugin/timezone';

// Global configuration
dayjs.extend(timezone);
dayjs.locale('es');
dayjs.tz.setDefault('America/El_Salvador');

type DaysjsUnit =
  | 'year'
  | 'month'
  | 'week'
  | 'day'
  | 'hour'
  | 'minute'
  | 'second'
  | 'millisecond';

/**
 * Función para convertir una fecha/hora a un formato específico
 * @param {(string|Date|null|undefined)} value - Fecha a convertir
 * @param {string} formatOutput - Formato de salida
 * @returns {?string} Fecha convertida al formato especificado
 */
const FormatDate = (
  value: string | Date | null | undefined,
  formatOutput: string = 'DD/MM/YYYY',
): string | null => {
  if (value) {
    return dayjs(value).format(formatOutput);
  } else return null;
};

/**
 * Función para convertir una fecha/hora a formato ISO8601 (YYYY-MM-DD / YYYY-MM-DDTHH:mm:ss)
 * @param {(string|Date|null|undefined)} value - Fecha a convertir
 * @param {string} formatString - Formato de salida
 * @param {boolean} withTime - Si incluye hora
 * @returns {?string} Fecha convertida al formato especificado
 */
const FormatDateToISO = (
  value: string | Date | null | undefined,
  formatString: string = 'DD/MM/YYYY',
  withTime: boolean = false,
): string | null => {
  if (value) {
    const format = withTime ? 'YYYY-MM-DDTHH:mm:ss' : 'YYYY-MM-DD';
    if (value instanceof Date) {
      return isNaN(value.getTime()) ? null : dayjs(value).format(format);
    }
    dayjs.extend(customParseFormat);
    const parsed = dayjs(value, formatString);
    if (parsed.isValid()) {
      return parsed.format(format);
    }
    const fallback = dayjs(value);
    if (fallback.isValid()) {
      return fallback.format(format);
    }
    return null;
  } else return null;
};

/**
 * Función para convertir una fecha/hora (segun el formato o ISO fallback) a un objeto Date
 * @param {(string|Date|null|undefined)} value - Fecha/hora a convertir
 * @param {string} formatString - Formato de la fecha a convertir
 * @returns {?Date} Objeto Date con la fecha convertida
 */
const CreateDateFromFormat = (
  value: string | Date | null | undefined,
  formatString: string = 'DD/MM/YYYY',
): Date | null => {
  if (value) {
    if (value instanceof Date) {
      return isNaN(value.getTime()) ? null : value;
    }
    dayjs.extend(customParseFormat);
    const parsed = dayjs(value, formatString);
    if (parsed.isValid()) return parsed.toDate();
    const fallback = dayjs(value);
    if (fallback.isValid()) return fallback.toDate();
    return null;
  } else return null;
};

/**
 * Función para verificar si una fecha/hora es mayor a otra
 * @param {(string|Date)} firstDate - Fecha a comparar
 * @param {(string|Date)} secondDate - Fecha de referencia
 * @param {string} formatString - Formato de las fechas
 * @param {string} level - Nivel de comparación
 * @returns {?boolean} Booleano con el resultado de la comparación
 */
const IsDateAfter = (
  firstDate: string | Date,
  secondDate: string | Date,
  formatString: string = 'DD/MM/YYYY',
  level: DaysjsUnit = 'day',
) => {
  if (firstDate && secondDate) {
    dayjs.extend(customParseFormat);
    return dayjs(firstDate, formatString).isAfter(
      dayjs(secondDate, formatString),
      level,
    );
  } else return null;
};

/**
 * Función para verificar si una fecha/hora es igual a otra
 * @param {(string|Date)} firstDate - Fecha a comparar
 * @param {(string|Date)} secondDate - Fecha de referencia
 * @param {string} formatString - Formato de las fechas
 * @param {string} level - Nivel de comparación
 * @returns {?boolean} Booleano con el resultado de la comparación
 */
const IsDateSame = (
  firstDate: string | Date,
  secondDate: string | Date,
  formatString: string = 'DD/MM/YYYY',
  level: DaysjsUnit = 'day',
) => {
  if (firstDate && secondDate) {
    dayjs.extend(customParseFormat);
    return dayjs(firstDate, formatString).isSame(
      dayjs(secondDate, formatString),
      level,
    );
  } else return null;
};

/**
 * Verificar si una fecha/hora es igual o mayor a otra
 * @param {(string|Date)} firstDate - Fecha a comparar
 * @param {(string|Date)} secondDate - Fecha de referencia
 * @param {string} formatString - Formato de las fechas
 * @param {string} level - Nivel de comparación
 * @returns {?boolean} Booleano con el resultado de la comparación
 */
const IsDateSameOrAfter = (
  firstDate: string | Date,
  secondDate: string | Date,
  formatString: string = 'DD/MM/YYYY',
  level: DaysjsUnit = 'second',
) => {
  if (firstDate && secondDate) {
    dayjs.extend(customParseFormat);
    dayjs.extend(isSameOrAfter);
    return dayjs(firstDate, formatString).isSameOrAfter(
      dayjs(secondDate, formatString),
      level,
    );
  } else return null;
};

/**
 * Verificar si una fecha/hora está dentro del rango indicado
 * @param {(string|Date)} mainDate - Fecha a comparar
 * @param {(string|Date)} initialDate - Fecha inicial del rango
 * @param {(string|Date)} finalDate - Fecha final del rango
 * @param {string} formatString - Formato de las fechas
 * @param {string} level - Nivel de comparación
 * @param {string} inclusivity - Tipo de inclusividad ('[]', '[)', '(]', '()')
 * @returns {?boolean} Booleano con el resultado de la comparación
 */
const IsDateBetween = (
  mainDate: string | Date,
  initialDate: string | Date,
  finalDate: string | Date,
  formatString: string = 'DD/MM/YYYY',
  level: DaysjsUnit | null = null,
  inclusivity: '()' | '(]' | '[)' | '[]' = '[]', // Se incluyen las fechas de inicio y fin
): boolean | null => {
  if (mainDate && initialDate && finalDate) {
    dayjs.extend(customParseFormat);
    dayjs.extend(isBetween);

    const main = dayjs(mainDate, formatString);
    const start = dayjs(initialDate, formatString);
    const end = dayjs(finalDate, formatString);

    return main.isBetween(start, end, level ?? undefined, inclusivity);
  } else {
    return null;
  }
};

const getToday = (formatOutput: string = 'YYYY-MM-DDTHH:mm:ss'): string => {
  return dayjs().format(formatOutput);
};

export {
  FormatDate,
  FormatDateToISO,
  CreateDateFromFormat,
  IsDateAfter,
  IsDateSame,
  IsDateSameOrAfter,
  IsDateBetween,
  getToday,
};

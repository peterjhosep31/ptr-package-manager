/**
 * Enum con los caracteres permitidos para formatear fechas.
 * Proporciona una forma type-safe de referenciar los caracteres de formato.
 * 
 * @enum {string}
 */
export enum DateFormatChar {
    /** Año con 4 dígitos (ej: 2025) */
    YEAR = 'Y',
    /** Mes con 2 dígitos (01-12) */
    MONTH = 'm',
    /** Día con 2 dígitos (01-31) */
    DAY = 'd',
    /** Hora en formato 24h (00-23) */
    HOUR = 'H',
    /** Minutos (00-59) */
    MINUTE = 'i',
    /** Segundos (00-59) */
    SECOND = 's'
}

/**
 * Caracteres separadores permitidos en formatos de fecha.
 * 
 * @enum {string}
 */
export enum DateSeparator {
    /** Guión */
    DASH = '-',
    /** Barra diagonal */
    SLASH = '/',
    /** Dos puntos */
    COLON = ':',
    /** Espacio */
    SPACE = ' '
}

/**
 * Caracteres permitidos para formatear fechas.
 * Incluye caracteres de fecha/hora y separadores.
 * 
 * Caracteres de fecha/hora:
 * - 'Y': Año con 4 dígitos
 * - 'm': Mes con 2 dígitos (01-12)
 * - 'd': Día con 2 dígitos (01-31)
 * - 'H': Hora en formato 24h (00-23)
 * - 'i': Minutos (00-59)
 * - 's': Segundos (00-59)
 * 
 * Separadores:
 * - '-': Guión
 * - '/': Barra diagonal
 * - ':': Dos puntos
 * - ' ': Espacio
 * 
 * @typedef {'Y'|'m'|'d'|'H'|'i'|'s'|'-'|'/'|':'|' '} CharactersAllowed
 */
type CharactersAllowed = 'Y' | 'm' | 'd' | 'H' | 'i' | 's' | '-' | '/' | ':' | ' ';

/**
 * Tipo auxiliar que valida que una cadena solo contenga caracteres permitidos.
 * Utiliza TypeScript template literal types para validación recursiva.
 * 
 * @typedef {string} OnlyAllowedCharacters<T>
 * @template T - Cadena a validar
 */
type OnlyAllowedCharacters<T extends string> =
    T extends `${infer First}${infer Rest}`
    ? First extends CharactersAllowed
    ? OnlyAllowedCharacters<Rest>
    : never
    : T;

/**
 * Tipo que representa un formato de fecha válido.
 * Solo acepta cadenas que contengan únicamente caracteres permitidos.
 * 
 * @typedef {string} Format
 * 
 * @example
 * // Formatos válidos:
 * const format1: Format = "Y-m-d H:i:s";  // "2025-12-03 18:30:45"
 * const format2: Format = "d/m/Y";        // "03/12/2025"
 * const format3: Format = "H:i";          // "18:30"
 * 
 * // Formatos inválidos (causarán error de compilación):
 * // const invalid: Format = "Y-m-d X";   // 'X' no está permitido
 */
type Format = OnlyAllowedCharacters<string>;


export type { Format, CharactersAllowed, OnlyAllowedCharacters };

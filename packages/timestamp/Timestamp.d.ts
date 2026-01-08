import type { Format } from './Types/Format.ts';

/**
 * Clase para manipulación y formato de timestamps (fechas representadas en segundos).
 *
 * Esta clase proporciona funcionalidades para:
 * - Obtener el timestamp actual en segundos
 * - Convertir timestamps a fechas formateadas con patrones personalizados
 * - Calcular diferencias entre timestamps
 *
 * Los timestamps se manejan en segundos desde el 1 de enero de 1970 (Unix epoch).
 *
 * @class Timestamp
 * @version 1.0.0
 */
declare class Timestamp {

    /**
     * Obtiene el timestamp actual en segundos desde el 1 de enero de 1970 (Unix epoch).
     *
     * @returns {number} Timestamp actual en segundos (entero, sin milisegundos).
     */
    get(): number;

    /**
     * Convierte un timestamp a una fecha formateada según el patrón especificado.
     *
     * Caracteres de formato soportados:
     * - Y: Año con 4 dígitos
     * - m: Mes con 2 dígitos (01-12)
     * - d: Día con 2 dígitos (01-31)
     * - H: Hora en formato 24h (00-23)
     * - i: Minutos (00-59)
     * - s: Segundos (00-59)
     * - Separadores: espacio, guion (-), dos puntos (:), barra (/)
     *
     * @param {Format} format - Patrón de formato (ej: "Y-m-d H:i:s").
     * @param {number} timestamp - Timestamp en segundos. Si es 0 o no se proporciona, usa el actual.
     * @returns {string} Fecha formateada según el patrón especificado.
     */
    convertToDate(
        format: Format,
        timestamp: number
    ): string;


    /**
     * Calcula la diferencia en segundos entre dos timestamps.
     *
     * @param {number} start - Timestamp inicial (punto de partida).
     * @param {number} end - Timestamp final. Si no se proporciona, usa el timestamp actual.
     * @returns {number} Diferencia en segundos (end - start).
     */
    getDifference(
        start: number,
        end: number
    ): number;

}

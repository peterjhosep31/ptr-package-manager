import type { CharactersAllowed, Format } from "./Types/Format.ts";


/**
 * Clase para manipulación y formato de timestamps (fechas representadas en segundos).
 * 
 * Esta clase proporciona funcionalidades para:
 * - Obtener el timestamp actual en segundos
 * - Convertir timestamps a fechas formateadas con patrones personalizados
 * - Calcular diferencias entre timestamps
 * - Formatear fechas según caracteres específicos (Y, m, d, H, i, s)
 * 
 * Los timestamps se manejan en segundos desde el 1 de enero de 1970 (Unix epoch).
 * El formato de fecha soporta caracteres: Y (año), m (mes), d (día), H (hora), i (minutos), s (segundos)
 * y separadores: espacio, guión (-), dos puntos (:), barra (/).
 * 
 * La clase es inmutable una vez instanciada (Object.freeze) y se exporta como singleton.
 * 
 * @class Timestamp
 * @version 1.0.0
 */
class Timestamp {

    public static name: string;

    /**
     * Instancia interna de Date utilizada para formatear fechas.
     * Se utiliza solo durante el proceso de conversión y formateo.
     * 
     * @private
     * @type {Date|undefined}
     */
    #date: Date | undefined;

    /**
     * Constructor de la clase Timestamp.
     * Inicializa el nombre estático de la clase.
     * 
     * @constructor
     */

    public constructor() {
        // Constructor vacío - el nombre se asigna automáticamente
    }


    /**
     * Obtiene el timestamp actual en segundos desde el 1 de enero de 1970 (Unix epoch).
     * 
     * @returns {number} Timestamp actual en segundos (entero, sin milisegundos).
     * @example
     * const now = timestamp.get();
     * console.log(now); // 1733270400 (ejemplo)
     */
    public get(): number {

        let time: number = new Date().getTime();

        return Math.floor(time / 1_000);
    }


    /**
     * Convierte un timestamp a una fecha formateada según el patrón especificado.
     * Los caracteres de formato soportados son:
     * - Y: Año con 4 dígitos (ej: 2025)
     * - m: Mes con 2 dígitos (01-12)
     * - d: Día con 2 dígitos (01-31)
     * - H: Hora con 2 dígitos en formato 24h (00-23)
     * - i: Minutos con 2 dígitos (00-59)
     * - s: Segundos con 2 dígitos (00-59)
     * - Separadores permitidos: espacio, guion (-), dos puntos (:), barra (/)
     * 
     * @param {Format} format - Patrón de formato (ej: "Y-m-d H:i:s", "d/m/Y").
     * @param {number} timestamp - Timestamp en segundos. Si no se proporciona o es 0, usa el timestamp actual.
     * @returns {string} Fecha formateada según el patrón especificado.
     * @throws {Error} Si el parámetro timestamp no es un número.
     * @example
     * convertToDate("Y-m-d H:i:s", 1733270400) // "2025-12-03 18:00:00"
     * convertToDate("d/m/Y", 1733270400) // "03/12/2025"
     */
    public convertToDate(
        format: Format,
        timestamp: number
    ): string {
        timestamp ||= this.get();

        if (!timestamp || typeof timestamp !== "number")
            throw new global.Error(
                "El parámetro 'timestamp' debe ser un número."
            );

        this.#date = new Date(timestamp * 1000);
        return this.formatDate(format);
    }


    /**
     * Calcula la diferencia en segundos entre dos timestamps.
     * 
     * @param {number} start - Timestamp inicial (punto de partida).
     * @param {number|null} [end=null] - Timestamp final. Si es null o no se proporciona, usa el timestamp actual.
     * @returns {number} Diferencia en segundos (end - start). Puede ser negativo si start es posterior a end.
     * @throws {Error} Si el parámetro start no es un número o no está definido.
     * @example
     * getDiference(1733270400, 1733274000) // 3600 (1 hora de diferencia)
     * getDiference(1733270400) // Diferencia desde el timestamp dado hasta ahora
     */
    public getDiference(
        start: number,
        end: number | null = null
    ): number {

        if (!start || typeof start !== "number")
            throw new global.Error("El parámetro 'start' debe ser un número.");

        end ||= this.get();
        return end - start;
    }


    /**
     * Formatea la fecha interna (#date) según el patrón indicado.
     * Método privado utilizado internamente por convertToDate.
     * Valida que el formato no contenga caracteres duplicados y solo use caracteres permitidos.
     * 
     * @private
     * @param {Format} format - Patrón de formato con caracteres Y, m, d, H, i, s y separadores.
     * @returns {string} Fecha formateada.
     * @throws {Error} Si #date no es una instancia válida de Date.
     * @throws {Error} Si el formato contiene caracteres inválidos o duplicados.
     */
    private formatDate(
        format: Format
    ): string {

        if (!this.#date || !(this.#date instanceof Date))
            throw new global.Error(
                "El parámetro 'date' debe ser una instancia de Date."
            );

        if (/^(?!.*([YmdHis]).*\1)[YmdHis\s/:\-]+$/.test(format) === false)
            throw new global.Error(
                "El formato de fecha es inválido. Debe contener solo Y, m, d, H, i, s y/o espacios, guiones, dos puntos o barras."
            );
        const FORMAT_IN_ARRAY = Array.from(format);
        let result = "";
        for (let x: number = 0; x < FORMAT_IN_ARRAY.length; x++) {
            const CHARACTER: string | undefined = FORMAT_IN_ARRAY[x];
            if (CHARACTER === undefined)
                throw new global.Error(
                    `Carácter de formato no reconocido: ${CHARACTER}`
                );
            // Si es separador, lo agrega tal cual
            if (/[\s/:\-]/.test(CHARACTER)) {
                result += CHARACTER;
                continue;
            }
            // Si es carácter de formato, obtiene el valor correspondiente
            result += this.getDataTime(CHARACTER as CharactersAllowed);
        }
        return result;
    }


    /**
     * Obtiene el valor correspondiente al carácter de formato para la fecha interna.
     * Método privado que extrae componentes individuales de la fecha.
     * 
     * @private
     * @param {CharactersAllowed} character - Carácter de formato: 'Y', 'm', 'd', 'H', 'i' o 's'.
     * @returns {string} Valor formateado con dos dígitos (excepto Y que retorna 4 dígitos).
     * @throws {Error} Si #date no es una instancia válida de Date.
     * @throws {Error} Si el carácter de formato no es reconocido.
     * @example
     * getDataTime('Y') // "2025"
     * getDataTime('m') // "12"
     * getDataTime('d') // "03"
     */
    private getDataTime(
        character: CharactersAllowed
    ): string {
        let result = null;
        if (!(this.#date instanceof Date))
            throw new global.Error(
                "El parámetro 'date' debe ser una instancia de Date."
            );
        switch (character) {
            case "Y":
                result = this.#date.getFullYear().toString();
                break;
            case "m":
                result = this.#date.getMonth() + 1;
                break;
            case "d":
                result = this.#date.getDate();
                break;
            case "H":
                result = this.#date.getHours();
                break;
            case "i":
                result = this.#date.getMinutes();
                break;
            case "s":
                result = this.#date.getSeconds();
                break;
            default:
                throw new global.Error(
                    `Formato de fecha no reconocido: ${character}`
                );
        }
        // Devuelve el valor como string de dos dígitos
        return String(result).padStart(2, "0");
    }
}

/**
 * Exporta una instancia única de Timestamp para uso global.
 */
export default new Timestamp();

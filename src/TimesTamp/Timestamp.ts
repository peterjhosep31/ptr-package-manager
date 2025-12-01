import type { CharactersAllowed, Format } from "./Types/Format.ts";


/**
 * Clase para manipulación y formato de timestamps (fechas en segundos).
 * Permite obtener el timestamp actual, convertirlo a fecha formateada,
 * calcular diferencias y formatear fechas según un patrón personalizado.
 */
class Timestamp {

    public static name: string;

    /**
     * Instancia interna de Date utilizada para formatear fechas.
     */
    #date: Date | undefined;

    public constructor() {
        Timestamp.name = 'Timestamp';
    }


    /**
     * Obtiene el timestamp actual en segundos.
     * @returns {number} Timestamp actual (segundos desde 1970-01-01).
     */
    public get(): number {

        let time: number = new Date().getTime();

        return Math.floor(time / 1_000);
    }


    /**
     * Convierte un timestamp a una fecha formateada según el patrón indicado.
     * @param {Format} format - Patrón de formato (ej: "Y-m-d H:i:s").
     * @param {number} timestamp - Timestamp en segundos. Si no se indica, usa el actual.
     * @returns {string} Fecha formateada.
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
     * @param {number} start - Timestamp inicial.
     * @param {number|null} end - Timestamp final. Si no se indica, usa el actual.
     * @returns {number} Diferencia en segundos.
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
     * @param {Format} format - Patrón de formato (ej: "Y-m-d H:i:s").
     * @returns {string} Fecha formateada.
     * @private
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
     * @param {CharactersAllowed} character - Carácter de formato ('Y', 'm', 'd', 'H', 'i', 's').
     * @returns {string} Valor formateado (siempre dos dígitos).
     * @private
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

Object.setPrototypeOf(this, Timestamp.prototype);
Object.freeze(Timestamp);

/**
 * Exporta una instancia única de Timestamp para uso global.
 */
export default new Timestamp();

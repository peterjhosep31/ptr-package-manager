import type { ErrorParams } from './Types/Params.ts';

/**
 * Clase de error personalizada que extiende la clase nativa Error de JavaScript.
 *
 * Proporciona información adicional sobre errores, incluyendo:
 * - Causa específica del error
 * - Tipo de dato esperado
 * - Tipo de dato recibido
 * - Código de estado HTTP asociado
 *
 * @class CustomError
 * @extends Error
 * @version 1.0.0
 */
declare class CustomError extends Error {

    /**
     * Constructor de la clase CustomError.
     *
     * @param {string} message - Mensaje descriptivo del error.
     * @param {ErrorParams} [params] - Objeto con parámetros opcionales del error.
     */
    constructor(message: string, params?: ErrorParams);

    /**
     * Obtiene la causa específica que originó el error.
     *
     * @returns {string|undefined} Causa del error, o undefined si no fue especificada.
     */
    public get cause(): string | undefined;

    /**
     * Obtiene el tipo de dato esperado.
     *
     * @returns {string|undefined} Tipo de dato esperado, o undefined si no fue especificado.
     */
    public get expected(): string | undefined;

    /**
     * Obtiene el tipo de dato recibido.
     *
     * @returns {string|undefined} Tipo de dato recibido, o undefined si no fue especificado.
     */
    public get received(): string | undefined;

    /**
     * Obtiene el código de estado HTTP asociado al error.
     *
     * @returns {number|undefined} Código de estado HTTP, o undefined si no fue especificado.
     */
    public get status(): number | undefined;
}

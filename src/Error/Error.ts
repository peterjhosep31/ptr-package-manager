import type { ErrorParams } from "./Types/Params.ts";

/**
 * Clase de error personalizada que extiende la clase nativa Error de JavaScript.
 *
 * Esta clase proporciona información adicional sobre errores, incluyendo:
 * - Causa específica del error
 * - Tipo de dato esperado
 * - Tipo de dato recibido
 * - Código de estado HTTP asociado
 *
 * Todos los parámetros adicionales son opcionales y se validan automáticamente
 * para garantizar que sean del tipo correcto antes de ser almacenados.
 *
 * La clase es inmutable una vez instanciada (Object.freeze) para garantizar
 * la integridad de la información del error.
 *
 * @class CustomError
 * @extends Error
 * @version 1.0.0
 */
class CustomError extends Error {

    public static override name: string;

    private _cause?: string;
    private _expected?: string;
    private _received?: string;
    private _status?: number;

    /**
     * Constructor de la clase CustomError.
     *
     * @constructor
     * @param {string} message - Mensaje descriptivo del error.
     * @param {ErrorParams} [params={}] - Objeto con parámetros opcionales del error:
     * @param {string} [params.cause] - Causa específica que originó el error.
     * @param {string} [params.expected] - Tipo de dato o valor esperado.
     * @param {string} [params.received] - Tipo de dato o valor recibido.
     * @param {number} [params.status] - Código de estado HTTP asociado al error.
     * @throws {CustomError} Si algún parámetro opcional no cumple con su validación de tipo.
     */

    public constructor(
        message: string,
        {
            cause,
            expected,
            received,
            status
        }: Partial<ErrorParams> = {}
    ) {
        super(message);
        this.name = 'CustomError';

        // Usar propiedades privadas y validar después

        // Validar solo si los valores están definidos
        if (cause !== undefined) {
            this._validateCause(cause);
            this._cause = cause;
        }
        if (expected !== undefined) {
            this._validateExpected(expected);
            this._expected = expected;
        }
        if (received !== undefined) {
            this._validateReceived(received);
            this._received = received;
        }
        if (status !== undefined) {
            this._validateStatus(status);
            this._status = status;
        }
    }

    /**
     * Valida que el valor de cause sea de tipo string.
     *
     * @private
     * @param {string} value - Valor a validar.
     * @throws {CustomError} Si el valor no es de tipo string (status 500).
     */
    private _validateCause(value: string) {
        if (typeof value !== "string") {
            throw new CustomError(`Error de validación: La propiedad 'cause' requiere un valor de tipo string, pero se recibió '${typeof value}'`, {
                expected: "string",
                received: typeof value,
                cause: "Tipo de dato inválido para la causa del error",
                status: 500 // Internal Server Error - Error de configuración interna

            });
        }
    }

    /**
     * Valida que el valor de expected sea de tipo string.
     *
     * @private
     * @param {string} value - Valor a validar.
     * @throws {CustomError} Si el valor no es de tipo string (status 500).
     */
    private _validateExpected(value: string) {

        if (typeof value !== "string") {
            throw new CustomError(`Error de validación: La propiedad 'expected' requiere un valor de tipo string, pero se recibió '${typeof value}'`, {
                expected: "string",
                received: typeof value,
                cause: "Tipo de dato inválido para el valor esperado",
                status: 500 // Internal Server Error - Error de configuración interna
            });
        }
    }

    /**
     * Valida que el valor de received sea de tipo string.
     *
     * @private
     * @param {string} value - Valor a validar.
     * @throws {CustomError} Si el valor no es de tipo string (status 500).
     */
    private _validateReceived(value: string) {
        if (typeof value !== "string") {
            throw new CustomError(`Error de validación: La propiedad 'received' requiere un valor de tipo string, pero se recibió '${typeof value}'`, {
                expected: "string",
                received: typeof value,
                cause: "Tipo de dato inválido para el valor recibido",
                status: 500 // Internal Server Error - Error de configuración interna
            });
        }
    }

    /**
     * Valida que el valor de status sea de tipo number.
     *
     * @private
     * @param {number} value - Valor a validar.
     * @throws {CustomError} Si el valor no es de tipo number (status 500).
     */
    private _validateStatus(value: number) {
        if (typeof value !== "number") {
            throw new CustomError(`Error de validación: La propiedad 'status' requiere un valor de tipo number, pero se recibió '${typeof value}'`, {
                expected: "number",
                received: typeof value,
                cause: "Código de estado HTTP debe ser numérico",
                status: 500 // Internal Server Error - Error de configuración interna
            });
        }
    }

    /**
     * Establece la causa del error.
     *
     * @private
     * @param {string} value - Causa del error.
     * @throws {CustomError} Si el valor no es de tipo string.
     */
    private override set cause(value: string) {
        this._validateCause(value);
        this._cause = value;
    }

    /**
     * Obtiene la causa del error.
     *
     * @returns {string|undefined} Causa específica que originó el error, o undefined si no fue especificada.
     */
    public override get cause(): string | undefined {
        return this._cause;
    }

    /**
     * Establece el tipo de dato esperado.
     *
     * @private
     * @param {string} value - Tipo de dato esperado.
     * @throws {CustomError} Si el valor no es de tipo string.
     */
    private set expected(value: string) {
        this._validateExpected(value);
        this._expected = value;
    }

    /**
     * Obtiene el tipo de dato esperado.
     *
     * @returns {string|undefined} Tipo de dato o valor esperado, o undefined si no fue especificado.
     */
    public get expected(): string | undefined {
        return this._expected;
    }

    /**
     * Establece el tipo de dato recibido.
     *
     * @private
     * @param {string} value - Tipo de dato recibido.
     * @throws {CustomError} Si el valor no es de tipo string.
     */
    private set received(value: string) {
        this._validateReceived(value);
        this._received = value;
    }

    /**
     * Obtiene el tipo de dato recibido.
     *
     * @returns {string|undefined} Tipo de dato o valor recibido, o undefined si no fue especificado.
     */
    public get received(): string | undefined {
        return this._received;
    }

    /**
     * Establece el código de estado HTTP.
     *
     * @private
     * @param {number} value - Código de estado HTTP.
     * @throws {CustomError} Si el valor no es de tipo number.
     */
    private set status(value: number) {
        this._validateStatus(value);
        this._status = value;
    }

    /**
     * Obtiene el código de estado HTTP asociado al error.
     *
     * @returns {number|undefined} Código de estado HTTP, o undefined si no fue especificado.
     */
    public get status(): number | undefined {
        return this._status;
    }
}

export default CustomError;

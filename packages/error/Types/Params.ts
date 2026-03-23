/**
 * Tipo de parámetros para el constructor de la clase CustomError.
 * Todos los campos son opcionales y proporcionan información adicional sobre el error.
 *
 * @typedef {Object} ErrorParams
 * @property {string} [cause] - Causa específica que originó el error. Descripción detallada del problema.
 * @property {string} [expected] - Tipo de dato o valor que se esperaba recibir.
 * @property {string} [received] - Tipo de dato o valor que realmente se recibió.
 * @property {number} [status] - Código de estado HTTP asociado al error (ej: 404, 500, 422).
 *
 * @example
 * const errorParams: ErrorParams = {
 *   cause: "El archivo no existe en el sistema",
 *   expected: "string",
 *   received: "number",
 *   status: 422
 * };
 */
type ErrorParams = {
    cause: string;
    expected: string;
    received: string;
    status: number;
};


export type { ErrorParams };

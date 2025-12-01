import type { ErrorParams } from "./Types/Params.ts";


class CustomError extends Error {

    public static override name: string;

    private _cause?: string;
    private _expected?: string;
    private _received?: string;
    private _status?: number;

    public constructor(
        message: string,
        {
            cause,
            expected,
            received,
            status
        }: ErrorParams = {}
    ) {
        super(message);
        CustomError.name = 'CustomError';

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

    // Métodos de validación privados
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

    private override set cause(value: string) {
        this._validateCause(value);
        this._cause = value;
    }

    public override get cause(): string | undefined {
        return this._cause;
    }

    private set expected(value: string) {
        this._validateExpected(value);
        this._expected = value;
    }

    public get expected(): string | undefined {
        return this._expected;
    }

    private set received(value: string) {
        this._validateReceived(value);
        this._received = value;
    }

    public get received(): string | undefined {
        return this._received;
    }

    private set status(value: number) {
        this._validateStatus(value);
        this._status = value;
    }

    public get status(): number | undefined {
        return this._status;
    }
}

Object.setPrototypeOf(this, CustomError.prototype);
Object.freeze(CustomError);

export default CustomError;

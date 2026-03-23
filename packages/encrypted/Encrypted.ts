
import CustomError from "../error/Error.ts";

/**
 * Clase para encriptación y desencriptación de texto usando un algoritmo personalizado.
 *
 * Esta clase implementa un sistema de encriptación basado en:
 * - Un mapa de caracteres predefinido
 * - Un "salto" (jump) dinámico generado y almacenado en base de datos
 * - Valores calculados de salt, jumpValue y modifier basados en el salto
 *
 * El algoritmo es reversible y proporciona una capa de seguridad básica
 * para la protección de datos sensibles en la aplicación.
 *
 * @class Encrypted
 * @version 1.0.0
 */
class Encrypted {

    /**
     * Mapa de caracteres utilizado para la encriptación/desencriptación.
     * Incluye letras mayúsculas, minúsculas, números y algunos símbolos especiales.
     *
     * @type {string[]}
     */
    private readonly map: string[];

    /**
     * Variable estática que almacena el salto (jump) utilizado para la encriptación.
     * Se inicializa una sola vez y se reutiliza en todas las instancias.
     *
     * @type {string|null}
     */
    private static jump: string | null = null;

    // private static salt: number | null = null;

    /**
     * Constructor de la clase Encrypted.
     * Inicializa el salto (jump) si no ha sido inicializado previamente.
     *
     * @constructor
     */
    public constructor() {

        this.map = [
            "a", "A", "b", "B", "c", "C", "d", "D", "e", "E", "f", "F",
            "g", "G", "h", "H", "i", "I", "j", "J", "k", "K", "l", "L",
            "m", "M", "n", "N", "o", "O", "p", "P", "q", "Q", "r", "R",
            "s", "S", "t", "T", "u", "U", "v", "V", "w", "W", "x", "X",
            "y", "Y", "z", "Z", "0", "1", "2", "3", "4", "5", "6", "7",
            "8", "9", "+", "/", "-", "_", " ", ",", "."
        ];

        if (!Encrypted.jump) {
            Encrypted.jump = this.getJump();
        }
    }

    /**
     * Restablece el salto (jump) generando uno nuevo.
     * Útil cuando se necesita cambiar la clave de encriptación.
     * Todos los textos encriptados con el salto anterior no podrán desencriptarse.
     *
     * @public
     * @returns {string} El nuevo salto generado.
     * @example
     * const encrypted = new Encrypted();
     * const newJump = encrypted.resetJump();
     * console.log("Nuevo salto:", newJump);
     */
    public resetJump(): string {
        Encrypted.jump = this.generateJump();
        return Encrypted.jump;
    }

    /**
     * Obtiene el salto (jump) utilizado para la encriptación.
     * Si no existe, genera uno nuevo mediante generateJump().
     *
     * @public
     * @returns {string} El salto generado o recuperado.
     */
    public getJump(): string {
        return this.generateJump();
    };

    /**
     * Genera un salto aleatorio de longitud variable entre 6 y 10 caracteres.
     * El salto se construye seleccionando caracteres aleatorios del mapa.
     *
     * @private
     * @returns {string} El salto generado aleatoriamente.
     * @throws {CustomError} Si el mapa de caracteres no está inicializado.
     */
    private generateJump(): string {

        const LENGTH: number = 6 + Math.floor(Math.random() * 5); // Entre 6-10 caracteres

        let jump = '';
        for (let i = 0; i < LENGTH; i++) {
            const randomIndex = Math.floor(Math.random() * this.map.length);
            jump += this.map[randomIndex];
        }
        return jump;
    }

    /**
     * Obtiene el valor de "salt" basado en un carácter del salto.
     * Calcula el índice del carácter en el mapa y aplica una fórmula matemática
     * usando potencias de PI para generar un valor de salt único.
     *
     * @private
     * @param {string} leap - El carácter para calcular el "salt".
     * @returns {number} El valor de "salt" calculado.
     * @throws {CustomError} Si el mapa no está inicializado o si el salt es 0.
     */
    private getSalt(
        leap: string
    ): number {

        let salt: number = this.map.indexOf(leap) + 1;

        if (salt === 0)
            throw new CustomError("Salt is not initialized - character not found in map", {
                cause: `Character '${leap}' not found in character map`,
                status: 500
            });

        return Math.floor(Math.PI ** salt) % this.map.length;
    }

    /**
     * Calcula los valores de "salt", "jumpValue" y "modifier" usando todos los caracteres del salto.
     * Distribuye los caracteres del salto en tres valores diferentes según su posición (módulo 3).
     * Estos valores se utilizan en los algoritmos de encriptación y desencriptación.
     *
     * @private
     * @returns {Object} Objeto con las propiedades salt, jumpValue y modifier.
     * @returns {number} returns.salt - Valor de salt calculado (mínimo 1).
     * @returns {number} returns.jumpValue - Valor de jumpValue calculado (mínimo 1).
     * @returns {number} returns.modifier - Valor de modifier calculado (mínimo 1).
     * @throws {CustomError} Si el mapa no está inicializado o si el jump no está definido.
     */
    private calculateValues(): {
        salt: number;
        jumpValue: number;
        modifier: number;
    } {

        const JUMP = Encrypted.jump;
        if (!JUMP)
            throw new CustomError("Jump is not initialized", {
                cause: "Jump is not initialized",
                status: 500
            });

        const CHAR_MAP: string[] = Array.from(JUMP);

        let character: string | undefined,
            charSalt: number,
            length: number,
            salt = 0,
            jumpValue = 0,
            modifier = 0;

        // Usar todos los caracteres del jump
        for (let i = 0; i < CHAR_MAP.length; i++) {

            character = CHAR_MAP[i];

            if (character === undefined)
                continue;

            charSalt = this.getSalt(character);
            length = this.map.length;

            if (i % 3 === 0) {
                salt = (salt + charSalt) % length;
            } else if (i % 3 === 1) {
                jumpValue = (jumpValue + charSalt) % length;
            } else {
                modifier = (modifier + charSalt) % length;
            }
        }

        // Asegurar valores mínimos
        salt = salt || 1;
        jumpValue = jumpValue || 1;
        modifier = modifier || 1;

        return {
            salt,
            jumpValue,
            modifier
        };
    }

    /**
     * Encripta un texto usando el mapa de caracteres y los valores calculados.
     * Cada carácter se desplaza en el mapa según una fórmula que incluye
     * el salt, la posición del carácter, el jumpValue y el modifier.
     *
     * @public
     * @param {string} text - Texto a encriptar.
     * @returns {string} El texto encriptado.
     * @throws {CustomError} Si el mapa de caracteres no está inicializado.
     */
    public encrypt(
        text: string
    ): string {

        // Validación de entrada
        if (typeof text !== 'string') {
            throw new CustomError(
                `Error de validación en Encrypted.encrypt(): El parámetro 'text' debe ser de tipo string`,
                {
                    cause: "Tipo de dato inválido para el parámetro text",
                    expected: "string",
                    received: typeof text,
                    status: 422
                }
            );
        }

        if (text.length === 0) {
            throw new CustomError(
                `Error de validación en Encrypted.encrypt(): El parámetro 'text' no puede estar vacío`,
                {
                    cause: "El texto a encriptar debe contener al menos un carácter",
                    expected: "non-empty string",
                    received: "empty string",
                    status: 422
                }
            );
        }

        const {
            salt,
            jumpValue,
            modifier
        } = this.calculateValues();

        let encrypted: string = '',
            char: string | undefined,
            charIndex: number,
            total: number,
            newIndex: number;

        for (let i = 0; i < text.length; i++) {

            char = text[i];
            if (char === undefined) continue;

            charIndex = this.map.indexOf(char);

            if (charIndex !== -1) {

                total = charIndex + salt + (i * jumpValue) + modifier;
                newIndex = total % this.map.length;
                encrypted += this.map[newIndex];

            } else
                encrypted += char;

        }

        return encrypted;
    }

    /**
     * Desencripta un texto encriptado usando el mapa de caracteres y los valores calculados.
     * Invierte el proceso de encriptación aplicando la fórmula inversa para recuperar
     * los caracteres originales.
     *
     * @public
     * @param {string} text - Texto encriptado a desencriptar.
     * @returns {string} El texto desencriptado (original).
     * @throws {CustomError} Si el mapa de caracteres no está inicializado.
     */
    public decrypt(
        text: string
    ): string {

        // Validación de entrada
        if (typeof text !== 'string') {
            throw new CustomError(
                `Error de validación en Encrypted.decrypt(): El parámetro 'text' debe ser de tipo string`,
                {
                    cause: "Tipo de dato inválido para el parámetro text",
                    expected: "string",
                    received: typeof text,
                    status: 422
                }
            );
        }

        if (text.length === 0) {
            throw new CustomError(
                `Error de validación en Encrypted.decrypt(): El parámetro 'text' no puede estar vacío`,
                {
                    cause: "El texto a desencriptar debe contener al menos un carácter",
                    expected: "non-empty string",
                    received: "empty string",
                    status: 422
                }
            );
        }

        const {
            salt,
            jumpValue,
            modifier
        } = this.calculateValues();

        let decrypted = '',
            char: string | undefined,
            charIndex: number,
            total: number,
            originalIndex: number;

        for (let i = 0; i < text.length; i++) {

            char = text[i];
            if (char === undefined) continue;

            charIndex = this.map.indexOf(char);

            if (charIndex !== -1) {
                total = charIndex - salt - (i * jumpValue) - modifier;

                while (total < 0) total += this.map.length;

                originalIndex = total % this.map.length;

                decrypted += this.map[originalIndex];
            } else
                decrypted += char;

        }

        return decrypted;
    }

}

export default Encrypted;


import CustomError from "../Error/Error.ts";

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
 * @class Encripted
 * @version 1.0.0
 */
class Encripted {

    /**
     * Mapa de caracteres utilizado para la encriptación/desencriptación.
     * Incluye letras mayúsculas, minúsculas, números y algunos símbolos especiales.
     *
     * @type {string[]}
     */
    private map: string[] | undefined;

    /**
     * Variable estática que almacena el salto (jump) utilizado para la encriptación.
     * Se inicializa una sola vez y se reutiliza en todas las instancias.
     *
     * @type {string|null}
     */
    private static jump: string | null = null;

    // private static salt: number | null = null;

    /**
     * Constructor de la clase Encripted.
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

        if (!Encripted.jump) {
            Encripted.jump = this.getJump();
        }
    }

    /**
     * Genera un salto robusto y lo guarda en la base de datos si no existe.
     *
     * @returns {string} El salto generado o recuperado de la base de datos.
     */
    public getJump(): string {
        return this.generateJump();
    };

    /**
     * Genera un salto aleatorio de longitud variable entre 6 y 10 caracteres.
     *
     * @returns {string} El salto generado aleatoriamente.
     */
    private generateJump(): string {

        const LENGTH: number = 6 + Math.floor(Math.random() * 5); // Entre 6-10 caracteres

        if (this.map === undefined)
            throw this.errorMap();

        let jump = '';
        for (let i = 0; i < LENGTH; i++) {
            const randomIndex = Math.floor(Math.random() * this.map.length);
            jump += this.map[randomIndex];
        }
        return jump;
    }

    /**
     * Obtiene el valor de "salt" basado en un carácter.
     *
     * @private
     * @param {string} leap - El carácter para calcular el "salt".
     * @returns {number} El valor de "salt" calculado.
     */
    private getSalt(
        leap: string
    ): number {

        if (this.map === undefined)
            throw this.errorMap();

        let salt: number = 0;

        if (!(/\d/.test(leap))) {
            salt = this.map.indexOf(leap) + 1;
        }

        if (salt === 0)
            throw new CustomError("Salt is not initialized", {
                cause: "Salt is not initialized",
                status: 500
            });

        return Math.floor(Math.PI ** salt) % this.map.length;
    }

    /**
     * Calcula los valores de "salt", "jumpValue" y "modifier" usando todos los caracteres del salto.
     *
     * @public
     * @returns {Object} Objeto con las propiedades salt, jumpValue y modifier
     * @returns {number} returns.salt - Valor de salt calculado
     * @returns {number} returns.jumpValue - Valor de jumpValue calculado
     * @returns {number} returns.modifier - Valor de modifier calculado
     */
    private calculateValues() {

        if (this.map === undefined)
            throw this.errorMap();



        const JUMP = Encripted.jump;
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
     *
     * @param {string} text - Texto a encriptar.
     * @returns {string} El texto encriptado.
     */
    public encrypt(
        text: string
    ): string {

        if (this.map === undefined)
            throw this.errorMap();

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
     *
     * @param {string} text - Texto encriptado a desencriptar.
     * @returns {string} El texto desencriptado (original).
     */
    public decrypt(
        text: string
    ): string {

        if (this.map === undefined)
            throw this.errorMap();

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

    private errorMap(): CustomError | void {
        if (this.map === undefined)
            return new CustomError("Map is not initialized", {
                cause: "Map is not initialized",
                received: typeof this.map,
                expected: "string[]",
                status: 500
            });

    }

}

export default Encripted;

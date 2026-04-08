
import CustomError from "../error/Error.ts";
import { DATABASE } from "./database/index.ts";

type JumpRecord = {
    key: string;
    jump: string;
    startsAt: number;
    endsAt: number | null;
    createdAt: number;
};

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
    private static jumpKey: string | null = null;

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
        const period = this.getCurrentPeriod();
        const forcedKey = `${period.key}-r${Date.now()}`;
        const newJump = this.generateJump();

        this.saveJump({
            key: forcedKey,
            jump: newJump,
            startsAt: Date.now(),
            endsAt: period.endsAt,
            createdAt: Date.now()
        });

        Encrypted.jumpKey = forcedKey;
        Encrypted.jump = newJump;

        return newJump;
    }

    /**
     * Obtiene el salto (jump) utilizado para la encriptación.
     * Si no existe, genera uno nuevo mediante generateJump().
     *
     * @public
     * @returns {string} El salto generado o recuperado.
     */
    public getJump(): string {
        const period = this.getCurrentPeriod();

        if (Encrypted.jump && Encrypted.jumpKey === period.key)
            return Encrypted.jump;

        const STORED_JUMP = this.getStoredJump(period.key);

        if (STORED_JUMP) {
            Encrypted.jump = STORED_JUMP.jump;
            Encrypted.jumpKey = STORED_JUMP.key;
            return STORED_JUMP.jump;
        }

        const GENERATED_JUMP = this.generateJump();

        this.saveJump({
            key: period.key,
            jump: GENERATED_JUMP,
            startsAt: period.startsAt,
            endsAt: period.endsAt,
            createdAt: Date.now()
        });

        Encrypted.jump = GENERATED_JUMP;
        Encrypted.jumpKey = period.key;

        return GENERATED_JUMP;
    };

    private getStoredJump(
        key: string
    ): JumpRecord | null {

        try {

            const STATEMENT = DATABASE.prepare(
                "SELECT key, jump, startsAt, endsAt, createdAt FROM encripted WHERE key = ? LIMIT 1"
            );

            const RESULT = STATEMENT.get(key) as Partial<JumpRecord> | undefined;

            if (!RESULT?.jump || typeof RESULT.jump !== "string" || !RESULT.key)
                return null;

            return {
                key: RESULT.key,
                jump: RESULT.jump,
                startsAt: typeof RESULT.startsAt === "number" ? RESULT.startsAt : Date.now(),
                endsAt: typeof RESULT.endsAt === "number" ? RESULT.endsAt : null,
                createdAt: typeof RESULT.createdAt === "number" ? RESULT.createdAt : Date.now()
            };

        } catch (error: any) {
            throw new CustomError("No se pudo obtener el jump almacenado", {
                cause: String(error.message),
                status: 500
            });
        }
    }

    private saveJump(
        record: JumpRecord
    ): void {

        try {

            const STATEMENT = DATABASE.prepare(
                "INSERT OR IGNORE INTO encripted (key, jump, startsAt, endsAt, createdAt) VALUES (?, ?, ?, ?, ?)"
            );

            STATEMENT.run(
                record.key,
                record.jump,
                record.startsAt,
                record.endsAt,
                record.createdAt
            );

        } catch (error: any) {
            throw new CustomError("No se pudo guardar el jump", {
                cause: String(error.message),
                status: 500
            });
        }
    }

    private getAllJumps(
        limit: number = 500
    ): JumpRecord[] {

        try {

            const STATEMENT = DATABASE.prepare(
                "SELECT key, jump, startsAt, endsAt, createdAt FROM encripted ORDER BY createdAt DESC LIMIT ?"
            );

            const RESULT = STATEMENT.all(limit) as Partial<JumpRecord>[];

            return RESULT
                .filter((row): row is Required<Pick<JumpRecord, "key" | "jump">> & Partial<JumpRecord> => {
                    return typeof row.key === "string" && typeof row.jump === "string";
                })
                .map((row) => ({
                    key: row.key,
                    jump: row.jump,
                    startsAt: typeof row.startsAt === "number" ? row.startsAt : 0,
                    endsAt: typeof row.endsAt === "number" ? row.endsAt : null,
                    createdAt: typeof row.createdAt === "number" ? row.createdAt : 0
                }));

        } catch (error: any) {
            throw new CustomError("No se pudieron obtener los jumps históricos", {
                cause: String(error.message),
                status: 500
            });
        }
    }

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

    private calculateValuesWithJump(
        jump: string
    ): {
        salt: number;
        jumpValue: number;
        modifier: number;
    } {
        const previousJump = Encrypted.jump;
        Encrypted.jump = jump;

        const values = this.calculateValues();

        Encrypted.jump = previousJump;

        return values;
    }

    private transformWithJump(
        text: string,
        jump: string,
        direction: "encrypt" | "decrypt"
    ): string {
        const {
            salt,
            jumpValue,
            modifier
        } = this.calculateValuesWithJump(jump);

        let transformed = "";

        for (let i = 0; i < text.length; i++) {
            const char = text[i];

            if (char === undefined) continue;

            const charIndex = this.map.indexOf(char);

            if (charIndex === -1) {
                transformed += char;
                continue;
            }

            if (direction === "encrypt") {
                const total = charIndex + salt + (i * jumpValue) + modifier;
                const newIndex = total % this.map.length;
                transformed += this.map[newIndex] ?? char;
                continue;
            }

            let total = charIndex - salt - (i * jumpValue) - modifier;

            while (total < 0) total += this.map.length;

            const originalIndex = total % this.map.length;
            transformed += this.map[originalIndex] ?? char;
        }

        return transformed;
    }

    private hashSeed(
        input: string
    ): number {
        let hash = 0;

        for (let i = 0; i < input.length; i++) {
            hash = (hash << 5) - hash + input.charCodeAt(i);
            hash |= 0;
        }

        return Math.abs(hash);
    }

    private getDayKey(
        timestamp: number
    ): string {
        const DATE = new Date(timestamp);
        const year = DATE.getUTCFullYear();
        const month = String(DATE.getUTCMonth() + 1).padStart(2, "0");
        const day = String(DATE.getUTCDate()).padStart(2, "0");

        return `${year}${month}${day}`;
    }

    private getCutsByDay(
        dayKey: string
    ): number {
        const seed = this.hashSeed(dayKey);
        return 4 + (seed % 5);
    }

    private getCurrentPeriod(): {
        key: string;
        startsAt: number;
        endsAt: number;
    } {
        const NOW = Date.now();
        const DATE = new Date(NOW);
        const DAY_START = Date.UTC(
            DATE.getUTCFullYear(),
            DATE.getUTCMonth(),
            DATE.getUTCDate(),
            0,
            0,
            0,
            0
        );

        const DAY_KEY = this.getDayKey(NOW);
        const CUTS = this.getCutsByDay(DAY_KEY);
        const SLOT_SIZE = Math.floor(86400000 / CUTS);
        const SLOT_INDEX = Math.min(
            CUTS - 1,
            Math.floor((NOW - DAY_START) / SLOT_SIZE)
        );

        const STARTS_AT = DAY_START + (SLOT_INDEX * SLOT_SIZE);
        const ENDS_AT = SLOT_INDEX === CUTS - 1
            ? DAY_START + 86400000
            : STARTS_AT + SLOT_SIZE;

        return {
            key: `${DAY_KEY}-${SLOT_INDEX}`,
            startsAt: STARTS_AT,
            endsAt: ENDS_AT
        };
    }

    private createEncryptedHeader(
        key: string,
        issuedAt: number,
        jump: string
    ): string {
        const payload = `${key}|${issuedAt}`;
        const encryptedPayload = this.transformWithJump(payload, jump, "encrypt");
        const length = encryptedPayload.length.toString(36).padStart(2, "0");

        return `${length}${encryptedPayload}`;
    }

    private parseHeader(
        encryptedText: string
    ): { body: string; jump: string } | null {
        if (encryptedText.length < 3) {
            return null;
        }

        const length = Number.parseInt(encryptedText.slice(0, 2), 36);

        if (!Number.isFinite(length) || length <= 0) {
            return null;
        }

        const headerEnd = 2 + length;

        if (headerEnd > encryptedText.length) {
            return null;
        }

        const encryptedHeader = encryptedText.slice(2, headerEnd);
        const body = encryptedText.slice(headerEnd);
        const JUMPS = this.getAllJumps();

        for (const jumpRecord of JUMPS) {
            const decodedHeader = this.transformWithJump(encryptedHeader, jumpRecord.jump, "decrypt");
            const [key, issuedAt] = decodedHeader.split("|");

            if (!key || !issuedAt) {
                continue;
            }

            if (key !== jumpRecord.key) {
                continue;
            }

            if (!/^\d{8}-\d+(-r\d+)?$/.test(key)) {
                continue;
            }

            if (!/^\d{13}$/.test(issuedAt)) {
                continue;
            }

            return {
                body,
                jump: jumpRecord.jump
            };
        }

        return null;
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

        const jump = this.getJump();
        const encryptedBody = this.transformWithJump(text, jump, "encrypt");
        const header = this.createEncryptedHeader(
            Encrypted.jumpKey || this.getCurrentPeriod().key,
            Date.now(),
            jump
        );

        return `${header}${encryptedBody}`;
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

        const parsed = this.parseHeader(text);

        if (parsed) {
            return this.transformWithJump(parsed.body, parsed.jump, "decrypt");
        }

        // Compatibilidad con textos cifrados en formato anterior (sin cabecera)
        return this.transformWithJump(text, this.getJump(), "decrypt");
    }

}

export default Encrypted;

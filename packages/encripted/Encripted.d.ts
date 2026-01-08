
/**
 * Clase para encriptación y desencriptación de texto usando un algoritmo personalizado.
 *
 * Esta clase implementa un sistema de encriptación basado en:
 * - Un mapa de caracteres predefinido
 * - Un "salto" (jump) dinámico generado aleatoriamente
 * - Valores calculados de salt, jumpValue y modifier basados en el salto
 *
 * El algoritmo es reversible y proporciona una capa de seguridad básica
 * para la protección de datos sensibles.
 *
 * @class Encripted
 * @version 1.0.0
 */
declare class Encripted {

    /**
     * Mapa de caracteres utilizado para la encriptación/desencriptación.
     * @private
     * @readonly
     */
    private readonly map: string[];

    /**
     * Variable estática que almacena el salto (jump) utilizado para la encriptación.
     * @private
     * @static
     */
    private static jump: string | null;

    /**
     * Constructor de la clase Encripted.
     * Inicializa el mapa de caracteres y el salto si no ha sido inicializado previamente.
     */
    constructor();

    /**
     * Obtiene el salto (jump) utilizado para la encriptación.
     * Si no existe, genera uno nuevo.
     *
     * @returns {string} El salto generado o recuperado.
     */
    public getJump(): string;

    /**
     * Encripta un texto usando el mapa de caracteres y los valores calculados.
     *
     * @param {string} text - Texto a encriptar.
     * @returns {string} El texto encriptado.
     */
    public encrypt(text: string): string;

    /**
     * Desencripta un texto encriptado usando el mapa de caracteres y los valores calculados.
     *
     * @param {string} text - Texto encriptado a desencriptar.
     * @returns {string} El texto desencriptado (original).
     */
    public decrypt(text: string): string;
}

export default Encripted;


/**
 * Clase para encriptación y desencriptación de texto usando un algoritmo personalizado.
 */
declare class Encripted {
    private map: string[] | undefined;
    private static jump: string | null;

    constructor();

    public getJump(): string;

    public encrypt(text: string): string;

    public decrypt(text: string): string;

    // Métodos privados (no se exponen en la declaración pública)
    // private generateJump(): string;
    // private getSalt(leap: string): number;
    // private calculateValues(): { salt: number; jumpValue: number; modifier: number };
    // private errorMap(): CustomError | void;
}

export default Encripted;

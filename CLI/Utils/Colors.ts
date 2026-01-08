/**
 * Utilidades para colorear y formatear la salida de consola
 */
class Colors {
    // Colores básicos
    static reset = '\x1b[0m';
    static bold = '\x1b[1m';
    static dim = '\x1b[2m';

    // Colores de texto
    static black = '\x1b[30m';
    static red = '\x1b[31m';
    static green = '\x1b[32m';
    static yellow = '\x1b[33m';
    static blue = '\x1b[34m';
    static magenta = '\x1b[35m';
    static cyan = '\x1b[36m';
    static white = '\x1b[37m';
    static gray = '\x1b[90m';

    // Fondos
    static bgRed = '\x1b[41m';
    static bgGreen = '\x1b[42m';
    static bgYellow = '\x1b[43m';
    static bgBlue = '\x1b[44m';

    /**
     * Aplica color a un texto
     */
    static color(text: string, color: string): string {
        return `${color}${text}${this.reset}`;
    }

    /**
     * Texto en negrita
     */
    static b(text: string): string {
        return `${this.bold}${text}${this.reset}`;
    }

    /**
     * Línea divisoria
     */
    static line(char: string = '─', length: number = 100): string {
        return this.gray + char.repeat(length) + this.reset;
    }

    /**
     * Título con icono
     */
    static title(icon: string, text: string): string {
        return `\n${this.bold}${this.cyan}${icon} ${text}${this.reset}\n`;
    }

    /**
     * Mensaje de éxito
     */
    static success(text: string): string {
        return `${this.bold}${this.green}✅ ${text}${this.reset}`;
    }

    /**
     * Mensaje de error
     */
    static error(text: string): string {
        return `${this.bold}${this.red}❌ ${text}${this.reset}`;
    }

    /**
     * Mensaje de advertencia
     */
    static warning(text: string): string {
        return `${this.bold}${this.yellow}⚠️  ${text}${this.reset}`;
    }

    /**
     * Mensaje de información
     */
    static info(text: string): string {
        return `${this.bold}${this.blue}ℹ️  ${text}${this.reset}`;
    }

    /**
     * Item de lista
     */
    static listItem(icon: string, text: string): string {
        return `  ${this.bold}${this.green}${icon}${this.reset} ${this.white}${text}${this.reset}`;
    }

    /**
     * Comando o código
     */
    static code(text: string): string {
        return `${this.dim}${this.cyan}${text}${this.reset}`;
    }

    /**
     * Package name
     */
    static pkg(name: string): string {
        return `${this.bold}${this.magenta}${name}${this.reset}`;
    }
}

export default Colors;

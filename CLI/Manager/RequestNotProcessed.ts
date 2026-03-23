import path from "path";
import { fileURLToPath } from "url";
import CustomError from "../../packages/error/Error.ts";
import Files from "../../packages/files/Files.ts";
import { arrayEnd } from "../../packages/utils/ArrayUtils.ts";
import { searchCutEnd } from "../../packages/utils/StringUtils.ts";

// Obtener __dirname en ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class RequestNotProcessed {

    constructor() {
        Object.setPrototypeOf(this, RequestNotProcessed.prototype);
    }

    getCommands() {

        const COMMANDS = this.readFileRouter();

        // Mostrar título
        console.log('\n\x1b[1m\x1b[36m📋 Comandos Disponibles\x1b[0m\n');
        console.log('\x1b[90m' + '─'.repeat(100) + '\x1b[0m');

        // Mostrar encabezados
        console.log(`  \x1b[1m\x1b[33m${'Comando'.padEnd(15)}\x1b[0m \x1b[90m│\x1b[0m \x1b[1m\x1b[33mDescripción\x1b[0m`);
        console.log('\x1b[90m' + '─'.repeat(100) + '\x1b[0m');

        // Mostrar cada comando
        COMMANDS.forEach((cmd: any) => {
            console.log(`  \x1b[1m\x1b[32m${cmd.command.padEnd(15)}\x1b[0m \x1b[90m│\x1b[0m \x1b[37m${cmd.description}\x1b[0m`);
        });

        console.log('\x1b[90m' + '─'.repeat(100) + '\x1b[0m\n');
    }

    readFileRouter(): Object[] {

        const FILES = new Files();

        // Leemos el archivo de entrada usando ruta absoluta desde la ubicación del script
        const CLI_PATH = path.join(__dirname, '../index.ts');
        const CONTENT: string = FILES.read(CLI_PATH);

        if (CONTENT.length === 0)
            throw new CustomError('Archivo vacío');

        let copyDescription: string;

        const COMMANDS: Object[] = CONTENT?.split('\n')
            .filter(
                line => line.trim() && line.includes('case')
            ).map(
                line => {

                    const PARTS: string[] = line.split('"');

                    const COMMANT = PARTS[1];
                    const endPart = arrayEnd(PARTS);
                    const DESCRIPTION =
                        (endPart ? searchCutEnd(endPart, '//') : null) || copyDescription;
                    copyDescription = DESCRIPTION;

                    return {
                        command: COMMANT,
                        description: DESCRIPTION
                    }
                });

        return COMMANDS;
    }

}


export default RequestNotProcessed;

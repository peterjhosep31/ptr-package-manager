import CustomError from "../../src/Error/Error.ts";
import Files from "../../src/Files/Files.ts";
import path from "path";
import { fileURLToPath } from "url";

// Obtener __dirname en ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class RequestNotProcessed {

    constructor() {
        Object.setPrototypeOf(this, RequestNotProcessed.prototype);
    }

    getCommands() {

        const COMMANTS = this.readFileRouter();

        // Mostrar título
        console.log('\n\x1b[1m\x1b[36m📋 Comandos Disponibles\x1b[0m\n');
        console.log('\x1b[90m' + '─'.repeat(100) + '\x1b[0m');

        // Mostrar encabezados
        console.log(`  \x1b[1m\x1b[33m${'Comando'.padEnd(15)}\x1b[0m \x1b[90m│\x1b[0m \x1b[1m\x1b[33mDescripción\x1b[0m`);
        console.log('\x1b[90m' + '─'.repeat(100) + '\x1b[0m');

        // Mostrar cada comando
        COMMANTS.forEach((cmd: any) => {
            console.log(`  \x1b[1m\x1b[32m${cmd.commant.padEnd(15)}\x1b[0m \x1b[90m│\x1b[0m \x1b[37m${cmd.description}\x1b[0m`);
        });

        console.log('\x1b[90m' + '─'.repeat(100) + '\x1b[0m\n');
    }

    readFileRouter(): Object[] {

        const FILES = new Files();

        // Leemos el archivo de entrada usando ruta absoluta desde la ubicación del script
        const CLI_PATH = path.join(__dirname, '../index.ts');
        const CONTENTED: string = FILES.readFile(CLI_PATH);

        if (CONTENTED.length === 0)
            throw new CustomError('Archivo vacío');

        let copyDescription: string;

        const COMMANTS: Object[] = CONTENTED?.split('\n')
            .filter(
                line => line.trim() && line.includes('case')
            ).map(
                line => {

                    const PARTS: string[] = line.split('"');

                    const COMMANT = PARTS[1];
                    const DESCRIPTION =
                        PARTS.end()?.searchCutEnd('//') || copyDescription;
                    copyDescription = DESCRIPTION;

                    return {
                        commant: COMMANT,
                        description: DESCRIPTION
                    }
                });

        return COMMANTS;
    }

}


export default RequestNotProcessed;

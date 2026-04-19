export interface CommandDefinition {
    command: string;
    description: string;
}

class RequestNotProcessed {

    private static readonly COMMAND_LIST: CommandDefinition[] = [
        { command: "--help, -h", description: "Comando de ayuda: Muestra todos los comandos disponibles" },
        { command: "init, --I", description: "Comando de inicialización: Crea un nuevo proyecto" },
        { command: "install, -i", description: "Comando de instalación: Instala un paquete y sus dependencias" },
        { command: "uninstall, -u", description: "Comando de desinstalación: Remueve un paquete" },
        { command: "list, -l", description: "Comando de listado: Muestra paquetes instalados o disponibles" },
        { command: "search, -s", description: "Comando de búsqueda: Busca paquetes en el registro" },
        { command: "config", description: "Comando de configuración: Gestiona la configuración de PTR" }
    ];

    constructor() {
    }

    getCommands() {
        // Mostrar título
        console.log('\n\x1b[1m\x1b[36m📋 Comandos Disponibles\x1b[0m\n');
        console.log('\x1b[90m' + '─'.repeat(100) + '\x1b[0m');

        // Mostrar encabezados
        console.log(`  \x1b[1m\x1b[33m${'Comando'.padEnd(15)}\x1b[0m \x1b[90m│\x1b[0m \x1b[1m\x1b[33mDescripción\x1b[0m`);
        console.log('\x1b[90m' + '─'.repeat(100) + '\x1b[0m');

        // Mostrar cada comando
        RequestNotProcessed.COMMAND_LIST.forEach((cmd: CommandDefinition) => {
            console.log(`  \x1b[1m\x1b[32m${cmd.command.padEnd(15)}\x1b[0m \x1b[90m│\x1b[0m \x1b[37m${cmd.description}\x1b[0m`);
        });

        console.log('\x1b[90m' + '─'.repeat(100) + '\x1b[0m\n');
    }

}

export default RequestNotProcessed;

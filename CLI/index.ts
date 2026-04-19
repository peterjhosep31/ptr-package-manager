#!/usr/bin/env node

import PackageManager from "./Manager/PackageManager.ts";
import ProjectInitialize from "./Manager/ProjectInitialize.ts";
import RequestNotProcessed from "./Manager/RequestNotProcessed.ts";
import SystemChecker from "./Manager/SystemChecker.ts";
import Colors from "./Utils/Colors.ts";
import Config from "./Utils/Config.ts";

(async () => {
    let args = process.argv.slice(2);
    let command = args[0];
    args = args.slice(1);

    if (!!command === false) {
        console.log(Colors.warning("Debe proporcionar un comando"));
        console.log(`  ${Colors.dim}Ejecute ${Colors.code("ptr --help")} para ver los comandos disponibles${Colors.reset}\n`);
        return;
    }

    command = command.toLowerCase();

    const packageManager = new PackageManager();
    const systemChecker = new SystemChecker();
    const config = new Config();

    switch (command) {

        case "--help": // Comando de ayuda: Muestra todos los comandos disponibles
        case "-h":
            (new RequestNotProcessed()).getCommands();
            break;

        case "init": // Comando de inicialización: Crea un nuevo proyecto
        case "--I":
            try {
                // Verificar que Node.js esté instalado en el sistema
                if (!(await systemChecker.requireNode())) {
                    break;
                }

                const projectName = args[0]; // Opcional: nombre del proyecto
                const initializer = new ProjectInitialize(projectName);
                await initializer.init();
            } catch (error) {
                console.log(Colors.error((error as Error).message) + "\n");
            }
            break;

        case "install": // Comando de instalación: Instala un paquete y sus dependencias
        case "-i":
            // Verificar que Node.js esté instalado y que exista package.json
            if (!(await systemChecker.requireProjectInitialized())) {
                break;
            }

            if (args.length === 0) {
                console.log(Colors.error("Debe especificar un paquete a instalar"));
                console.log(`  ${Colors.dim}Uso: ${Colors.code("ptr install <package-name> [version]")}${Colors.reset}\n`);
                break;
            }
            try {
                const packageName = args[0]!;
                const version = args[1] || "latest";
                packageManager.install(packageName, version);
            } catch (error) {
                console.log(Colors.error((error as Error).message) + "\n");
            }
            break;

        case "uninstall": // Comando de desinstalación: Remueve un paquete
        case "-u":
            // Verificar que Node.js esté instalado y que exista package.json
            if (!(await systemChecker.requireNode())) {
                break;
            }

            if (args.length === 0) {
                console.log(Colors.error("Debe especificar un paquete a desinstalar"));
                console.log(`  ${Colors.dim}Uso: ${Colors.code("ptr uninstall <package-name>")}${Colors.reset}\n`);
                break;
            }
            try {
                packageManager.uninstall(args[0]!);
            } catch (error) {
                console.log(Colors.error((error as Error).message) + "\n");
            }
            break;

        case "list": // Comando de listado: Muestra paquetes instalados o disponibles
        case "-l":
            if (args[0] === "available" || args[0] === "-a") {
                packageManager.listAvailable();
            } else {
                packageManager.listInstalled();
            }
            break;

        case "search": // Comando de búsqueda: Busca paquetes en el registro
        case "-s":
            packageManager.listAvailable();
            break;

        case "config": // Comando de configuración: Gestiona la configuración de PTR
            if (args.length === 0) {
                // Mostrar configuración actual
                const currentConfig = config.read();
                console.log(Colors.title("⚙️", "Configuración actual de PTR"));
                console.log(Colors.line());
                console.log(`  ${Colors.cyan}Registry:${Colors.reset} ${currentConfig.registry}`);
                if (currentConfig.remoteUrl) {
                    console.log(`  ${Colors.cyan}URL:${Colors.reset} ${currentConfig.remoteUrl}`);
                }
                console.log("");
                break;
            }

            const subcommand = args[0];
            switch (subcommand) {
                case "set-remote":
                    if (args.length < 2) {
                        console.log(Colors.error("Debe especificar una URL"));
                        console.log(`  ${Colors.dim}Uso: ${Colors.code("ptr config set-remote <url>")}${Colors.reset}\n`);
                        break;
                    }
                    try {
                        config.setRemoteRegistry(args[1]!);
                        console.log(Colors.success(`Registry remoto configurado: ${args[1]}`));
                        console.log(`  ${Colors.dim}Ahora ${Colors.code("ptr install")} descargará desde este servidor${Colors.reset}\n`);
                    } catch (error) {
                        console.log(Colors.error((error as Error).message) + "\n");
                    }
                    break;

                case "set-local":
                    try {
                        config.setLocalRegistry();
                        console.log(Colors.success("Registry local configurado"));
                        console.log(`  ${Colors.dim}Ahora ${Colors.code("ptr install")} usará paquetes locales${Colors.reset}\n`);
                    } catch (error) {
                        console.log(Colors.error((error as Error).message) + "\n");
                    }
                    break;

                default:
                    console.log(Colors.error(`Subcomando desconocido: ${subcommand}`));
                    console.log(`  ${Colors.dim}Opciones disponibles:${Colors.reset}`);
                    console.log(`    ${Colors.code("ptr config")} - Ver configuración actual`);
                    console.log(`    ${Colors.code("ptr config set-remote <url>")} - Usar registry remoto`);
                    console.log(`    ${Colors.code("ptr config set-local")} - Usar registry local\n`);
            }
            break;

        default:
            console.log(Colors.error("Comando desconocido"));
            console.log(`  ${Colors.dim}Ejecute ${Colors.code("ptr --help")} para ver los comandos disponibles${Colors.reset}\n`);
            return;
    }
})();

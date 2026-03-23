import { exec } from "child_process";
import path from "path";
import { promisify } from "util";
import Directory from "../../packages/directory/Directory.ts";
import Colors from "../Utils/Colors.ts";

const execAsync = promisify(exec);

class SystemChecker {

    private DIRECTORY: Directory;

    constructor() {
        this.DIRECTORY = new Directory();
    }

    /**
     * Verifica si Node.js está instalado en el sistema
     */
    public async checkNodeInstalled(): Promise<{ installed: boolean; version?: string }> {
        try {
            const { stdout } = await execAsync("node --version");
            const version = stdout.trim();
            return { installed: true, version };
        } catch (error) {
            return { installed: false };
        }
    }

    /**
     * Verifica si el proyecto está inicializado con PTR
     * @returns true si existe ptr.json, false si no
     */
    public checkProjectInitialized(
        projectPath: string = process.cwd()
    ): boolean {
        const ptrJsonPath = path.join(projectPath, "ptr.json");
        return this.DIRECTORY.exists(ptrJsonPath);
    }

    /**
     * Muestra mensaje cuando el proyecto no está inicializado
     */
    public showProjectNotInitializedMessage(): void {
        console.log(Colors.title("⚠️", "Proyecto no inicializado"));
        console.log(Colors.line());
        console.log(`  ${Colors.white}Este directorio no tiene un proyecto PTR configurado.${Colors.reset}`);
        console.log("");
        console.log(Colors.listItem("📋", `Inicializa tu proyecto primero:`));
        console.log(`     ${Colors.code("ptr init")}  ${Colors.dim}# Crea un nuevo proyecto PTR${Colors.reset}`);
        console.log("");
        console.log(Colors.listItem("ℹ️", `O consulta la ayuda:`));
        console.log(`     ${Colors.code("ptr --help")}  ${Colors.dim}# Ver todos los comandos disponibles${Colors.reset}`);
        console.log("");
    }

    /**
     * Verifica si el proyecto actual utiliza Node.js
     * Busca package.json en el directorio actual
     */
    public checkProjectUsesNode(
        projectPath: string = process.cwd()
    ): boolean {
        const packageJsonPath = path.join(projectPath, "package.json");

        // Si existe package.json, es un proyecto Node.js
        return this.DIRECTORY.exists(packageJsonPath);
    }

    /**
     * Muestra mensaje cuando el proyecto no usa Node.js
     */
    public showProjectNotNodeMessage(): void {
        console.log(Colors.title("⚠️", "Este proyecto no está configurado para usar Node.js"));
        console.log(Colors.line());
        console.log(`  ${Colors.white}Los paquetes PTR están basados en Node.js.${Colors.reset}`);
        console.log(Colors.title("📋", "Tienes dos opciones:"));
        console.log(Colors.listItem("1️⃣", `Configurar el proyecto para Node.js:`));
        console.log(`     ${Colors.code("ptr init")}  ${Colors.dim}# Inicializa un proyecto con Node.js${Colors.reset}`);
        console.log("");
        console.log(Colors.listItem("2️⃣", `Usar PTR Server (HTTP API):`));
        console.log(`     Si prefieres no usar Node.js en tu proyecto,`);
        console.log(`     puedes acceder a los paquetes mediante peticiones HTTP.`);
        console.log(`     Ejecuta: ${Colors.code("ptr server start")}`);
        console.log("");
    }

    /**
     * Muestra mensaje cuando Node.js no está instalado
     */
    public showNodeNotInstalledMessage(): void {
        console.log(Colors.title("⚠️", "Node.js no está instalado en tu sistema"));
        console.log(Colors.line());
        console.log(`  ${Colors.white}Los paquetes PTR están basados en Node.js y requieren que esté instalado.${Colors.reset}`);
        // console.log(Colors.title("📋", "Tienes dos opciones:"));
        console.log(Colors.listItem("1️⃣", `Instalar Node.js:`));
        console.log(`     Visita: ${Colors.cyan}https://nodejs.org/${Colors.reset}`);
        console.log("");
        // console.log(Colors.listItem("2️⃣", `Usar PTR Server (HTTP API):`));
        // console.log(`     Si prefieres usar los paquetes sin instalar Node.js,`);
        // console.log(`     puedes acceder a ellos mediante peticiones HTTP.`);
        // console.log(`     Ejecuta: ${Colors.code("ptr server start")}`);
        console.log("");
    }

    /**
     * Verifica que el proyecto esté inicializado antes de instalar paquetes
     * @returns true si el proyecto está inicializado, false si no
     */
    public async requireProjectInitialized(
        projectPath: string = process.cwd()
    ): Promise<boolean> {
        // 1. Verificar si el proyecto está inicializado
        if (!this.checkProjectInitialized(projectPath)) {
            this.showProjectNotInitializedMessage();
            return false;
        }

        // 2. Verificar si Node.js está instalado en el sistema
        const { installed, version } = await this.checkNodeInstalled();

        if (!installed) {
            this.showNodeNotInstalledMessage();
            return false;
        }

        console.log(Colors.success(`Node.js ${version} detectado`) + "\n");
        return true;
    }

    /**
     * Verifica Node.js en sistema y proyecto
     * @returns true si todo está OK, false si no
     */
    public async requireNode(
        projectPath: string = process.cwd()
    ): Promise<boolean> {
        // 1. Verificar si Node está instalado en el sistema
        const { installed, version } = await this.checkNodeInstalled();

        if (!installed) {
            this.showNodeNotInstalledMessage();
            return false;
        }

        // 2. Verificar si el proyecto usa Node.js
        const projectUsesNode = this.checkProjectUsesNode(projectPath);

        if (!projectUsesNode) {
            this.showProjectNotNodeMessage();
            return false;
        }

        console.log(Colors.success(`Node.js ${version} detectado`) + "\n");
        return true;
    }
}

export default SystemChecker;

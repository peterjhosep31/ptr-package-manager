import path from "path";
import Directory from "../../packages/directory/Directory.ts";
import Files from "../../packages/files/Files.ts";
import Colors from "../Utils/Colors.ts";
import type { ProjectConfig } from "./interface/ProjectConfig.ts";

class ProjectInitialize {
    private projectPath: string;
    private projectName: string;

    private DIRECTORY: Directory;
    private FILES: Files;

    constructor(projectName?: string) {

        this.DIRECTORY = new Directory();
        this.FILES = new Files();
        this.projectName =
            projectName || this.DIRECTORY.baseName(process.cwd());
        this.projectPath = projectName
            ? path.join(process.cwd(), projectName)
            : process.cwd();
    }

    /**
     * Inicializa un nuevo proyecto PTR
     */
    public async init(): Promise<void> {
        console.log(Colors.title("🚀", `Inicializando proyecto PTR: ${Colors.cyan}${this.projectName}${Colors.reset}`));
        console.log(Colors.line());

        try {

            // Crear directorio del proyecto si no existe
            if (!this.DIRECTORY.exists(this.projectPath)) {

                this.DIRECTORY.exists(this.projectPath, true);
                console.log(Colors.listItem("✅", `Directorio creado: ${Colors.cyan}${this.projectName}/${Colors.reset}`));

            } else if (this.DIRECTORY.exists(this.projectPath)) {
                // Si el directorio existe y no está vacío, preguntar
                const contents = this.DIRECTORY.getDirectoryContents(this.projectPath);
                const isEmpty = contents.directories.length === 0 && contents.files.length === 0;
                if (!isEmpty) {
                    console.log(Colors.warning(`El directorio ya existe y contiene archivos.`));
                }
            }

            // Crear estructura de carpetas
            this.createFolderStructure();

            // Crear ptr.json
            this.createPtrJson();

            // Crear archivos de ejemplo
            this.createExampleFiles();

            // Crear .gitignore
            this.createGitignore();

            console.log("");
            console.log(Colors.success("Proyecto inicializado correctamente!"));
            console.log(Colors.title("📦", "Próximos pasos:"));
            if (this.projectPath !== process.cwd()) {
                console.log(Colors.listItem("📂", Colors.code(`cd ${this.projectName}`)));
            }
            console.log(Colors.listItem("📦", `${Colors.code("ptr install <package>")}  ${Colors.dim}# Instalar paquetes${Colors.reset}`));
            console.log(Colors.listItem("📚", `${Colors.code("ptr list available")}     ${Colors.dim}# Ver paquetes disponibles${Colors.reset}`));
            console.log("");

        } catch (error) {
            console.log("");
            console.log(Colors.error("Error al inicializar proyecto: " + (error as Error).message));
            throw error;
        }
    }

    /**
     * Crea la estructura de carpetas del proyecto
     */
    private createFolderStructure(): void {
        const folders = ['src', 'tests'];

        folders.forEach(folder => {
            const folderPath = path.join(this.projectPath, folder);
            if (!this.DIRECTORY.exists(folderPath)) {
                this.DIRECTORY.exists(folderPath, true);
                console.log(`  ${Colors.gray}\u251c\u2500${Colors.reset} ${Colors.cyan}${folder}/${Colors.reset}`);
            }
        });
    }

    /**
     * Crea el archivo ptr.json del proyecto
     */
    private createPtrJson(): void {
        const ptrJsonPath = path.join(this.projectPath, 'ptr.json');

        if (this.DIRECTORY.exists(ptrJsonPath)) {
            console.log(`  ${Colors.gray}├─${Colors.reset} ${Colors.cyan}ptr.json${Colors.reset} ${Colors.dim}(ya existe)${Colors.reset}`);
            return;
        }

        const config: ProjectConfig = {
            name: this.projectName,
            version: '1.0.0',
            description: '',
            main: 'src/index.ts',
            author: '',
            license: 'ISC',
            dependencies: {}
        };

        this.FILES.write(ptrJsonPath, JSON.stringify(config, null, 2));
        console.log(`  ${Colors.gray}├─${Colors.reset} ${Colors.cyan}ptr.json${Colors.reset}`);
    }

    /**
     * Crea archivos de ejemplo
     */
    private createExampleFiles(): void {
        // Crear src/index.ts
        const indexPath = path.join(this.projectPath, 'src', 'index.ts');
        if (!this.DIRECTORY.exists(indexPath)) {
            const indexContent = `// Bienvenido a tu proyecto PTR
console.log("¡Hola desde ${this.projectName}!");

// Importa y usa paquetes PTR aquí
// Ejemplo: import Files from "ptr_modules/files/Files";
`;
            this.FILES.write(indexPath, indexContent);
            console.log(`  ${Colors.gray}├─${Colors.reset} ${Colors.cyan}src/index.ts${Colors.reset}`);
        }

        // Crear README.md
        const readmePath = path.join(this.projectPath, 'README.md');
        if (!this.DIRECTORY.exists(readmePath)) {
            const readmeContent = `# ${this.projectName}

Proyecto creado con PTR Package Manager.

## Instalación de paquetes

\`\`\`bash
# Ver paquetes disponibles
ptr list available

# Instalar un paquete
ptr install <package-name>

# Ver paquetes instalados
ptr list
\`\`\`

## Uso

\`\`\`bash
# Ejecutar tu proyecto
node src/index.ts
\`\`\`
`;
            this.FILES.write(readmePath, readmeContent);
            console.log(`  ${Colors.gray}├─${Colors.reset} ${Colors.cyan}README.md${Colors.reset}`);
        }
    }

    /**
     * Crea archivo .gitignore
     */
    private createGitignore(): void {
        const gitignorePath = path.join(this.projectPath, '.gitignore');

        if (this.DIRECTORY.exists(gitignorePath)) {
            console.log(`  ${Colors.gray}└─${Colors.reset} ${Colors.cyan}.gitignore${Colors.reset} ${Colors.dim}(ya existe)${Colors.reset}`);
            return;
        }

        const gitignoreContent =
            `# PTR modules
ptr_modules/
ptr-lock.json

# Logs
*.log
npm-debug.log*

# Environment variables
.env
.env.local

# Editor directories
.vscode/
.idea/

# OS
.DS_Store
Thumbs.db
`;

        this.FILES.write(gitignorePath, gitignoreContent);
        console.log(`  ${Colors.gray}└─${Colors.reset} ${Colors.cyan}.gitignore${Colors.reset}`);
    }
}

export default ProjectInitialize;

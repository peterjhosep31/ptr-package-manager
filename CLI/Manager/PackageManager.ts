import path from "path";
import { fileURLToPath } from "url";

import Colors from "../Utils/Colors.ts";
import Config from "../Utils/Config.ts";

import type { PtrManifest } from "./interface/PtrManifest.ts";
import type { Registry } from "./interface/Registry.ts";
import type { ProjectConfig } from "./interface/ProjectConfig.ts";

import Directory from "../../packages/directory/Directory.ts";
import Files from "../../packages/files/Files.ts";

// Obtener __dirname en ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Gestor de paquetes PTR
 * Maneja la instalación, desinstalación y listado de paquetes
 */
class PackageManager {
    private registryPath: string;
    private installedDir: string;
    private projectRoot: string;
    private config: Config;

    private FILES: Files;
    private DIRECTORY: Directory;

    constructor(projectRoot?: string) {

        this.FILES = new Files();
        this.DIRECTORY = new Directory();

        this.projectRoot = projectRoot || process.cwd();
        this.registryPath = path.join(__dirname, "../../registry.json");
        this.installedDir = path.join(this.projectRoot, "ptr_modules");
        this.config = new Config();
    }

    /**
     * Lee el registro de paquetes disponibles
     */
    private readRegistry(): Registry {
        if (!this.DIRECTORY.exists(this.registryPath)) {
            throw new Error("Registry not found. PTR system is corrupted.");
        }
        return JSON.parse(this.FILES.read(this.registryPath));
    }

    /**
     * Lee el manifiesto ptr.json de un paquete
     */
    private readManifest(packagePath: string): PtrManifest {
        const manifestPath = path.join(packagePath, "ptr.json");
        if (!this.DIRECTORY.exists(manifestPath)) {
            throw new Error(`Manifest not found in ${packagePath}`);
        }
        return JSON.parse(this.FILES.read(manifestPath));
    }

    /**
     * Lee el manifiesto ptr.json del proyecto
     */
    private readProjectManifest(): ProjectConfig | null {
        const manifestPath = path.join(this.projectRoot, "ptr.json");
        
        if (!this.DIRECTORY.exists(manifestPath)) {
            return null;
        }
        
        try {
            return JSON.parse(this.FILES.read(manifestPath));
        } catch (error) {
            console.log(Colors.warning("Error al leer ptr.json del proyecto"));
            return null;
        }
    }

    /**
     * Escribe el manifiesto ptr.json del proyecto
     */
    private writeProjectManifest(manifest: ProjectConfig): void {
        const manifestPath = path.join(this.projectRoot, "ptr.json");
        this.FILES.write(manifestPath, JSON.stringify(manifest, null, 2));
    }

    /**
     * Lee el manifiesto ptr-lock.json del proyecto
     */
    private readLockFile(): Record<string, string> {
        const lockPath = path.join(this.projectRoot, "ptr-lock.json");
        
        if (!this.DIRECTORY.exists(lockPath)) {
            return {};
        }
        
        try {
            const lockFile = JSON.parse(this.FILES.read(lockPath));
            return lockFile.installed || {};
        } catch (error) {
            console.log(Colors.warning("Error al leer ptr-lock.json, creando uno nuevo"));
            return {};
        }
    }

    /**
     * Escribe el manifiesto ptr-lock.json del proyecto
     */
    private writeLockFile(installed: Record<string, string>): void {
        const lockPath = path.join(this.projectRoot, "ptr-lock.json");
        const lockContent = {
            version: "1.0.0",
            installed,
            generated: new Date().toISOString()
        };
        this.FILES.write(lockPath, JSON.stringify(lockContent, null, 2));
    }

    /**
     * Descarga un paquete desde el servidor remoto
     */
    private async downloadPackage(packageName: string, version: string): Promise<void> {
        const remoteUrl = this.config.getRegistryUrl();
        if (!remoteUrl) {
            throw new Error("No se ha configurado una URL remota");
        }

        const url = `${remoteUrl}/api/packages/${packageName}/${version}/download`;

        console.log(Colors.info(`  Descargando desde ${url}...`));

        try {
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json() as {
                success: boolean;
                name: string;
                version: string;
                dependencies: Record<string, string>;
                files: Record<string, string>;
                manifest: PtrManifest;
            };

            if (!data.success) {
                throw new Error("Error en la respuesta del servidor");
            }

            // Crear directorio del paquete
            const destPath = path.join(this.installedDir, packageName);
            this.DIRECTORY.exists(destPath, true);

            // Escribir todos los archivos
            for (const [filename, content] of Object.entries(data.files)) {
                const filePath = path.join(destPath, filename);
                const fileDir = path.dirname(filePath);

                this.DIRECTORY.exists(fileDir, true);

                this.FILES.write(filePath, content);
            }

            // Escribir el manifiesto
            this.FILES.write(
                path.join(destPath, "ptr.json"),
                JSON.stringify(data.manifest, null, 2),
            );

            console.log(Colors.success(`  ✓ ${packageName}@${version} descargado`));

        } catch (error) {
            throw new Error(`Error al descargar ${packageName}: ${(error as Error).message}`);
        }
    }

    /**
     * Copia un paquete al directorio ptr_modules
     */
    private copyPackage(sourcePath: string, destPath: string): void {
        // Crear directorio del paquete si no existe
        this.DIRECTORY.exists(destPath, true);

        const manifest = this.readManifest(sourcePath);

        // Copiar archivos especificados en el manifiesto
        for (const file of manifest.files) {
            const srcFile = path.join(sourcePath, file);
            const destFile = path.join(destPath, file);

            // Verificar si es un directorio intentando obtener su contenido
            try {
                this.DIRECTORY.getDirectoryContents(srcFile);
                // Si no lanza error, es un directorio
                this.copyDirectory(srcFile, destFile);
            } catch {
                // Si lanza error, es un archivo
                // Crear el directorio padre del archivo si no existe
                const destFileDir = path.dirname(destFile);
                this.DIRECTORY.exists(destFileDir, true);
                this.FILES.copy(srcFile, destFile);
            }
        }

        // Copiar el manifiesto
        this.FILES.copy(
            path.join(sourcePath, "ptr.json"),
            path.join(destPath, "ptr.json")
        );
    }

    /**
     * Copia un directorio recursivamente
     */
    private copyDirectory(source: string, destination: string): void {
        // Crear directorio de destino si no existe
        this.DIRECTORY.exists(destination, true);

        const dirContents = this.DIRECTORY.getDirectoryContents(source);

        // Copiar todos los subdirectorios
        for (const dir of dirContents.directories) {
            const dirName = path.basename(dir);
            const destPath = path.join(destination, dirName);
            this.copyDirectory(dir, destPath);
        }

        // Copiar todos los archivos
        for (const file of dirContents.files) {
            const fileName = path.basename(file);
            const destPath = path.join(destination, fileName);
            this.FILES.copy(file, destPath);
        }
    }

    /**
     * Resuelve las dependencias de un paquete recursivamente
     */
    private resolveDependencies(
        packageName: string,
        version: string,
        resolved: Map<string, string> = new Map()
    ): Map<string, string> {
        // Si ya está resuelto, evitar ciclos
        if (resolved.has(packageName)) {
            return resolved;
        }

        const registry = this.readRegistry();
        const pkg = registry.packages[packageName];

        if (!pkg) {
            throw new Error(`Package ${packageName} not found in registry`);
        }

        const pkgVersion = pkg.versions[version] || pkg.versions[pkg.latest];
        if (!pkgVersion) {
            throw new Error(`Version ${version} of ${packageName} not found`);
        }

        resolved.set(packageName, pkgVersion.path);

        // Resolver dependencias recursivamente
        for (const [depName, depVersion] of Object.entries(pkgVersion.dependencies)) {
            this.resolveDependencies(depName, depVersion, resolved);
        }

        return resolved;
    }

    /**
     * Instala un paquete y sus dependencias
     */
    public async install(
        packageName: string,
        version: string = "latest"
    ): Promise<void> {
        const isRemote = this.config.isRemote();
        const source = isRemote ? "remoto" : "local";

        console.log(Colors.title("📦", `Instalando ${Colors.pkg(packageName)}@${version} (${source})...`));

        if (isRemote) {
            // Instalación desde servidor remoto
            await this.installRemote(packageName, version);
        } else {
            // Instalación local
            this.installLocal(packageName, version);
        }
    }

    /**
     * Instalación desde servidor remoto
     */
    private async installRemote(packageName: string, version: string): Promise<void> {
        try {
            await this.downloadPackage(packageName, version);

            // Leer el manifiesto descargado para obtener dependencias
            const destPath = path.join(this.installedDir, packageName);
            const manifest = this.readManifest(destPath);

            // Leer paquetes ya instalados
            const installed: Record<string, string> = this.readLockFile();
            
            // Registrar el paquete principal
            installed[packageName] = manifest.version;

            // Instalar dependencias recursivamente
            if (manifest.dependencies && Object.keys(manifest.dependencies).length > 0) {
                console.log(Colors.info(`\n  Instalando dependencias de ${packageName}...`));

                for (const [depName, depVersion] of Object.entries(manifest.dependencies)) {
                    await this.downloadPackage(depName, depVersion);
                    const depDestPath = path.join(this.installedDir, depName);
                    const depManifest = this.readManifest(depDestPath);
                    installed[depName] = depManifest.version;
                }
            }

            // Actualizar ptr.json del proyecto
            const projectManifest = this.readProjectManifest();
            if (projectManifest) {
                projectManifest.dependencies[packageName] = version;
                this.writeProjectManifest(projectManifest);
            } else {
                console.log(Colors.warning("\n⚠️  Advertencia: ptr.json no encontrado. Las dependencias no se registrarán en el manifiesto del proyecto."));
                console.log(Colors.dim + "   Ejecuta 'ptr init' para crear un proyecto PTR" + Colors.reset + "\n");
            }

            // Escribir lock file con todos los paquetes (anteriores + nuevos)
            this.writeLockFile(installed);

            console.log(Colors.success(`\n✅ ${packageName}@${version} instalado correctamente\n`));

        } catch (error) {
            throw new Error(`Error en instalación remota: ${(error as Error).message}`);
        }
    }

    /**
     * Instalación local
     */
    private installLocal(packageName: string, version: string): void {

        const registry = this.readRegistry();
        const pkg = registry.packages[packageName];

        if (!pkg) {
            throw new Error(`Package ${packageName} not found in registry`);
        }

        const targetVersion = version === "latest" ? pkg.latest : version;

        // Asegurar que el directorio ptr_modules existe
        this.DIRECTORY.exists(this.installedDir, true);

        // Resolver todas las dependencias
        const dependencies = this.resolveDependencies(packageName, targetVersion);

        // Leer paquetes ya instalados
        const installed: Record<string, string> = this.readLockFile();
        
        // Instalar cada paquete
        for (const [pkgName, pkgPath] of dependencies) {
            const sourcePath = path.join(__dirname, "../..", pkgPath);
            const destPath = path.join(this.installedDir, pkgName);

            console.log(`  ${Colors.gray}├─${Colors.reset} Instalando ${Colors.pkg(pkgName)}...`);
            this.copyPackage(sourcePath, destPath);

            const manifest = this.readManifest(sourcePath);
            installed[pkgName] = manifest.version;
        }

        // Actualizar ptr.json del proyecto
        const projectManifest = this.readProjectManifest();
        if (projectManifest) {
            projectManifest.dependencies[packageName] = version;
            this.writeProjectManifest(projectManifest);
        } else {
            console.log(Colors.warning("\n⚠️  Advertencia: ptr.json no encontrado. Las dependencias no se registrarán en el manifiesto del proyecto."));
            console.log(Colors.dim + "   Ejecuta 'ptr init' para crear un proyecto PTR" + Colors.reset + "\n");
        }

        // Escribir lock file con todos los paquetes (anteriores + nuevos)
        this.writeLockFile(installed);

        const depCount = dependencies.size - 1;
        const depMsg = depCount > 0 ? ` y ${Colors.yellow}${depCount}${Colors.reset} dependencia${depCount > 1 ? 's' : ''}` : '';
        console.log(`\n${Colors.success(`Instalado ${Colors.pkg(packageName)}${depMsg} correctamente`)}\n`);
    }

    /**
     * Desinstala un paquete
     */
    public uninstall(packageName: string): void {
        console.log(Colors.title("🗑️", `Desinstalando ${Colors.pkg(packageName)}...`));

        const packagePath = path.join(this.installedDir, packageName);

        if (!this.DIRECTORY.exists(packagePath)) {
            throw new Error(`Package ${packageName} is not installed`);
        }

        // Eliminar recursivamente usando Directory
        this.DIRECTORY.deleteDirectory(packagePath);

        // Actualizar ptr.json del proyecto
        const projectManifest = this.readProjectManifest();
        if (projectManifest && projectManifest.dependencies[packageName]) {
            delete projectManifest.dependencies[packageName];
            this.writeProjectManifest(projectManifest);
        }

        // Leer paquetes instalados y eliminar el desinstalado
        const installed = this.readLockFile();
        delete installed[packageName];

        // Actualizar lock file
        this.writeLockFile(installed);

        console.log(Colors.success(`Desinstalado ${Colors.pkg(packageName)} correctamente`) + "\n");
    }

    /**
     * Lista todos los paquetes disponibles en el registro
     */
    public listAvailable(): void {
        const registry = this.readRegistry();

        console.log(Colors.title("📚", "Paquetes PTR Disponibles"));
        console.log(Colors.line());

        for (const [name, pkg] of Object.entries(registry.packages)) {
            console.log(`  ${Colors.pkg(name)}${Colors.gray}@${pkg.latest}${Colors.reset}`);
            const pkgInfo = pkg.versions[pkg.latest];
            if (pkgInfo) {
                if (Object.keys(pkgInfo.dependencies).length > 0) {
                    const deps = Object.keys(pkgInfo.dependencies);
                    console.log(`    ${Colors.dim}Dependencias: ${deps.map(d => Colors.yellow + d + Colors.reset).join(", ")}${Colors.reset}`);
                }
            }
        }
        console.log("");
    }

    /**
     * Lista todos los paquetes instalados
     */
    public listInstalled(): void {
        const lockPath = path.join(this.projectRoot, "ptr-lock.json");

        if (!this.DIRECTORY.exists(lockPath)) {
            console.log(Colors.warning("No hay paquetes instalados aún") + "\n");
            return;
        }

        const lockFile = JSON.parse(this.FILES.read(lockPath));

        console.log(Colors.title("📦", "Paquetes PTR Instalados"));
        console.log(Colors.line());

        for (const [name, version] of Object.entries(lockFile.installed)) {
            console.log(`  ${Colors.pkg(name)}${Colors.gray}@${version}${Colors.reset}`);
        }
        console.log("");
    }
}

export default PackageManager;

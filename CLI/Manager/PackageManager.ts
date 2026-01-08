import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import Colors from "../Utils/Colors.ts";
import Config from "../Utils/Config.ts";

// Obtener __dirname en ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Interfaz para el manifiesto ptr.json de cada paquete
 */
interface PtrManifest {
    name: string;
    version: string;
    description: string;
    main: string;
    author: string;
    license: string;
    dependencies: Record<string, string>;
    files: string[];
}

/**
 * Interfaz para el registro de paquetes
 */
interface Registry {
    packages: Record<string, {
        versions: Record<string, {
            path: string;
            dependencies: Record<string, string>;
            published: string;
        }>;
        latest: string;
    }>;
}

/**
 * Gestor de paquetes PTR
 * Maneja la instalación, desinstalación y listado de paquetes
 */
class PackageManager {
    private registryPath: string;
    private packagesDir: string;
    private installedDir: string;
    private projectRoot: string;
    private config: Config;

    constructor(projectRoot?: string) {
        this.projectRoot = projectRoot || process.cwd();
        this.registryPath = path.join(__dirname, "../../registry.json");
        this.packagesDir = path.join(__dirname, "../../packages");
        this.installedDir = path.join(this.projectRoot, "ptr_modules");
        this.config = new Config();
    }

    /**
     * Lee el registro de paquetes disponibles
     */
    private readRegistry(): Registry {
        if (!fs.existsSync(this.registryPath)) {
            throw new Error("Registry not found. PTR system is corrupted.");
        }
        return JSON.parse(fs.readFileSync(this.registryPath, "utf-8"));
    }

    /**
     * Lee el manifiesto ptr.json de un paquete
     */
    private readManifest(packagePath: string): PtrManifest {
        const manifestPath = path.join(packagePath, "ptr.json");
        if (!fs.existsSync(manifestPath)) {
            throw new Error(`Manifest not found in ${packagePath}`);
        }
        return JSON.parse(fs.readFileSync(manifestPath, "utf-8"));
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
        fs.writeFileSync(lockPath, JSON.stringify(lockContent, null, 2));
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
            if (!fs.existsSync(destPath)) {
                fs.mkdirSync(destPath, { recursive: true });
            }

            // Escribir todos los archivos
            for (const [filename, content] of Object.entries(data.files)) {
                const filePath = path.join(destPath, filename);
                const fileDir = path.dirname(filePath);

                if (!fs.existsSync(fileDir)) {
                    fs.mkdirSync(fileDir, { recursive: true });
                }

                fs.writeFileSync(filePath, content, "utf-8");
            }

            // Escribir el manifiesto
            fs.writeFileSync(
                path.join(destPath, "ptr.json"),
                JSON.stringify(data.manifest, null, 2),
                "utf-8"
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
        if (!fs.existsSync(destPath)) {
            fs.mkdirSync(destPath, { recursive: true });
        }

        const manifest = this.readManifest(sourcePath);

        // Copiar archivos especificados en el manifiesto
        for (const file of manifest.files) {
            const srcFile = path.join(sourcePath, file);
            const destFile = path.join(destPath, file);

            if (fs.statSync(srcFile).isDirectory()) {
                this.copyDirectory(srcFile, destFile);
            } else {
                fs.copyFileSync(srcFile, destFile);
            }
        }

        // Copiar el manifiesto
        fs.copyFileSync(
            path.join(sourcePath, "ptr.json"),
            path.join(destPath, "ptr.json")
        );
    }

    /**
     * Copia un directorio recursivamente
     */
    private copyDirectory(source: string, destination: string): void {
        if (!fs.existsSync(destination)) {
            fs.mkdirSync(destination, { recursive: true });
        }

        const entries = fs.readdirSync(source, { withFileTypes: true });

        for (const entry of entries) {
            const srcPath = path.join(source, entry.name);
            const destPath = path.join(destination, entry.name);

            if (entry.isDirectory()) {
                this.copyDirectory(srcPath, destPath);
            } else {
                fs.copyFileSync(srcPath, destPath);
            }
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

            // Instalar dependencias recursivamente
            if (manifest.dependencies && Object.keys(manifest.dependencies).length > 0) {
                console.log(Colors.info(`\n  Instalando dependencias de ${packageName}...`));

                for (const [depName, depVersion] of Object.entries(manifest.dependencies)) {
                    await this.downloadPackage(depName, depVersion);
                }
            }

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

        // Resolver todas las dependencias
        const dependencies = this.resolveDependencies(packageName, targetVersion);

        // Instalar cada paquete
        const installed: Record<string, string> = {};
        for (const [pkgName, pkgPath] of dependencies) {
            const sourcePath = path.join(__dirname, "../..", pkgPath);
            const destPath = path.join(this.installedDir, pkgName);

            console.log(`  ${Colors.gray}├─${Colors.reset} Instalando ${Colors.pkg(pkgName)}...`);
            this.copyPackage(sourcePath, destPath);

            const manifest = this.readManifest(sourcePath);
            installed[pkgName] = manifest.version;
        }

        // Escribir lock file
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

        if (!fs.existsSync(packagePath)) {
            throw new Error(`Package ${packageName} is not installed`);
        }

        // Eliminar recursivamente
        fs.rmSync(packagePath, { recursive: true, force: true });

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
                const deps = Object.keys(pkgInfo.dependencies);
                if (deps.length > 0) {
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

        if (!fs.existsSync(lockPath)) {
            console.log(Colors.warning("No hay paquetes instalados aún") + "\n");
            return;
        }

        const lockFile = JSON.parse(fs.readFileSync(lockPath, "utf-8"));

        console.log(Colors.title("📦", "Paquetes PTR Instalados"));
        console.log(Colors.line());

        for (const [name, version] of Object.entries(lockFile.installed)) {
            console.log(`  ${Colors.pkg(name)}${Colors.gray}@${version}${Colors.reset}`);
        }
        console.log("");
    }
}

export default PackageManager;

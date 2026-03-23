import os from "os";
import path from "path";
import Directory from "../../packages/directory/Directory.ts";
import Files from "../../packages/files/Files.ts";
import type { PtrConfig } from "./interface/PtrConfig.ts";

class Config {
    private configPath: string;
    private defaultConfig: PtrConfig = {
        registry: "local"
    };
    private FILES: Files;
    private DIRECTORY: Directory;

    constructor() {
        this.FILES = new Files();
        this.DIRECTORY = new Directory();
        // Archivo de configuración en el home del usuario
        this.configPath = path.join(os.homedir(), ".ptrrc.json");
    }

    /**
     * Lee la configuración actual
     */
    public read(): PtrConfig {
        try {
            if (!this.DIRECTORY.exists(this.configPath)) {
                return this.defaultConfig;
            }

            const content = this.FILES.read(this.configPath);
            return { ...this.defaultConfig, ...JSON.parse(content) };
        } catch (error) {
            return this.defaultConfig;
        }
    }

    /**
     * Escribe la configuración
     */
    public write(config: Partial<PtrConfig>): void {
        try {
            const current = this.read();
            const updated = { ...current, ...config };
            this.FILES.write(this.configPath, JSON.stringify(updated, null, 2));
        } catch (error) {
            throw new Error(`Error al guardar configuración: ${(error as Error).message}`);
        }
    }

    /**
     * Establece el registry remoto
     */
    public setRemoteRegistry(url: string): void {
        this.write({
            registry: "remote",
            remoteUrl: url
        });
    }

    /**
     * Establece el registry local
     */
    public setLocalRegistry(): void {
        this.write({
            registry: "local"
        });
    }

    /**
     * Obtiene la URL del registry actual
     */
    public getRegistryUrl(): string | null {
        const config = this.read();
        if (config.registry === "remote" && config.remoteUrl) {
            return config.remoteUrl;
        }
        return null;
    }

    /**
     * Verifica si está en modo remoto
     */
    public isRemote(): boolean {
        const config = this.read();
        return config.registry === "remote" && !!config.remoteUrl;
    }
}

export default Config;

import fs from "fs";
import os from "os";
import path from "path";

interface PtrConfig {
    registry: "local" | "remote";
    remoteUrl?: string;
}

class Config {
    private configPath: string;
    private defaultConfig: PtrConfig = {
        registry: "local"
    };

    constructor() {
        // Archivo de configuración en el home del usuario
        this.configPath = path.join(os.homedir(), ".ptrrc.json");
    }

    /**
     * Lee la configuración actual
     */
    public read(): PtrConfig {
        try {
            if (!fs.existsSync(this.configPath)) {
                return this.defaultConfig;
            }

            const content = fs.readFileSync(this.configPath, "utf-8");
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
            fs.writeFileSync(this.configPath, JSON.stringify(updated, null, 2), "utf-8");
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
            registry: "local",
            remoteUrl: undefined
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

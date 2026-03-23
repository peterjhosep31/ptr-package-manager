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

export type { Registry };

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

export type { PtrManifest };

import { Router } from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = Router();

// Ruta al directorio de paquetes y registry
const PACKAGES_DIR = path.join(__dirname, "../../../packages");
const REGISTRY_PATH = path.join(__dirname, "../../../registry.json");

/**
 * GET /api/packages
 * Lista todos los paquetes disponibles en el registry
 */
router.get("/", (_req, res) => {
    try {
        if (!fs.existsSync(REGISTRY_PATH)) {
            return res.status(404).json({ error: "Registry no encontrado" });
        }

        const registry = JSON.parse(fs.readFileSync(REGISTRY_PATH, "utf-8"));

        return res.json({
            success: true,
            packages: registry.packages,
            total: Object.keys(registry.packages).length
        });
    } catch (error) {
        return res.status(500).json({
            error: "Error al leer el registry",
            message: (error as Error).message
        });
    }
});

/**
 * GET /api/packages/:name
 * Obtiene información de un paquete específico
 */
router.get("/:name", (req, res) => {
    try {
        const { name } = req.params;
        const registry = JSON.parse(fs.readFileSync(REGISTRY_PATH, "utf-8"));

        if (!registry.packages[name]) {
            return res.status(404).json({
                error: `Paquete '${name}' no encontrado`
            });
        }

        return res.json({
            success: true,
            package: registry.packages[name]
        });
    } catch (error) {
        return res.status(500).json({
            error: "Error al obtener el paquete",
            message: (error as Error).message
        });
    }
});

/**
 * GET /api/packages/:name/:version/download
 * Descarga un paquete específico como JSON con todos sus archivos
 */
router.get("/:name/:version/download", (req, res) => {
    try {
        const { name, version } = req.params;
        const registry = JSON.parse(fs.readFileSync(REGISTRY_PATH, "utf-8"));

        if (!registry.packages[name]) {
            return res.status(404).json({
                error: `Paquete '${name}' no encontrado`
            });
        }

        const packageInfo = registry.packages[name].versions[version];
        if (!packageInfo) {
            return res.status(404).json({
                error: `Versión '${version}' no encontrada para '${name}'`
            });
        }

        const packagePath = path.join(PACKAGES_DIR, packageInfo.path);

        if (!fs.existsSync(packagePath)) {
            return res.status(404).json({
                error: `Directorio del paquete no encontrado: ${packagePath}`
            });
        }

        // Leer ptr.json del paquete
        const ptrJsonPath = path.join(packagePath, "ptr.json");
        if (!fs.existsSync(ptrJsonPath)) {
            return res.status(404).json({
                error: "ptr.json no encontrado en el paquete"
            });
        }

        const ptrJson = JSON.parse(fs.readFileSync(ptrJsonPath, "utf-8"));

        // Leer todos los archivos especificados en ptr.json
        const files: Record<string, string> = {};

        if (ptrJson.files && Array.isArray(ptrJson.files)) {
            for (const file of ptrJson.files) {
                const filePath = path.join(packagePath, file);
                if (fs.existsSync(filePath)) {
                    files[file] = fs.readFileSync(filePath, "utf-8");
                }
            }
        }

        // Responder con toda la información del paquete
        return res.json({
            success: true,
            name: ptrJson.name,
            version: ptrJson.version,
            dependencies: ptrJson.dependencies || {},
            files: files,
            manifest: ptrJson
        });

    } catch (error) {
        return res.status(500).json({
            error: "Error al descargar el paquete",
            message: (error as Error).message
        });
    }
});

// /**
//  * GET /api/packages/:name/:version/files/*
//  * Descarga un archivo específico de un paquete
//  * NOTA: Deshabilitado temporalmente por incompatibilidad con path-to-regexp
//  */
// router.get("/:name/:version/files/:filepath+", (req, res) => {
//     try {
//         const { name, version } = req.params;
//         const filepathParam = (req.params as any)['filepath+'] || (req.params as any).filepath;
//         const filepath = Array.isArray(filepathParam)
//             ? filepathParam.join('/')
//             : filepathParam;

//         const registry = JSON.parse(fs.readFileSync(REGISTRY_PATH, "utf-8"));

//         if (!registry.packages[name]) {
//             return res.status(404).json({
//                 error: `Paquete '${name}' no encontrado`
//             });
//         }

//         const packageInfo = registry.packages[name].versions[version];
//         if (!packageInfo) {
//             return res.status(404).json({
//                 error: `Versión '${version}' no encontrada`
//             });
//         }

//         const packagePath = path.join(PACKAGES_DIR, packageInfo.path);
//         const targetFile = path.join(packagePath, filepath);

//         // Verificar que el archivo está dentro del paquete (seguridad)
//         if (!targetFile.startsWith(packagePath)) {
//             return res.status(403).json({
//                 error: "Acceso denegado"
//             });
//         }

//         if (!fs.existsSync(targetFile)) {
//             return res.status(404).json({
//                 error: `Archivo '${filepath}' no encontrado`
//             });
//         }

//         const content = fs.readFileSync(targetFile, "utf-8");
//         return res.send(content);

//     } catch (error) {
//         return res.status(500).json({
//             error: "Error al leer el archivo",
//             message: (error as Error).message
//         });
//     }
// });

export default router;

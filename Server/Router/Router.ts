import { exec } from "child_process";
import { Router } from "express";
import fs from "fs";
import path from "path";
import { promisify } from "util";
import Directory from "../../packages/directory/Directory.ts";
import Files from "../../packages/files/Files.ts";
import DirectoryFile from "./include/DirectoryFile.Router.ts";
import PackagesRouter from "./include/Packages.Router.ts";

const execAsync = promisify(exec);


const DIR = new Directory();
const FILES = new Files();

/**
 * Verifica si el release existe y está actualizado (menos de 24 horas)
 * Si no existe o está desactualizado, genera uno nuevo
 */
async function ensureReleaseExists(releasePath: string): Promise<boolean> {
    const ONE_DAY = 24 * 60 * 60 * 1000; // 24 horas en milisegundos

    try {
        // Verificar si el archivo existe
        if (DIR.exists(releasePath)) {
            const stats = fs.statSync(releasePath);
            const age = Date.now() - stats.mtimeMs;

            // Si el archivo es reciente (menos de 24 horas), no regenerar
            if (age < ONE_DAY) {
                console.log('✅ Release existente y actualizado');
                return true;
            }
            console.log('🔄 Release desactualizado, regenerando...');
        } else {
            console.log('📦 Release no existe, generando...');
        }

        // Ejecutar el script de package-release
        const projectRoot = process.cwd();
        const { stdout, stderr } = await execAsync('bash scripts/package-release.sh', {
            cwd: projectRoot
        });

        if (stdout) console.log(stdout);
        if (stderr) console.error(stderr);

        return DIR.exists(releasePath);
    } catch (error) {
        console.error('Error al generar release:', error);
        return false;
    }
}

/**
 * Instancia del router de Express.
 * Utilizada para definir y organizar las rutas de la aplicación.
 *
 * @constant {Router} ROUTER
 */
const ROUTER = Router();

// Ruta principal - Página de inicio/home
ROUTER.get('/', (_req, res) => {
    const serverUrl = process.env['SERVER_URL'] || 'https://<TU_DOMINIO>';
    res.render('home', { serverUrl });
});

// Ruta para página de instalación
ROUTER.get('/install', (_req, res) => {
    const serverUrl = process.env['SERVER_URL'] || 'https://<TU_DOMINIO>';
    res.render('install', { serverUrl });
});

// Ruta para ver paquetes disponibles
ROUTER.get('/packages', (_req, res) => {
    const serverUrl = process.env['SERVER_URL'] || 'https://<TU_DOMINIO>';
    const registryPath = path.join(process.cwd(), 'registry.json');

    try {
        const registry = JSON.parse(FILES.read(registryPath));
        res.render('packages', { serverUrl, packages: registry });
    } catch (error) {
        res.status(500).send('Error al cargar el registry de paquetes');
    }
});

// Ruta para documentación
ROUTER.get('/docs', (_req, res) => {
    const serverUrl = process.env['SERVER_URL'] || 'https://<TU_DOMINIO>';
    res.render('docs', { serverUrl });
});

// Ruta para servir el script de instalación
ROUTER.get('/install.sh', async (_req, res) => {
    const installScript = path.join(process.cwd(), 'install.sh');
    const releasePath = path.join(process.cwd(), 'releases/latest.tar.gz');

    // Asegurar que el release existe antes de servir el script de instalación
    await ensureReleaseExists(releasePath);

    if (DIR.exists(installScript)) {
        res.type('text/plain');
        res.sendFile(installScript);
    } else {
        res.status(404).send('Script de instalación no encontrado');
    }
});

// Ruta para servir el tarball de release
ROUTER.get('/releases/latest.tar.gz', async (_req, res) => {
    const releasePath = path.join(process.cwd(), 'releases/latest.tar.gz');

    // Asegurar que el release existe y está actualizado
    const releaseReady = await ensureReleaseExists(releasePath);

    if (releaseReady && DIR.exists(releasePath)) {
        res.download(releasePath, 'ptr-latest.tar.gz');
    } else {
        res.status(500).json({
            error: 'Error al generar release',
            message: 'No se pudo crear el archivo de release. Verifica los logs del servidor.'
        });
    }
});

// Rutas de la API
ROUTER.use('/DirectoryFiles', DirectoryFile);
ROUTER.use('/api/packages', PackagesRouter);

// Ruta 404 - Debe estar al final para capturar todas las rutas no encontradas
ROUTER.use((_req, res) => {
    const serverUrl = process.env['SERVER_URL'] || 'https://<TU_DOMINIO>';
    res.status(404).render('notFound', { serverUrl });
});

export default ROUTER;

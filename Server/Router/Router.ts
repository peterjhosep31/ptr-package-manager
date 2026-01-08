import { Router } from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import DirectoryFile from "./include/DirectoryFile.Router.ts";
import PackagesRouter from "./include/Packages.Router.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Instancia del router de Express.
 * Utilizada para definir y organizar las rutas de la aplicación.
 *
 * @constant {Router} ROUTER
 */
const ROUTER = Router();

// Ruta de prueba en la raíz
ROUTER.get('/', (_req, res) => {
    res.json({ message: 'Library API funcionando correctamente!', timestamp: new Date() });
});

// Ruta para servir el script de instalación
ROUTER.get('/install.sh', (_req, res) => {
    const installScript = path.join(__dirname, '../../install.sh');
    if (fs.existsSync(installScript)) {
        res.type('text/plain');
        res.sendFile(installScript);
    } else {
        res.status(404).send('Script de instalación no encontrado');
    }
});

// Ruta para servir el tarball de release
ROUTER.get('/releases/latest.tar.gz', (_req, res) => {
    const releasePath = path.join(__dirname, '../../releases/latest.tar.gz');
    if (fs.existsSync(releasePath)) {
        res.download(releasePath, 'ptr-latest.tar.gz');
    } else {
        res.status(404).json({
            error: 'Release no encontrado',
            message: 'Ejecuta: npm run package:release para crear el release'
        });
    }
});

// Rutas de la API
ROUTER.use('/DirectoryFiles', DirectoryFile);
ROUTER.use('/api/packages', PackagesRouter);

export default ROUTER;

import { Router } from "express";
import DirectoryFile from "./include/DirectoryFile.Router.ts";

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

// Aquí se pueden agregar rutas:
ROUTER.use('/DirectoryFiles', DirectoryFile);
// ROUTER.post('/ruta', controlador);

export default ROUTER;

/**
 * Servidor HTTP básico usando Express.
 *
 * Este archivo configura y arranca un servidor Express en el puerto 3000.
 * El servidor utiliza el router definido en Router/Router.ts para manejar las rutas.
 *
 * @module server
 * @version 1.0.0
 */

import Express from "express";
import ROUTER from "./Router/Router.ts";

/**
 * Instancia de la aplicación Express.
 * Configura middleware y rutas para el servidor HTTP.
 */
const APP = Express();

/**
 * Registra el router principal de la aplicación.
 * Todas las rutas definidas en ROUTER estarán disponibles en la aplicación.
 */
APP.use(ROUTER);

/**
 * Inicia el servidor en el puerto 3000.
 * Muestra un mensaje en consola cuando el servidor está listo.
 */
APP.listen(3105, () => {
    console.log("Server is running on port 3105");
});

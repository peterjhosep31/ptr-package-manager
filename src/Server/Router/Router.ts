/**
 * Router principal de la aplicación Express.
 * 
 * Este módulo define y exporta el router que manejará todas las rutas de la aplicación.
 * Aquí se pueden definir endpoints, middleware específicos de rutas y controladores.
 * 
 * @module Router
 * @version 1.0.0
 */

import { Router } from "express";

/**
 * Instancia del router de Express.
 * Utilizada para definir y organizar las rutas de la aplicación.
 * 
 * @constant {Router} ROUTER
 */
const ROUTER = Router();

// Aquí se pueden agregar rutas:
// ROUTER.get('/ruta', controlador);
// ROUTER.post('/ruta', controlador);

export default ROUTER;

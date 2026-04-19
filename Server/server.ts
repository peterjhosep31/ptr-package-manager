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
import path from "path";
import { fileURLToPath } from "url";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import cors from "cors";
import compression from "compression";
import ROUTER from "./Router/Router.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Instancia de la aplicación Express.
 * Configura middleware y rutas para el servidor HTTP.
 */
const APP = Express();

// Compresión de respuestas
APP.use(compression());

// Seguridad de cabeceras HTTP
APP.use(helmet({
    contentSecurityPolicy: false, // Opcional, dependiendo de si el renderizado EJS tiene scripts en línea
}));

// Límite de peticiones por IP
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    limit: 150, // Límite por IP
    standardHeaders: true,
    legacyHeaders: false,
    message: "Demasiadas peticiones desde esta IP, por favor intente más tarde."
});
APP.use(limiter);

/**
 * Configuración del motor de plantillas EJS
 */
APP.set('view engine', 'ejs');
APP.set('views', path.join(__dirname, 'views'));

/**
 * Middleware para servir archivos estáticos CSS
 */
APP.use('/styles', Express.static(path.join(__dirname, 'views/styles')));

/**
 * Middleware para servir archivos estáticos JavaScript
 */
APP.use('/scripts', Express.static(path.join(__dirname, 'views/scripts')));

/**
 * Middleware para servir archivos estáticos (assets: imágenes, iconos, etc.)
 */
APP.use('/assets', Express.static(path.join(__dirname, 'views/assets')));

/**
 * Rutas para SEO
 */
APP.get('/robots.txt', (_req, res) => {
    res.sendFile(path.join(__dirname, 'views/robots.txt'));
});

APP.get('/sitemap.xml', (_req, res) => {
    res.sendFile(path.join(__dirname, 'views/sitemap.xml'));
});

/**
 * Middleware para parsear JSON
 */
APP.use(Express.json());

/**
 * Middleware para permitir CORS (acceso desde otros dominios)
 */
APP.use(cors({
    origin: process.env['CORS_ORIGIN'] || '*',
    methods: ['GET', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

/**
 * Registra el router principal de la aplicación.
 * Todas las rutas definidas en ROUTER estarán disponibles en la aplicación.
 */
APP.use(ROUTER);

/**
 * Middleware global para manejo de errores
 */
APP.use((err: Error, _req: Express.Request, res: Express.Response, _next: Express.NextFunction) => {
    console.error("Unhandled error:", err);
    res.status(500).json({ error: "Internal Server Error" });
});

/**
 * Inicia el servidor en el puerto configurado.
 * Puerto 3106 para desarrollo, 3105 para producción.
 */
const PORT = process.env['NODE_ENV'] === 'development' ? 3106 : 3105;

APP.listen(PORT, () => {
    console.log(`Server is running on port ${PORT} (${process.env['NODE_ENV'] || 'production'} mode)`);
});

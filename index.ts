/// <reference path="./Prototype/Arrays/Array.d.ts" />
/// <reference path="./Prototype/Strings/String.d.ts" />
/// <reference path="./Prototype/Object/Object.d.ts" />


/**
 * Punto de entrada principal de la biblioteca.
 *
 * Este archivo importa y ejecuta el servidor Express definido en Server/server.ts.
 * Sirve como módulo raíz para la aplicación y puede ser extendido con exportaciones
 * de otras clases y módulos según sea necesario.
 *
 * @module index
 * @version 1.0.0
 */
import './Server/server.ts';

// Exportar para que los usuarios puedan importar y cargar automáticamente
import "./Prototype/Arrays/Array.ts";
import "./Prototype/Object/Object.ts";
import "./Prototype/Strings/String.ts";

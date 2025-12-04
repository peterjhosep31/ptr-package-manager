/**
 * Este archivo define y exporta la constante __dirname, que representa la ruta del directorio raíz del proyecto.
 *
 * - Utiliza 'fileURLToPath' para obtener la ruta absoluta del archivo actual a partir de 'import.meta.url'.
 * - Usa 'dirname' para extraer el directorio donde se encuentra el archivo.
 * - Con 'join', sube un nivel en la estructura de carpetas para apuntar al directorio raíz del proyecto.
 * - Asigna esta ruta a la variable global '__dirname' para que esté disponible en todo el proyecto.
 * - Finalmente, exporta '__dirname' como valor por defecto.
 *
 * Esto es útil en proyectos ECMAScript Modules (ESM), donde la variable global '__dirname' no está disponible por defecto como en CommonJS.
 */
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

// Obtenemos la ruta del archivo actual
const __filename = fileURLToPath(import.meta.url);
// Obtenemos el directorio del archivo actual
const directorio = dirname(__filename);

/**
 * __dirname es una constante que contiene la ruta del directorio raíz del proyecto.
 * @var {string} __dirname
 */
const __dirname = join(directorio, "../");

export default __dirname;

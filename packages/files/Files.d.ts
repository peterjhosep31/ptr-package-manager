// /**
//  * Clase para gestionar y explorar directorios del sistema de archivos.
//  *
//  * Esta clase proporciona funcionalidades para:
//  * - Establecer un directorio de trabajo
//  * - Validar la existencia de directorios
//  * - Listar contenido de directorios separando archivos y subdirectorios
//  * - Manejar rutas de manera segura utilizando path.join()
//  *
//  * La clase utiliza el módulo fs nativo de Node.js para operaciones del sistema de archivos
//  * y el módulo path para manejo seguro de rutas.
//  *
//  * @class FilesDirectory
//  * @version 1.0.0
//  */
// declare class FilesDirectory {

//     /**
//      * Directorio de trabajo actual.
//      * Almacena la ruta absoluta del directorio que se está gestionando.
//      *
//      * @private
//      */
//     private directory: string;

//     /**
//      * Constructor de la clase FilesDirectory.
//      *
//      * @param {...string} directory - Segmentos de la ruta del directorio.
//      *                                Se pueden pasar múltiples argumentos que se combinarán
//      *                                para formar la ruta completa.
//      * @throws {Error} Si el directorio especificado no existe.
//      */
//     constructor(...directory: string[]);

//     /**
//      * Obtiene y clasifica el contenido del directorio de trabajo actual.
//      *
//      * @returns {Object|null} Objeto con el contenido clasificado del directorio, o null si está vacío.
//      *   - files: Array con los nombres de los archivos.
//      *   - directories: Array con los nombres de los subdirectorios.
//      * @throws {Error} Si no se puede leer el directorio (permisos, directorio no válido, etc.).
//      */
//     getFiles(): { files: string[]; directories: string[] } | null;
// }

// export default FilesDirectory;

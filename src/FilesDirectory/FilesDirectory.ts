// import fs from "node:fs";
// import path from "node:path";
// import DirectoryFiles from "../DirectoryFiles/DirectoryFiles.ts";
// import CustomError from "../Error/Error.ts";

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
// class FilesDirectory {

//     /**
//      * Directorio de trabajo actual.
//      * Almacena la ruta absoluta del directorio que se está gestionando.
//      *
//      * @private
//      * @type {string}
//      */
//     #_directory: string = "";

//     /**
//      * Constructor de la clase FilesDirectory.
//      *
//      * @constructor
//      * @param {...string} directory - Segmentos de la ruta del directorio.
//      *                               Se pueden pasar múltiples argumentos que se combinarán
//      *                               para formar la ruta completa.
//      * @throws {Error} Si el directorio especificado no existe.
//      */
//     constructor(...directory: string[]) {
//         this.directory = directory;
//     }

//     /**
//      * Setter para establecer el directorio de trabajo.
//      *
//      * @param {...string} value - Segmentos de la ruta del directorio a establecer.
//      * @throws {Error} Si el directorio especificado no existe en el sistema de archivos.
//      */
//     set directory(
//         value: string[]
//     ) {
//         let dirPath = path.join(__dirname, ...value);

//         const DIRECTORY_FILES = new DirectoryFiles();
//         if (!DIRECTORY_FILES.exists(dirPath))
//             throw new CustomError(
//                 "El directorio no existe",
//                 {
//                     cause: "El directorio solicitado no existe",
//                     status: 500
//                 });

//         this.#_directory = dirPath;
//     }

//     /**
//      * Obtiene y clasifica el contenido del directorio de trabajo actual.
//      *
//      * @returns {Object|null} Objeto con el contenido clasificado del directorio, o null si está vacío.
//      * @throws {Error} Si no se puede leer el directorio (permisos, directorio no válido, etc.).
//      */
//     getFiles() {

//         const DIRECTORY_CONTENTS = fs.readdirSync(this.#_directory);
//         if (DIRECTORY_CONTENTS.length === 0) {
//             return null;
//         }

//         let contented = {
//             files: [],
//             directories: []
//         };

//         DIRECTORY_CONTENTS.forEach(file => {

//             let informacionFile = fs.lstatSync(path.join(this.#_directory, file));
//             let action = informacionFile.isDirectory() ? "directories" : "files";

//             contented[action].push(file);
//         });

//         return contented;
//     }


// }

// export default FilesDirectory;

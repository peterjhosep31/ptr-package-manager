/**
 * Tipo de retorno para el método getContentedDirectory de la clase DirectoryFiles.
 * Representa el contenido de un directorio clasificado en subdirectorios y archivos.
 * 
 * @typedef {Object} DirectoryFilesReturn
 * @property {string[]} directories - Array con las rutas completas de todos los subdirectorios.
 * @property {string[]} files - Array con las rutas completas de todos los archivos.
 * 
 * @example
 * const content: DirectoryFilesReturn = {
 *   directories: ["/home/user/docs", "/home/user/images"],
 *   files: ["/home/user/file.txt", "/home/user/data.json"]
 * };
 */
type DirectoryFilesReturn = {
    readonly directories: readonly string[];
    readonly files: readonly string[];
};


export type { DirectoryFilesReturn };

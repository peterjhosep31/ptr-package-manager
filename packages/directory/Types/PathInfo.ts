/**
 * Interface que representa información completa de una ruta de archivo o directorio.
 * Proporciona acceso a todos los componentes de una ruta de forma estructurada.
 * 
 * @interface PathInfo
 * @property {string} full - Ruta completa original.
 * @property {string} directory - Ruta del directorio padre.
 * @property {string} filename - Nombre del archivo con extensión.
 * @property {string} extension - Extensión del archivo (incluyendo el punto).
 * 
 * @example
 * const pathInfo: PathInfo = {
 *   full: "/home/user/documents/file.txt",
 *   directory: "/home/user/documents",
 *   filename: "file.txt",
 *   extension: ".txt"
 * };
 */
export interface PathInfo {
    readonly full: string;
    readonly directory: string;
    readonly filename: string;
    readonly extension: string;
}

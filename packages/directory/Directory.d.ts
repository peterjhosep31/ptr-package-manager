import type { PathInfo } from "./Types/PathInfo";
import type { DirectoryFilesReturn } from "./Types/Return";

/**
 * Clase para gestionar operaciones sobre archivos y directorios del sistema de archivos.
 *
 * Esta clase proporciona funcionalidades para:
 * - Verificar la existencia de archivos y directorios
 * - Crear archivos y directorios de forma recursiva
 * - Obtener información sobre rutas (nombre, directorio, extensión)
 * - Listar contenido de directorios separando archivos y subdirectorios
 *
 * @class DirectoryFiles
 * @version 1.0.0
 */
declare class DirectoryFiles {

    /**
     * Verifica si un directorio o archivo existe en el sistema de archivos.
     *
     * @param {string} pathDirectory - La ruta absoluta o relativa del directorio o archivo a verificar.
     * @param {boolean} [createIfDoesnotExist=false] - Si es true, crea la ruta si no existe.
     * @returns {boolean} true si el directorio o archivo existe (o fue creado), false en caso contrario.
     */
    exists(pathDirectory: string, createIfDoesnotExist?: boolean): boolean;

    /**
     * Crea un directorio o archivo según la ruta proporcionada.
     *
     * @param {string} pathDirectory - La ruta absoluta o relativa del directorio o archivo a crear.
     * @returns {boolean} true si el archivo fue creado exitosamente.
     */
    create(pathDirectory: string): boolean;

    /**
     * Obtiene el nombre de archivo (incluyendo extensión) de una ruta completa.
     *
     * @param {string} pathDirectory - La ruta completa del archivo.
     * @returns {string} El nombre del archivo con su extensión.
     */
    baseName(pathDirectory: string): string;

    /**
     * Obtiene la ruta del directorio padre que contiene el archivo o directorio especificado.
     *
     * @param {string} pathDirectory - La ruta completa del archivo o directorio.
     * @returns {string} La ruta del directorio padre.
     */
    directoryPath(pathDirectory: string): string;

    /**
     * Obtiene la extensión de un archivo incluyendo el punto.
     *
     * @param {string} pathDirectory - La ruta completa del archivo.
     * @returns {string} La extensión del archivo con el punto (ej: ".txt").
     */
    extension(pathDirectory: string): string;

    /**
     * Crea un directorio de forma recursiva.
     *
     * @param {string} pathDirectory - La ruta absoluta o relativa del directorio a crear.
     * @returns {void}
     */
    createDirectory(pathDirectory: string): void;

    /**
     * Crea un archivo vacío en la ruta especificada.
     *
     * @param {string} pathDirectory - La ruta absoluta o relativa del archivo a crear.
     * @returns {boolean} true si el archivo fue creado exitosamente.
     */
    createFile(pathDirectory: string): boolean;

    /**
     * Obtiene y clasifica el contenido de un directorio.
     *
     * @param {string} directory - La ruta absoluta o relativa del directorio a leer.
     * @returns {DirectoryFilesReturn} Objeto con arrays de directories y files.
     */
    getDirectoryContents(directory: string): DirectoryFilesReturn;

    /**
     * Obtiene información completa de una ruta de archivo o directorio.
     *
     * @param {string} pathDirectory - La ruta completa del archivo o directorio.
     * @returns {PathInfo} Objeto con información completa de la ruta.
     */
    getPathInfo(pathDirectory: string): PathInfo;

    /**
     * Elimina un directorio recursivamente junto con todo su contenido.
     *
     * @param {string} dirPath - La ruta absoluta o relativa del directorio a eliminar.
     * @returns {boolean} true si el directorio fue eliminado exitosamente.
     */
    deleteDirectory(dirPath: string): boolean;
}

export default DirectoryFiles;

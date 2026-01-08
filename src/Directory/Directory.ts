import fs from "node:fs";
import path from "node:path";
import CustomError from "../Error/Error.ts";
import type { PathInfo } from "./Types/PathInfo.ts";
import type { DirectoryFilesReturn } from "./Types/Return.ts";

/**
 * Clase para gestionar operaciones sobre archivos y directorios del sistema de archivos.
 *
 * Esta clase proporciona funcionalidades para:
 * - Verificar la existencia de archivos y directorios
 * - Crear archivos y directorios de forma recursiva
 * - Obtener información sobre rutas (nombre, directorio, extensión)
 * - Listar contenido de directorios separando archivos y subdirectorios
 *
 * Utiliza los módulos nativos de Node.js (fs y path) para operaciones del sistema de archivos
 * y maneja errores mediante la clase CustomError para proporcionar información detallada.
 *
 * @class DirectoryFiles
 * @version 1.0.0
 */
class Directory {

    /**
     * Verifica si un directorio o archivo existe en el sistema de archivos.
     *
     * @param {string} pathDirectory - La ruta absoluta o relativa del directorio o archivo a verificar.
     * @param {boolean} [createIfDoesnotExist=false] - Si es true, crea la ruta si no existe.
     * @returns {boolean} true si el directorio o archivo existe (o fue creado), false en caso contrario.
     * @throws {CustomError} Si el parámetro pathDirectory no es de tipo string (status 422).
     * @throws {CustomError} Si el parámetro createIfDoesnotExist no es de tipo boolean (status 422).
     */
    exists(
        pathDirectory: string,
        createIfDoesnotExist: boolean = false
    ): boolean {

        if (typeof pathDirectory !== "string")
            throw new CustomError(
                `Error de validación en DirectoryFiles.exists(): El parámetro 'pathDirectory' debe ser de tipo string`,
                {
                    cause: "Tipo de dato inválido para el parámetro pathDirectory",
                    expected: "string",
                    received: typeof pathDirectory,
                    status: 422 // Unprocessable Entity - Error de validación de parámetros
                }
            );
        if (typeof createIfDoesnotExist !== "boolean")
            throw new CustomError(
                `Error de validación en DirectoryFiles.exists(): El parámetro 'createIfDoesnotExist' debe ser de tipo boolean`,
                {
                    cause: "Tipo de dato inválido para el parámetro createIfDoesnotExist",
                    expected: "boolean",
                    received: typeof createIfDoesnotExist,
                    status: 422 // Unprocessable Entity - Error de validación de parámetros
                }
            );

        let exist = fs.existsSync(pathDirectory);

        // Creamos la ruta si no existe
        if (!exist && createIfDoesnotExist) {
            this.create(pathDirectory);
            exist = true;
        }

        return exist;
    }

    /**
     * Crea un directorio o archivo según la ruta proporcionada.
     * Si la ruta incluye extensión, se considera un archivo; de lo contrario, un directorio.
     * Crea todos los directorios intermedios necesarios de forma recursiva.
     *
     * @param {string} pathDirectory - La ruta absoluta o relativa del directorio o archivo a crear.
     * @returns {boolean} true si el archivo fue creado exitosamente, false en caso contrario.
     * @throws {CustomError} Si el parámetro pathDirectory no es de tipo string (status 422).
     * @throws {CustomError} Si la ruta ya existe en el sistema de archivos (status 409).
     * @throws {CustomError} Si falla la creación del archivo por problemas del sistema (status 507).
     */
    public create(
        pathDirectory: string
    ): boolean {

        if (typeof pathDirectory !== "string")
            throw new CustomError(
                `Error de validación en DirectoryFiles.create(): El parámetro 'pathDirectory' debe ser de tipo string`,
                {
                    cause: "Tipo de dato inválido para el parámetro pathDirectory",
                    expected: "string",
                    received: typeof pathDirectory,
                    status: 422 // Unprocessable Entity - Error de validación de parámetros
                }
            );

        if (this.exists(pathDirectory))
            throw new CustomError(
                `Error en DirectoryFiles.create(): La ruta ya existe y no se puede crear`,
                {
                    cause: `Conflicto: La ruta '${pathDirectory}' ya existe en el sistema de archivos`,
                    status: 409 // Conflict - El recurso ya existe
                }
            );

        const DIRECTORY = this.directoryPath(pathDirectory);

        try {
            this.createDirectory(DIRECTORY);
        } catch (error: unknown) {

            if (error instanceof CustomError)
                if (error.status !== 409)
                    throw new CustomError(
                        `Error interno en DirectoryFiles.create(): Falló la creación del directorio`,
                        {
                            cause: `Error del sistema de archivos: ${error.message}`,
                            status: 507 // Insufficient Storage - Problemas del sistema de archivos
                        }
                    );
        }

        return this.createFile(pathDirectory);
    }

    /**
     * Obtiene el nombre de archivo (incluyendo extensión) de una ruta completa.
     * Utiliza path.basename() internamente.
     *
     * @param {string} pathDirectory - La ruta completa del archivo.
     * @returns {string} El nombre del archivo con su extensión (ej: "archivo.txt").
     * @throws {CustomError} Si el parámetro pathDirectory no es de tipo string (status 422).
     * @example
     * baseName ("/home/user/documentos/archivo.txt") // Retorna: "archivo.txt"
     */
    public baseName(
        pathDirectory: string
    ): string {
        if (typeof pathDirectory !== "string")
            throw new CustomError(
                `Error de validación en DirectoryFiles.baseName (): El parámetro 'pathDirectory' debe ser de tipo string`,
                {
                    cause: "Tipo    dato inválido para el parámetro pathDirectory",
                    expected: "string",
                    received: typeof pathDirectory,
                    status: 422 // Unprocessable Entity - Error de validación de parámetros
                }
            );

        return path.basename(pathDirectory);
    }

    /**
     * Obtiene la ruta del directorio padre que contiene el archivo o directorio especificado.
     * Utiliza path.dirname() internamente.
     *
     * @param {string} pathDirectory - La ruta completa del archivo o directorio.
     * @returns {string} La ruta del directorio padre (sin incluir el nombre del archivo).
     * @throws {CustomError} Si el parámetro pathDirectory no es de tipo string (status 422).
     * @example
     * directoryPath("/home/user/documentos/archivo.txt") // Retorna: "/home/user/documentos"
     */
    public directoryPath(
        pathDirectory: string
    ): string {
        if (typeof pathDirectory !== "string")
            throw new CustomError(
                `Error de validación en DirectoryFiles.directoryPath(): El parámetro 'pathDirectory' debe ser de tipo string`,
                {
                    cause: "Tipo de dato inválido para el parámetro pathDirectory",
                    expected: "string",
                    received: typeof pathDirectory,
                    status: 422 // Unprocessable Entity - Error de validación de parámetros
                }
            );

        return path.dirname(pathDirectory);
    }

    /**
     * Obtiene la extensión de un archivo incluyendo el punto.
     * Utiliza path.extname() internamente.
     *
     * @param {string} pathDirectory - La ruta completa del archivo.
     * @returns {string} La extensión del archivo con el punto (ej: ".txt", ".js"). Cadena vacía si no tiene extensión.
     * @throws {CustomError} Si el parámetro pathDirectory no es de tipo string (status 422).
     * @example
     * extension("/home/user/archivo.txt") // Retorna: ".txt"
     */
    extension(
        pathDirectory: string
    ): string {
        if (typeof pathDirectory !== "string")
            throw new CustomError(
                `Error de validación en DirectoryFiles.extension(): El parámetro 'pathDirectory' debe ser de tipo string`,
                {
                    cause: "Tipo de dato inválido para el parámetro pathDirectory",
                    expected: "string",
                    received: typeof pathDirectory,
                    status: 422 // Unprocessable Entity - Error de validación de parámetros
                }
            );

        return path.extname(pathDirectory);
    }

    /**
     * Crea un directorio de forma recursiva.
     * Si el directorio padre no existe, se crean todos los directorios intermedios necesarios.
     * Utiliza fs.mkdirSync() con la opción recursive.
     *
     * @param {string} pathDirectory - La ruta absoluta o relativa del directorio a crear.
     * @returns {void}
     * @throws {CustomError} Si el parámetro pathDirectory no es de tipo string (status 422).
     * @throws {CustomError} Si el directorio ya existe (status 409).
     * @throws {CustomError} Si falla la creación por problemas del sistema de archivos (status 507).
     */
    createDirectory(
        pathDirectory: string
    ): void {
        if (typeof pathDirectory !== "string")
            throw new CustomError(
                `Error de validación en DirectoryFiles.createDirectory(): El parámetro 'pathDirectory' debe ser de tipo string`,
                {
                    cause: "Tipo de dato inválido para el parámetro pathDirectory",
                    expected: "string",
                    received: typeof pathDirectory,
                    status: 422 // Unprocessable Entity - Error de validación de parámetros
                }
            );


        if (this.exists(pathDirectory))
            throw new CustomError(
                `Error en DirectoryFiles.createDirectory(): El directorio ya existe`,
                {
                    cause: `Conflicto: El directorio '${pathDirectory}' ya existe en el sistema de archivos`,
                    status: 409 // Conflict - El recurso ya existe
                }
            );


        try {
            fs.mkdirSync(pathDirectory, { recursive: true });
        } catch (error: unknown) {
            if (error instanceof Error)
                throw new CustomError(
                    `Error interno en DirectoryFiles.createDirectory(): No se pudo crear el directorio`,
                    {
                        cause: `Error del sistema de archivos al crear '${pathDirectory}': ${error.message}`,
                        status: 507 // Insufficient Storage - Problemas del sistema de archivos
                    }
                );
        }
    }

    /**
     * Crea un archivo vacío en la ruta especificada.
     * El archivo se crea con contenido vacío utilizando fs.writeFileSync().
     *
     * @param {string} pathDirectory - La ruta absoluta o relativa del archivo a crear.
     * @returns {boolean} true si el archivo fue creado exitosamente, false en caso contrario.
     * @throws {CustomError} Si el parámetro pathDirectory no es de tipo string (status 422).
     * @throws {CustomError} Si el archivo ya existe (status 409).
     * @throws {CustomError} Si falla la creación por problemas del sistema de archivos (status 507).
     */
    createFile(
        pathDirectory: string
    ): boolean {
        if (typeof pathDirectory !== "string")
            throw new CustomError(
                `Error de validación en DirectoryFiles.createFile(): El parámetro 'pathDirectory' debe ser de tipo string`,
                {
                    cause: "Tipo de dato inválido para el parámetro pathDirectory",
                    expected: "string",
                    received: typeof pathDirectory,
                    status: 422 // Unprocessable Entity - Error de validación de parámetros
                }
            );

        if (this.exists(pathDirectory))
            throw new CustomError(
                `Error en DirectoryFiles.createFile(): El archivo ya existe`,
                {
                    cause: `Conflicto: El archivo '${pathDirectory}' ya existe en el sistema de archivos`,
                    status: 409 // Conflict - El recurso ya existe
                }
            );


        try {
            fs.writeFileSync(pathDirectory, "");
            return true;
        } catch (error: unknown) {

            if (error instanceof Error)
                throw new CustomError(
                    `Error interno en DirectoryFiles.createFile(): No se pudo crear el archivo`,
                    {
                        cause: `Error del sistema de archivos al crear '${pathDirectory}': ${error.message}`,
                        status: 507 // Insufficient Storage - Problemas del sistema de archivos
                    }
                );
        }

        return false;
    }

    /**
     * Obtiene y clasifica el contenido de un directorio.
     * Lee el contenido del directorio y lo separa en dos arrays: uno para subdirectorios y otro para archivos.
     *
     * @param {string} directory - La ruta absoluta o relativa del directorio a leer.
     * @returns {DirectoryFilesReturn} Objeto con dos propiedades:
     *   - directories: Array con las rutas completas de los subdirectorios.
     *   - files: Array con las rutas completas de los archivos.
     * @throws {Error} Si el directorio no existe o no se puede leer.
     * @example
     * getContentedDirectory("/home/user")
     * // Retorna: { directories: ["/home/user/docs"], files: ["/home/user/file.txt"] }
     */
    getContentedDirectory(
        directory: string
    ): DirectoryFilesReturn {

        if (typeof directory !== "string")
            throw new CustomError(
                `Error de validación en DirectoryFiles.getContentedDirectory(): El parámetro 'directory' debe ser de tipo string`,
                {
                    cause: "Tipo de dato inválido para el parámetro directory",
                    expected: "string",
                    received: typeof directory,
                    status: 422
                }
            );

        const DIRECTORY_CONTENT = fs.readdirSync(directory);
        let directories: string[] = [];
        let files: string[] = [];

        DIRECTORY_CONTENT.forEach((item) => {

            const itemPath = path.join(directory, item);

            if (fs.statSync(itemPath).isDirectory()) {
                directories.push(itemPath);
            } else {
                files.push(itemPath);
            }
        });

        return { directories, files };
    }

    /**
     * Obtiene información completa de una ruta de archivo o directorio.
     * Proporciona todos los componentes de la ruta en un objeto estructurado.
     *
     * @param {string} pathDirectory - La ruta completa del archivo o directorio.
     * @returns {PathInfo} Objeto con la información completa de la ruta:
     *   - full: Ruta completa original
     *   - directory: Ruta del directorio padre
     *   - filename: Nombre del archivo con extensión
     *   - extension: Extensión del archivo (incluyendo el punto)
     * @throws {CustomError} Si el parámetro pathDirectory no es de tipo string (status 422).
     * @example
     * const info = directoryFiles.getPathInfo("/home/user/file.txt");
     * // {
     * //   full: "/home/user/file.txt",
     * //   directory: "/home/user",
     * //   filename: "file.txt",
     * //   extension: ".txt"
     * // }
     */
    public getPathInfo(pathDirectory: string): PathInfo {
        if (typeof pathDirectory !== "string")
            throw new CustomError(
                `Error de validación en DirectoryFiles.getPathInfo(): El parámetro 'pathDirectory' debe ser de tipo string`,
                {
                    cause: "Tipo de dato inválido para el parámetro pathDirectory",
                    expected: "string",
                    received: typeof pathDirectory,
                    status: 422
                }
            );

        return {
            full: pathDirectory,
            directory: this.directoryPath(pathDirectory),
            filename: this.baseName(pathDirectory),
            extension: this.extension(pathDirectory)
        };
    }
}

export default Directory;

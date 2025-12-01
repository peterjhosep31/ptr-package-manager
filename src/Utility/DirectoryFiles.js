import fs from "node:fs";
import path from "node:path";
import CustomError from "./CustomError.js";

class DirectoryFiles {

    /**
     * Verifica si un directorio o archivo existe.
     * @param {string} pathDirectory - La ruta del directorio o archivo a verificar.
     * @param {boolean} createIfDoesnotExist - Si se debe crear el directorio o archivo si no existe.
     * @returns {boolean} - Verdadero si el directorio o archivo existe, falso en caso contrario.
     */
    exists(pathDirectory, createIfDoesnotExist = false) {

        if (typeof pathDirectory !== "string") {
            throw new CustomError(
                `Error de validación en DirectoryFiles.exists(): El parámetro 'pathDirectory' debe ser de tipo string`,
                {
                    cause: "Tipo de dato inválido para el parámetro pathDirectory",
                    expected: "string",
                    received: typeof pathDirectory,
                    status: 422 // Unprocessable Entity - Error de validación de parámetros
                }
            );
        }
        if (typeof createIfDoesnotExist !== "boolean") {
            throw new CustomError(
                `Error de validación en DirectoryFiles.exists(): El parámetro 'createIfDoesnotExist' debe ser de tipo boolean`,
                {
                    cause: "Tipo de dato inválido para el parámetro createIfDoesnotExist",
                    expected: "boolean",
                    received: typeof createIfDoesnotExist,
                    status: 422 // Unprocessable Entity - Error de validación de parámetros
                }
            );
        }

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
     * @param {string} pathDirectory - La ruta del directorio o archivo a crear.
     */
    create(pathDirectory) {

        if (typeof pathDirectory !== "string") {
            throw new CustomError(
                `Error de validación en DirectoryFiles.create(): El parámetro 'pathDirectory' debe ser de tipo string`,
                {
                    cause: "Tipo de dato inválido para el parámetro pathDirectory",
                    expected: "string",
                    received: typeof pathDirectory,
                    status: 422 // Unprocessable Entity - Error de validación de parámetros
                }
            );
        }

        if (this.exists(pathDirectory)) {
            throw new CustomError(
                `Error en DirectoryFiles.create(): La ruta ya existe y no se puede crear`,
                {
                    cause: `Conflicto: La ruta '${pathDirectory}' ya existe en el sistema de archivos`,
                    status: 409 // Conflict - El recurso ya existe
                }
            );
        }

        const DIRECTORY = this.directoryPath(pathDirectory);
        try {
            this.createDirectory(DIRECTORY);
        } catch (error) {

            if (error._status !== 409)
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
     * Obtiene el nombre de archivo de una ruta.
     * @param {string} pathDirectory - La ruta del archivo.
     * @returns {string} - El nombre del archivo.
     */
    fileName(pathDirectory) {
        if (typeof pathDirectory !== "string") {
            throw new CustomError(
                `Error de validación en DirectoryFiles.fileName(): El parámetro 'pathDirectory' debe ser de tipo string`,
                {
                    cause: "Tipo de dato inválido para el parámetro pathDirectory",
                    expected: "string",
                    received: typeof pathDirectory,
                    status: 422 // Unprocessable Entity - Error de validación de parámetros
                }
            );
        }

        return path.basename(pathDirectory);
    }

    /**
     * Obtiene el directorio de un archivo.
     * @param {string} pathDirectory - La ruta del archivo.
     * @returns {string} - El directorio del archivo.
     */
    directoryPath(pathDirectory) {
        if (typeof pathDirectory !== "string") {
            throw new CustomError(
                `Error de validación en DirectoryFiles.directoryPath(): El parámetro 'pathDirectory' debe ser de tipo string`,
                {
                    cause: "Tipo de dato inválido para el parámetro pathDirectory",
                    expected: "string",
                    received: typeof pathDirectory,
                    status: 422 // Unprocessable Entity - Error de validación de parámetros
                }
            );
        }

        return path.dirname(pathDirectory);
    }

    /**
     * Obtiene la extensión de un archivo.
     * @param {string} pathDirectory - La ruta del archivo.
     * @returns {string} - La extensión del archivo.
     */
    extension(pathDirectory) {
        if (typeof pathDirectory !== "string") {
            throw new CustomError(
                `Error de validación en DirectoryFiles.extension(): El parámetro 'pathDirectory' debe ser de tipo string`,
                {
                    cause: "Tipo de dato inválido para el parámetro pathDirectory",
                    expected: "string",
                    received: typeof pathDirectory,
                    status: 422 // Unprocessable Entity - Error de validación de parámetros
                }
            );
        }

        return path.extname(pathDirectory);
    }

    /**
     * Crea un directorio de forma recursiva.
     * @param {string} pathDirectory - La ruta del directorio a crear.
     */
    createDirectory(pathDirectory) {
        if (typeof pathDirectory !== "string") {
            throw new CustomError(
                `Error de validación en DirectoryFiles.createDirectory(): El parámetro 'pathDirectory' debe ser de tipo string`,
                {
                    cause: "Tipo de dato inválido para el parámetro pathDirectory",
                    expected: "string",
                    received: typeof pathDirectory,
                    status: 422 // Unprocessable Entity - Error de validación de parámetros
                }
            );
        }

        if (this.exists(pathDirectory)) {
            throw new CustomError(
                `Error en DirectoryFiles.createDirectory(): El directorio ya existe`,
                {
                    cause: `Conflicto: El directorio '${pathDirectory}' ya existe en el sistema de archivos`,
                    status: 409 // Conflict - El recurso ya existe
                }
            );
        }

        try {
            fs.mkdirSync(pathDirectory, { recursive: true });
        } catch (error) {
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
     * Crea un archivo vacío.
     * @param {string} pathDirectory - La ruta del archivo a crear.
     */
    createFile(pathDirectory) {
        if (typeof pathDirectory !== "string") {
            throw new CustomError(
                `Error de validación en DirectoryFiles.createFile(): El parámetro 'pathDirectory' debe ser de tipo string`,
                {
                    cause: "Tipo de dato inválido para el parámetro pathDirectory",
                    expected: "string",
                    received: typeof pathDirectory,
                    status: 422 // Unprocessable Entity - Error de validación de parámetros
                }
            );
        }

        if (this.exists(pathDirectory)) {
            throw new CustomError(
                `Error en DirectoryFiles.createFile(): El archivo ya existe`,
                {
                    cause: `Conflicto: El archivo '${pathDirectory}' ya existe en el sistema de archivos`,
                    status: 409 // Conflict - El recurso ya existe
                }
            );
        }

        try {
            fs.writeFileSync(pathDirectory, "");
            return true;
        } catch (error) {
            throw new CustomError(
                `Error interno en DirectoryFiles.createFile(): No se pudo crear el archivo`,
                {
                    cause: `Error del sistema de archivos al crear '${pathDirectory}': ${error.message}`,
                    status: 507 // Insufficient Storage - Problemas del sistema de archivos
                }
            );
        }
    }

}

export default DirectoryFiles;

import type CustomError from "../Error.ts";

/**
 * Error de validación de parámetros (HTTP 422).
 * Se utiliza cuando los parámetros de entrada no cumplen con los requisitos esperados.
 * 
 * @typedef {CustomError} ValidationError
 * @property {422} status - Código de estado HTTP 422 (Unprocessable Entity).
 */
export type ValidationError = CustomError & { status: 422 };

/**
 * Error de recurso no encontrado (HTTP 404).
 * Se utiliza cuando un archivo, directorio o recurso solicitado no existe.
 * 
 * @typedef {CustomError} NotFoundError
 * @property {404} status - Código de estado HTTP 404 (Not Found).
 */
export type NotFoundError = CustomError & { status: 404 };

/**
 * Error de conflicto (HTTP 409).
 * Se utiliza cuando hay un conflicto, como intentar crear un recurso que ya existe.
 * 
 * @typedef {CustomError} ConflictError
 * @property {409} status - Código de estado HTTP 409 (Conflict).
 */
export type ConflictError = CustomError & { status: 409 };

/**
 * Error interno del servidor (HTTP 500).
 * Se utiliza para errores generales del servidor o problemas inesperados.
 * 
 * @typedef {CustomError} ServerError
 * @property {500} status - Código de estado HTTP 500 (Internal Server Error).
 */
export type ServerError = CustomError & { status: 500 };

/**
 * Error de almacenamiento insuficiente (HTTP 507).
 * Se utiliza cuando hay problemas con el sistema de archivos o espacio insuficiente.
 * 
 * @typedef {CustomError} StorageError
 * @property {507} status - Código de estado HTTP 507 (Insufficient Storage).
 */
export type StorageError = CustomError & { status: 507 };

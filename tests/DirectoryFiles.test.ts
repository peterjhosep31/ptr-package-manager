import fs from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { beforeEach, describe, expect, it } from 'vitest';
import DirectoryFiles from '../src/DirectoryFiles/DirectoryFiles.ts';
import CustomError from '../src/Error/Error.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

describe('DirectoryFiles', () => {
    let directoryFiles: DirectoryFiles;
    const testDir = join(__dirname, 'test-temp');
    join(testDir, 'test.txt');

    beforeEach(() => {
        directoryFiles = new DirectoryFiles();
        // Limpiar directorio de prueba si existe
        if (fs.existsSync(testDir)) {
            fs.rmSync(testDir, { recursive: true, force: true });
        }
    });

    describe('exists', () => {
        it('debe retornar true si el archivo existe', () => {
            expect(directoryFiles.exists(__filename)).toBe(true);
        });

        it('debe retornar false si el archivo no existe', () => {
            expect(directoryFiles.exists('/ruta/inexistente/archivo.txt')).toBe(false);
        });

        it('debe lanzar error si pathDirectory no es string', () => {
            expect(() => directoryFiles.exists(123 as any)).toThrow(CustomError);
        });

        it('debe crear el directorio si createIfDoesnotExist es true', () => {
            directoryFiles.exists(testDir, true);
            expect(fs.existsSync(testDir)).toBe(true);
        });
    });

    describe('fileName', () => {
        it('debe retornar el nombre del archivo', () => {
            expect(directoryFiles.fileName('/home/user/test.txt')).toBe('test.txt');
        });

        it('debe lanzar error si el parámetro no es string', () => {
            expect(() => directoryFiles.fileName(null as any)).toThrow(CustomError);
        });
    });

    describe('directoryPath', () => {
        it('debe retornar la ruta del directorio', () => {
            expect(directoryFiles.directoryPath('/home/user/test.txt')).toBe('/home/user');
        });
    });

    describe('extension', () => {
        it('debe retornar la extensión del archivo', () => {
            expect(directoryFiles.extension('/home/user/test.txt')).toBe('.txt');
        });

        it('debe retornar cadena vacía si no hay extensión', () => {
            expect(directoryFiles.extension('/home/user/archivo')).toBe('');
        });
    });

    describe('getPathInfo', () => {
        it('debe retornar información completa de la ruta', () => {
            const info = directoryFiles.getPathInfo('/home/user/test.txt');
            expect(info).toEqual({
                full: '/home/user/test.txt',
                directory: '/home/user',
                filename: 'test.txt',
                extension: '.txt'
            });
        });

        it('debe lanzar error si el parámetro no es string', () => {
            expect(() => directoryFiles.getPathInfo(undefined as any)).toThrow(CustomError);
        });
    });

    describe('createDirectory', () => {
        it('debe crear un directorio', () => {
            directoryFiles.createDirectory(testDir);
            expect(fs.existsSync(testDir)).toBe(true);
        });

        it('debe lanzar error si el directorio ya existe', () => {
            directoryFiles.createDirectory(testDir);
            expect(() => directoryFiles.createDirectory(testDir)).toThrow(CustomError);
        });
    });
});

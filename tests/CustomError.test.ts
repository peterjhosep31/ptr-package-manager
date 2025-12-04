import { describe, it, expect } from 'vitest';
import CustomError from '../src/Error/Error.ts';

describe('CustomError', () => {
    it('debe crear un error con mensaje', () => {
        const error = new CustomError('Test error');
        expect(error.message).toBe('Test error');
        expect(error).toBeInstanceOf(Error);
    });

    it('debe almacenar la causa del error', () => {
        const error = new CustomError('Test error', {
            cause: 'Error de prueba'
        });
        expect(error.cause).toBe('Error de prueba');
    });

    it('debe almacenar el tipo esperado y recibido', () => {
        const error = new CustomError('Tipo incorrecto', {
            expected: 'string',
            received: 'number'
        });
        expect(error.expected).toBe('string');
        expect(error.received).toBe('number');
    });

    it('debe almacenar el código de estado HTTP', () => {
        const error = new CustomError('Not found', {
            status: 404
        });
        expect(error.status).toBe(404);
    });

    it('debe lanzar error si cause no es string', () => {
        expect(() => {
            new CustomError('Test', { cause: 123 as any });
        }).toThrow(CustomError);
    });

    it('debe lanzar error si expected no es string', () => {
        expect(() => {
            new CustomError('Test', { expected: 123 as any });
        }).toThrow(CustomError);
    });

    it('debe lanzar error si received no es string', () => {
        expect(() => {
            new CustomError('Test', { received: 123 as any });
        }).toThrow(CustomError);
    });

    it('debe lanzar error si status no es number', () => {
        expect(() => {
            new CustomError('Test', { status: 'error' as any });
        }).toThrow(CustomError);
    });

    it('debe permitir parámetros undefined', () => {
        const error = new CustomError('Test');
        expect(error.cause).toBeUndefined();
        expect(error.expected).toBeUndefined();
        expect(error.received).toBeUndefined();
        expect(error.status).toBeUndefined();
    });
});

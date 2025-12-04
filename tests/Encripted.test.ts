import { beforeEach, describe, expect, it } from 'vitest';
import Encripted from '../src/Encripted/Encripted.ts';
import CustomError from '../src/Error/Error.ts';

describe('Encripted', () => {
    let encripted: Encripted;

    beforeEach(() => {
        encripted = new Encripted();
    });

    describe('getJump', () => {
        it('debe retornar un string', () => {
            const jump = encripted.getJump();
            expect(typeof jump).toBe('string');
        });

        it('el jump debe tener longitud entre 6 y 10', () => {
            const jump = encripted.getJump();
            expect(jump.length).toBeGreaterThanOrEqual(6);
            expect(jump.length).toBeLessThanOrEqual(10);
        });
    });

    describe('resetJump', () => {
        it('debe generar un nuevo jump', () => {
            encripted.getJump();
            const newJump = encripted.resetJump();
            expect(typeof newJump).toBe('string');
            // Es muy improbable que sean iguales, pero técnicamente posible
        });
    });

    describe('encrypt', () => {
        it('debe encriptar un texto', () => {
            const original = 'Hello World';
            const encrypted = encripted.encrypt(original);
            expect(encrypted).not.toBe(original);
            expect(typeof encrypted).toBe('string');
        });

        it('debe lanzar error si el texto no es string', () => {
            expect(() => encripted.encrypt(123 as any)).toThrow(CustomError);
        });

        it('debe lanzar error si el texto está vacío', () => {
            expect(() => encripted.encrypt('')).toThrow(CustomError);
        });

        it('textos diferentes deben producir cifrados diferentes', () => {
            const encrypted1 = encripted.encrypt('Hello');
            const encrypted2 = encripted.encrypt('World');
            expect(encrypted1).not.toBe(encrypted2);
        });
    });

    describe('decrypt', () => {
        it('debe desencriptar un texto previamente encriptado', () => {
            const original = 'Hello World 123';
            const encrypted = encripted.encrypt(original);
            const decrypted = encripted.decrypt(encrypted);
            expect(decrypted).toBe(original);
        });

        it('debe lanzar error si el texto no es string', () => {
            expect(() => encripted.decrypt(null as any)).toThrow(CustomError);
        });

        it('debe lanzar error si el texto está vacío', () => {
            expect(() => encripted.decrypt('')).toThrow(CustomError);
        });

        it('debe mantener caracteres especiales', () => {
            const original = 'Test with spaces, dots. and-dashes_';
            const encrypted = encripted.encrypt(original);
            const decrypted = encripted.decrypt(encrypted);
            expect(decrypted).toBe(original);
        });
    });

    describe('encrypt/decrypt ciclo completo', () => {
        it('debe mantener la integridad con múltiples encriptaciones', () => {
            const original = 'Texto de prueba 123';
            const encrypted1 = encripted.encrypt(original);
            const decrypted1 = encripted.decrypt(encrypted1);
            expect(decrypted1).toBe(original);

            const encrypted2 = encripted.encrypt(decrypted1);
            const decrypted2 = encripted.decrypt(encrypted2);
            expect(decrypted2).toBe(original);
        });
    });
});

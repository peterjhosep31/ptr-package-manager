import { describe, expect, it } from 'vitest';
import Timestamp from '../src/TimesTamp/Timestamp.ts';

describe('Timestamp', () => {
    describe('get', () => {
        it('debe retornar un timestamp en segundos', () => {
            const timestamp = Timestamp.get();
            expect(typeof timestamp).toBe('number');
            expect(timestamp).toBeGreaterThan(0);
        });

        it('el timestamp debe ser un entero', () => {
            const timestamp = Timestamp.get();
            expect(Number.isInteger(timestamp)).toBe(true);
        });

        it('debe ser aproximadamente el timestamp actual', () => {
            const timestamp = Timestamp.get();
            const now = Math.floor(Date.now() / 1000);
            // Debe estar dentro de 1 segundo de diferencia
            expect(Math.abs(timestamp - now)).toBeLessThanOrEqual(1);
        });
    });

    describe('convertToDate', () => {
        it('debe convertir timestamp a formato Y-m-d H:i:s', () => {
            const timestamp = 1733270400; // 2024-12-03 18:00:00 UTC
            const formatted = Timestamp.convertToDate('Y-m-d H:i:s', timestamp);
            expect(formatted).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/);
        });

        it('debe convertir timestamp a formato d/m/Y', () => {
            const timestamp = 1733270400;
            const formatted = Timestamp.convertToDate('d/m/Y', timestamp);
            expect(formatted).toMatch(/^\d{2}\/\d{2}\/\d{4}$/);
        });

        it('debe convertir timestamp a formato H:i:s', () => {
            const timestamp = 1733270400;
            const formatted = Timestamp.convertToDate('H:i:s', timestamp);
            expect(formatted).toMatch(/^\d{2}:\d{2}:\d{2}$/);
        });

        it('debe manejar formatos personalizados', () => {
            const timestamp = 1733270400;
            const formatted = Timestamp.convertToDate('Y/m/d-H:i', timestamp);
            expect(formatted).toMatch(/^\d{4}\/\d{2}\/\d{2}-\d{2}:\d{2}$/);
        });
    });

    describe('getDiference', () => {
        it('debe calcular la diferencia entre dos timestamps', () => {
            const start = 1733270400;
            const end = 1733274000;
            const diff = Timestamp.getDiference(start, end);
            expect(diff).toBe(3600); // 1 hora
        });

        it('debe calcular diferencia con el timestamp actual si end es null', () => {
            const start = Timestamp.get() - 10; // 10 segundos atrás
            const diff = Timestamp.getDiference(start, null);
            expect(diff).toBeGreaterThanOrEqual(10);
            expect(diff).toBeLessThanOrEqual(11);
        });

        it('debe manejar diferencias negativas', () => {
            const start = 1733274000;
            const end = 1733270400;
            const diff = Timestamp.getDiference(start, end);
            expect(diff).toBe(-3600);
        });
    });
});

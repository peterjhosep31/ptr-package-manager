import type { Format } from './Types/Format.ts';

declare class Timestamp {

    get(): number;

    convertToDate(
        format: Format,
        timestamp: number
    ): string;


    getDifference(
        start: number,
        end: number
    ): number;

}

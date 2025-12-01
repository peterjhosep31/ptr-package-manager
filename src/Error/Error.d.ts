import type { ErrorParams } from './Types/Params.ts';

declare class CustomError extends Error {

    constructor(message: string, params?: ErrorParams);

    public get cause(): string | undefined;
    public get expected(): string | undefined;
    public get received(): string | undefined;
    public get status(): number | undefined;
}

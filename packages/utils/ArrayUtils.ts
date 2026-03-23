export function arrayEnd<T>(arr: T[]): T | null {
    if (!arr || arr.length === 0) return null;
    const last = arr[arr.length - 1];
    return last === undefined ? null : last;
}

export function searchCutEnd(str: string, searchValue: string): string | null {
    if (!str) return null;
    const INDEX = str.indexOf(searchValue);
    if (INDEX === -1) return null;
    return str.substring(INDEX + searchValue.length);
}

export function capitalizeWords(str: string): string {
    if (!str) return '';
    let text = str.split(' ').map(function (char: string) {
        if (char.length <= 3) return char;
        return (char[0]?.toUpperCase() || '') + char.slice(1);
    });
    return text.join('');
}

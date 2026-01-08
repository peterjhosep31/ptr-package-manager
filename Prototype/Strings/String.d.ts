/**
 * Extensión del prototipo String con métodos personalizados
 */
declare global {
    interface String {
        /**
         * Busca un valor en el string y retorna desde ese punto hasta el final.
         * Si no encuentra el valor, retorna el string completo.
         * @param searchValue - El valor a buscar
         * @returns El substring desde el valor encontrado hasta el final
         */
        searchCutEnd(searchValue: string): string;
    }
}

export {};

export { };

declare global {
    interface Array<T> {
        /**
         * Obtenemos el último elemento del arreglo
         */
        end(): T;
    }
}

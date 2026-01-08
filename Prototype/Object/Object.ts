Object.defineProperties(Object.prototype, {

    length: {
        get: function () {
            // Si ya existe una propiedad propia 'length', devolverla
            if (this.hasOwnProperty('_length')) {
                return this._length;
            }
            return Object.keys(this).length;
        },
        set: function (value: number) {
            // Permitir que objetos internos establezcan su propia propiedad length
            Object.defineProperty(this, '_length', {
                value: value,
                writable: true,
                configurable: true,
                enumerable: false
            });
        },
        configurable: true,
        enumerable: false
    },

    endKey: {

        value: function () {

            const KEYS: string[] = Object.keys(this);
            console.log(KEYS);

        }

    }

});

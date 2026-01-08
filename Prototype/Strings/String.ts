Object.defineProperties(String.prototype, {
    searchCutEnd: {
        value: function (
            searchValue: string
        ) {

            const INDEX = this.indexOf(searchValue);
            if (INDEX === -1) return null;

            return this.substring(INDEX + searchValue.length);
        },
        writable: false,
        enumerable: false
    },
});

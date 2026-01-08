Object.defineProperties(Array.prototype, {
    end: {
        value: function () {
            return this[this.length - 1] || null;
        },
        enumerable: false,
        configurable: false
    }
});

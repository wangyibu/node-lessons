var test;
(function (test) {
    /**
     * Product
     */
    var Product = (function () {
        function Product(productValue) {
            this.productValue = productValue;
        }
        Object.defineProperty(Product.prototype, "value", {
            get: function () {
                return this.productValue;
            },
            set: function (v) {
                this.productValue = v;
            },
            enumerable: true,
            configurable: true
        });
        return Product;
    })();
    var newLine = "<br />";
    var obj = {};
    Object.defineProperties(obj, {
        newDataProperty: {
            value: 101,
            writable: true,
            enumerable: true,
            configurable: true
        },
        newAccessorProperty: {
            set: function (x) {
                document.write("in property set accessor" + newLine);
                this.newaccpropvalue = x;
            },
            get: function () {
                document.write("in property get accessor" + newLine);
                return this.newaccpropvalue;
            },
            enumerable: true,
            configurable: true
        }
    });
    // Set the accessor property value.
    obj.newAccessorProperty = 10;
    document.write("newAccessorProperty value: " + obj.newAccessorProperty + newLine);
})(test || (test = {}));

module test {
  /**
   * Product
   */
  class Product {
    productValue: string;
    constructor(productValue) {
      this.productValue = productValue;
    }

    public get value(): string {
      return this.productValue;
    }

    public set value(v: string) {
      this.productValue = v;
    }

  }

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
}



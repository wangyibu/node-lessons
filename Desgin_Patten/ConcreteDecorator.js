var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ConcreteComponent = (function () {
    function ConcreteComponent(s) {
        this.s = s;
    }
    ConcreteComponent.prototype.operation = function () {
        console.log("`operation` of ConcreteComponent", this.s, " is being called!");
    };
    return ConcreteComponent;
})();
var Decorator = (function () {
    function Decorator(id, component) {
        this.id = id;
        this.component = component;
    }
    Object.defineProperty(Decorator.prototype, "Id", {
        get: function () {
            return this.id;
        },
        enumerable: true,
        configurable: true
    });
    Decorator.prototype.operation = function () {
        console.log("`operation` of Decorator", this.id, " is being called!");
        this.component.operation();
    };
    return Decorator;
})();
var ConcreteDecorator = (function (_super) {
    __extends(ConcreteDecorator, _super);
    function ConcreteDecorator(id, component) {
        _super.call(this, id, component);
    }
    ConcreteDecorator.prototype.operation = function () {
        _super.prototype.operation.call(this);
        console.log("`operation` of ConcreteDecorator", this.Id, " is being called!");
    };
    return ConcreteDecorator;
})(Decorator);
(function main() {
    var decorator1 = new ConcreteDecorator(1, new ConcreteComponent("Comp1"));
    decorator1.operation();
}());

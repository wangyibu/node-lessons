var OldStuff = (function () {
    function OldStuff() {
    }
    OldStuff.prototype.display = function () {
        console.log("Some old stuff wrapped by new stuff");
    };
    return OldStuff;
}());
var NewStuff = (function () {
    function NewStuff() {
    }
    NewStuff.prototype.call = function () {
        var adaptee = new OldStuff();
        adaptee.display();
    };
    return NewStuff;
}());
(function main() {
    var adapter = new NewStuff();
    adapter.call();
}());

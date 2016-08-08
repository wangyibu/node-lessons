interface Target {
    call();
}

class OldStuff {
    public display(){
      console.log("Some old stuff wrapped by new stuff");
    }
}

class NewStuff implements Target {
    public call() {
        var adaptee: OldStuff = new OldStuff();
        adaptee.display();
    }
}

(function main() {
    var adapter: NewStuff = new NewStuff();
    adapter.call();
}());
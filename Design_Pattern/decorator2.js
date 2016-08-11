var mod;
(function (mod) {
    var SweetPrecure = (function () {
        function SweetPrecure() {
            this.abc = 123;
        }
        SweetPrecure.prototype.getValue = function () {
            return this.abc;
        };
        SweetPrecure.prototype.getTitle = function () {
            return 'title1';
        };
        return SweetPrecure;
    }());
    mod.SweetPrecure = SweetPrecure;
    var SmilePrecure = (function () {
        function SmilePrecure() {
        }
        SmilePrecure.prototype.getTitle = function () {
            return 'title2';
        };
        return SmilePrecure;
    }());
    mod.SmilePrecure = SmilePrecure;
    var MovieDecorator = (function () {
        function MovieDecorator(precure) {
            this.precure = precure;
            this.subTitle = 'title3';
        }
        MovieDecorator.prototype.getTitle = function () {
            return this.subTitle + this.precure.getTitle();
        };
        return MovieDecorator;
    }());
    mod.MovieDecorator = MovieDecorator;
})(mod || (mod = {}));
var sweet = new mod.MovieDecorator(new mod.SweetPrecure());

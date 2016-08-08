var PATTERN;
(function (PATTERN) {
    var SweetPrecure = (function () {
        function SweetPrecure() {
        }
        SweetPrecure.prototype.getTitle = function () {
            return 'title1';
        };
        return SweetPrecure;
    }());
    PATTERN.SweetPrecure = SweetPrecure;
    var SmilePrecure = (function () {
        function SmilePrecure() {
        }
        SmilePrecure.prototype.getTitle = function () {
            return 'title2';
        };
        return SmilePrecure;
    }());
    PATTERN.SmilePrecure = SmilePrecure;
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
    PATTERN.MovieDecorator = MovieDecorator;
    var sweetPrecureMovie = new MovieDecorator(new SweetPrecure());
    var smilePrecureMovie = new MovieDecorator(new SmilePrecure());
    console.log(sweetPrecureMovie, smilePrecureMovie);
})(PATTERN || (PATTERN = {}));
//# sourceMappingURL=decorator2.js.map
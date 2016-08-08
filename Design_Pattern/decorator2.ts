module pattern {

  export interface Precure {
    getTitle(): string;
  }

  export class SweetPrecure implements Precure {
    getTitle(): string {
      return 'title1';
    }
  }

  export class SmilePrecure implements Precure {
    getTitle(): string {
      return 'title2';
    }
  }

  export class MovieDecorator implements Precure {
    private subTitle: string = 'title3';

    constructor(private precure: Precure) {}

    getTitle(): string {
      return this.subTitle + this.precure.getTitle();
    }
  }
  
  var sweetPrecureMovie = new MovieDecorator(new SweetPrecure());
  var smilePrecureMovie = new MovieDecorator(new SmilePrecure());
  console.log(sweetPrecureMovie,smilePrecureMovie);
}
import { Component, Input } from '@angular/core';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.css']
})
export class MovieCardComponent {
  @Input() movie: any;
  defaultPoster: string = '/assets/images/movie-collection4.jpg';

  constructor(private router : Router){}

  get posterImage(): string {
    return this.movie?.poster && this.movie.poster !== 'N/A' 
      ? this.movie.poster 
      : this.defaultPoster;
  }

  get releaseYear(): string {
    return this.movie?.year ? this.movie.year.split('–')[0] : 'N/A';
  }

  navigateToMovieDetails(){
    this.router.navigate(['/movie', this.movie.imdbID]);
  }
}

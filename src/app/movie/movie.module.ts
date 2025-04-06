import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MovieComponent } from './movie/movie.component';
import { MoviesComponent } from './movies/movies.component';
import { MovieCardComponent } from './movie-card/movie-card.component';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    MovieComponent,
    MoviesComponent,
    MovieCardComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    
  ]
})
export class MovieModule { }

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-movie-card-options',
  templateUrl: './movie-card-options.component.html',
  styleUrls: ['./movie-card-options.component.css']
})
export class MovieCardOptionsComponent {
  @Input() movie: any;
  isSelectMode: boolean = true;
  @Input() isSelected: boolean = false;
  @Input() showDeleteBtn: boolean = false;
  @Input() showAddBtn: boolean = false;
  @Output() selected = new EventEmitter<string>();
  @Output() unselected = new EventEmitter<string>();
  @Output() add = new EventEmitter<string>();
  @Output() deleteMovie = new EventEmitter<string>();


  defaultPoster: string = '/assets/images/movie-collection4.jpg';

  constructor(private router: Router) {}

  get posterImage(): string {
    return this.movie?.poster && this.movie.poster !== 'N/A' 
      ? this.movie.poster 
      : this.defaultPoster;
  }

  get releaseYear(): string {
    return this.movie?.year ? this.movie.year.split('–')[0] : 'N/A';
  }

  navigateToMovieDetails() {
    this.router.navigate(['/movie', this.movie.imdbID.split(':')[1]]);
  }

  toggleSelect() {
    this.isSelected = !this.isSelected;
    console.log(this.movie.imdbID);
    if (this.isSelected) {
      this.selected.emit(this.movie.imdbID.split(':')[1]);
    } else {
      this.unselected.emit(this.movie.imdbID.split(':')[1]);
    }
  }

  onAdd() {
    console.log(this.movie.imdbID);
    this.add.emit(this.movie.imdbID.split(':')[1]);
  }

  onDelete() {
    console.log('event',this.movie.imdbID);
    this.deleteMovie.emit(this.movie.imdbID.split(':')[1]);
  }

  deleteExternalMovie() {

    console.log('All external movies deleted');
    this.onDelete();
   

  }

  addInternalMovie() {

    console.log('All internal movies added');
    this.onAdd();

  }
}
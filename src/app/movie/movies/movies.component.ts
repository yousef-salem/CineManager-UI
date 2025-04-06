import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

import { environment } from 'src/environments/environment';
import { MovieService } from '../movie.service';
import { ApiResponse } from 'src/app/service/api.service';

@Component({
  selector: 'app-movies',
  templateUrl: './movies.component.html',
  styleUrls: ['./movies.component.css']
})
export class MoviesComponent implements OnInit {
  movies: any[] = [];
  isLoading: boolean = false;
  searchQuery: string = '';
  yearFilter: string = '';
  currentPage: number = 0;
  pageSize: number = 15;
  totalElements: number = 0;
  totalPages: number = 0;

  constructor( private movieService : MovieService ) { }

  ngOnInit(): void {
    this.loadMovies();
  }

  loadMovies(): void {
    this.isLoading = true;
    this.movieService.getMovies(this.currentPage, this.pageSize).subscribe(
      {
        next: (response: ApiResponse<any>) => {
          let returndata = response.data
          this.movies = returndata.content;
          this.totalElements = returndata.totalElements;
          this.totalPages = returndata.totalPages;
          this.isLoading = false;
          this.movieService.onResponseSuccess('Movies loaded');
        },
        error: (error) => {
          console.log(error);
          this.isLoading = false;
          this.movieService.onResponsefaild('No movies found ,try again later');
      }
    }
    )
  }
  filteredMovies(): void {
    this.isLoading = true;
    this.movieService.getFilteredMovies(this.currentPage, this.pageSize, this.searchQuery, this.yearFilter).subscribe(
      {
        next: (response: ApiResponse<any>) => {
          let returndata = response.data
          this.movies = returndata.content;
          this.totalElements = returndata.totalElements;
          this.totalPages = returndata.totalPages;
          this.isLoading = false;
          this.movieService.onResponseSuccess('Movies loaded');
        },
        error: (error: any) => {
          this.movieService.onResponsefaild('No movies found ,try again later or try another search criteria');
          console.log(error);
          this.isLoading = false;
      }
    }
    )
  }

  onSearch(): void {
    this.currentPage = 0;
    this.filteredMovies();
  } 

  onYearInput(event: any): void {
    const input = event.target.value.replace(/\D/g, ''); 
    this.yearFilter = input.substring(0, 4); 
    event.target.value = this.yearFilter; 
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    if (this.searchQuery || this.yearFilter) {
      this.filteredMovies();
    }else {
      this.loadMovies();
    }
    window.scrollTo(0, 0);
  }

  clearFilters(): void {
    this.searchQuery = '';
    this.yearFilter = '';
    this.currentPage = 0;
    this.loadMovies();
  }

  getPageNumbers(): number[] {
    const pagesToShow = 5;
    const startPage = Math.max(0, this.currentPage - Math.floor(pagesToShow / 2));
    const endPage = Math.min(this.totalPages - 1, startPage + pagesToShow - 1);
    
    return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
  }
}
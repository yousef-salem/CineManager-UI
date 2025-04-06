import { Component } from '@angular/core';
import { MovieService } from 'src/app/movie/movie.service';
import { ApiResponse } from 'src/app/service/api.service';
import { DashboardService } from '../dashboard.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  movies: any[] = [];
  moviesExternal: any[] = [];
  isLoading: boolean = false;
  isLoadingExternal: boolean = false;
  searchQuery: string = '';
  yearFilter: string = '';
  currentPage: number = 0;
  currentPageExternal: number = 0;
  pageSize: number = 10;
  totalElements: number = 0;
  totalElementsExternal: number = 0;
  totalPages: number = 0;
  totalPagesExternal: number = 0;
  toBeAddedIds: string[] = [];
  toBeDeletedIds: string[] = [];
  constructor( private movieService : MovieService, private dashboardService : DashboardService ) { }

  ngOnInit(): void {

    this.onSearch();
  }


  filteredMoviesExternal(): void {
    this.isLoadingExternal = true;
    this.dashboardService.getFilteredMoviesExternal(this.currentPageExternal, this.searchQuery, this.yearFilter).subscribe(
      {
        next: (response: ApiResponse<any>) => {
          let returndata = response.data
          this.moviesExternal = returndata.search;
          this.totalElementsExternal = returndata.totalResults;
          this.totalPagesExternal = this.totalElementsExternal%this.pageSize>0 ? Math.floor(this.totalElementsExternal/this.pageSize)+1 : Math.floor(this.totalElementsExternal/this.pageSize);
          this.isLoadingExternal = false;
          this.dashboardService.onResponseSuccess('External movies loaded');
        },
        error: (error: any) => {
          this.dashboardService.onResponsefaild('No external movies found ,try again later or try another search criteria');
          console.log(error);
          this.moviesExternal = [];
          this.totalElementsExternal = 0;
          this.totalPagesExternal = 0;
          this.currentPageExternal = 0;
          this.isLoadingExternal = false;
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
          this.dashboardService.onResponseSuccess('Movies loaded');
        },
        error: (error: any) => {
          this.dashboardService.onResponsefaild('No movies found ,try again later or try another search criteria');
          console.log(error);
          this.isLoading = false;
      }
    }
    )
  }

  onSearch(): void {
    this.currentPage = 0;
    this.currentPageExternal = 0;
    this.toBeAddedIds = [];
    this.toBeDeletedIds = [];
       this.filteredMovies();
    if(this.searchQuery) {
      this.filteredMoviesExternal();
    }else{
      this.moviesExternal = [];
      this.totalElementsExternal = 0;
      this.totalPagesExternal = 0;
      this.currentPageExternal = 0;
    }
    
  }

  onYearInput(event: any): void {
    const input = event.target.value.replace(/\D/g, '');
    this.yearFilter = input.substring(0, 4); 
    event.target.value = this.yearFilter; 
  }

  onPageChange(page: number): void {
    this.currentPage = page;
      this.filteredMovies();
    // window.scrollTo(0, 0);
  }
  onPageChangeExternal(page: number): void {
    this.currentPageExternal = page;
    if (this.searchQuery) {
      this.filteredMoviesExternal();
    }
    window.scrollTo(0, 0);
  }

  clearFilters(): void {
    this.searchQuery = '';
    this.yearFilter = '';
    this.currentPage = 0;
    this.moviesExternal = [];
    this.totalElementsExternal = 0;
    this.totalPagesExternal = 0;
    this.currentPageExternal = 0;
    this.filteredMovies();
  }

  getPageNumbers(): number[] {
    const pagesToShow = 5; 
    const startPage = Math.max(0, this.currentPage - Math.floor(pagesToShow / 2));
    const endPage = Math.min(this.totalPages - 1, startPage + pagesToShow - 1);
    
    return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
  }
  getPageNumbersExternal(): number[] {
    const pagesToShow = 5; 
    const startPage = Math.max(0, this.currentPageExternal - Math.floor(pagesToShow / 2));
    const endPage = Math.min(this.totalPagesExternal - 1, startPage + pagesToShow - 1);
    
    return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
  }

  addAllInternalMovies() {

    console.log('All internal movies added');
    this.onAdd(...this.toBeAddedIds);

  }
  deleteAllExternalMovies() {

    console.log('All external movies deleted');
    this.onDelete(...this.toBeDeletedIds);

  }
  onAdd(...imdbID: string[]) {
    this.dashboardService.addMovieExternal(imdbID).subscribe(
      {
        next: (response: ApiResponse<any>) => {
          console.log(response);
          this.filteredMovies();
          this.toBeAddedIds = [];
          this.dashboardService.onResponseSuccess('Movies added');
        },
        error: (error) => {
          console.log(error);
          alert('Failed to add movie. Please try again.');
      }
    }
    )
  }

  onDelete(...imdbID: string[]) {
    console.log(imdbID);
    this.dashboardService.deleteMovieExternal(imdbID).subscribe(
      {
        next: (response: ApiResponse<any>) => {
          console.log(response);
          this.filteredMovies();
          this.toBeDeletedIds = [];
          this.dashboardService.onResponseSuccess('Movies deleted');

        },
        error: (error:any) => {
          console.log(error);
          this.dashboardService.onResponsefaild('Failed to delete movie. Please try again.');
      }
    }
    )
  }
  OnSelectedMovieAdd(imdbID: string) {
    this.toBeAddedIds = [...this.toBeAddedIds, imdbID];
  }
  OnSelectedMovieDelete(imdbID: string) {
    this.toBeDeletedIds = [...this.toBeDeletedIds, imdbID];
  }
  OnUnselectedMovieAdd(imdbID: string) {
    this.toBeAddedIds = this.toBeAddedIds.filter(id => id !== imdbID);
  }
  OnUnselectedMovieDelete(imdbID: string) {
    this.toBeDeletedIds = this.toBeDeletedIds.filter(id => id !== imdbID);
  }
  isSelectedAdd(imdbID: string) {
    return this.toBeAddedIds.includes(imdbID);
  }
  isSelectedDelete(imdbID: string) {
    return this.toBeDeletedIds.includes(imdbID);
  }
}
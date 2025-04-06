import { Injectable } from '@angular/core';
import { ApiService } from '../service/api.service';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private apiService : ApiService) { }

  getFilteredMoviesExternal(currentPage?: number, searchQuery?: string, yearFilter?: string) {
    let params = new HttpParams()
    
    if (currentPage !== undefined || currentPage!=null) {
      params = params.set('page', (currentPage+1).toString());
    }
    if (searchQuery) {
      params = params.set('query', searchQuery);
    }
    if (yearFilter) {
      params = params.set('year', yearFilter);
    }
    console.log(params);
    return this.apiService.getAll(`/omdb/search?${params.toString()}`);
  }
  getMovieExternalByID(id:string){
    return this.apiService.getById<any>(`/omdb/${id}`)
  }
  addMovieExternal(imdbID: string[]) {
    return this.apiService.add<any>(`/bulk`,{ids:imdbID});
  }
  deleteMovieExternal(imdbID: string[]) {
    return this.apiService.Delete<any>(`/bulk`,{ids:imdbID});
  }
  onResponseSuccess( message : string){
     this.apiService.onResponseSuccess('Success',message);
  }
  onResponsefaild(error : any){
    this.apiService.onResponsefaild(error);
  }
 
}

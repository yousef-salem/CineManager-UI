import { Injectable } from '@angular/core';
import { ApiResponse, ApiService } from '../service/api.service';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { AuthService } from '../service/auth.service';

@Injectable({
  providedIn: 'root'
})
export class MovieService {


  constructor(private apiService : ApiService, private authService : AuthService) { }


  getMovies(currentPage?: number, pageSize?: number): Observable<ApiResponse<any>> {
    let params = new HttpParams();
    if (currentPage !== undefined) {
      params = params.set('page', currentPage.toString());
    }
    if (pageSize !== undefined) {
      params = params.set('size', pageSize.toString());
    }
    
    return this.apiService.getAll(`?${params.toString()}`);
  } 
  
  getFilteredMovies(currentPage?: number, pageSize?: number, searchQuery?: string, yearFilter?: string) {
    let params = new HttpParams()
    
    if (currentPage !== undefined || currentPage!=null) {
      params = params.set('page', currentPage.toString());
    }
    if (pageSize) {
      params = params.set('size', pageSize.toString());
    }else{
      params = params.set('size', '15');
    }
    if (searchQuery) {
      params = params.set('title', searchQuery);
    }
    if (yearFilter) {
      params = params.set('year', yearFilter);
    }
    console.log(params);
    return this.apiService.getAll(`/filter?${params.toString()}`);
  }


  getMovie(id: string): Observable<ApiResponse<any>> {
    return this.apiService.getAll(`/${id}`);
  }

  getUserRating(id: string): Observable<ApiResponse<any>> {
    return this.apiService.getAll(`/user-rating/${id}/${this.authService.decodedTaken.id}`)
   }

   addUserRating(ratingObject: any): Observable<ApiResponse<any>> {
    return this.apiService.add(`/rate`,{userId:this.authService.decodedTaken.id,...ratingObject})
   }

   onResponseSuccess(body : string){
    this.apiService.onResponseSuccess('Success',body)
  }
  onResponsefaild(error : any){
    this.apiService.onResponsefaild(error)
  }
}

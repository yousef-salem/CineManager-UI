import { HttpClient, HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Code } from './auth.service';
import { ToastrService } from 'ngx-toastr';



@Injectable({
  providedIn: 'root'
})
export class ApiService {
 apiUrl : string = environment.apiUrl;

  httpOptions ;
  constructor(private httpClient : HttpClient, private toastr: ToastrService) {
    this.httpOptions =  {
      headers :  new HttpHeaders({
      'Content-Type':  'application/json',
     
    })
  } ;
   }
  
  getAll<T>(endPoint:string):Observable<ApiResponse<T>>{
    return this.httpClient.get<ApiResponse<T>>(`${this.apiUrl}${endPoint}`);
    }
  
    getById<T>(endPoint:string):Observable<ApiResponse<T>>{
      return this.httpClient.get<ApiResponse<T>>(`${this.apiUrl}${endPoint}`);
    }

    add<T>(endPoint:string , body :any,headers? :any ){
      
      let customOption ;
      if(headers){
        customOption =  {
          headers :  new HttpHeaders(headers)
        }
      } else{
        customOption = this.httpOptions
      }
      return this.httpClient.post<ApiResponse<T>>(`${this.apiUrl}${endPoint}` , body ,customOption);
    }

    update<T>(endPoint:string , body :any ){
      return this.httpClient.put<ApiResponse<T>>(`${this.apiUrl}${endPoint}` , body ,this.httpOptions);
    }

    Delete<T>(endPoint:string , body? :any ):Observable<ApiResponse<T>>{
      // If a specific 'body' value is provided, override the 'observe' option
      const options = body ? { ...this.httpOptions, body : body } : this.httpOptions;

      return this.httpClient.delete<ApiResponse<T>>(`${this.apiUrl}${endPoint}`,options);
    }
    onResponseSuccess(Title :string, body : string){
    
        this.toastr.success(body, Title, { timeOut: 2000 });
      
      
    }
    onResponsefaild(error : any){
      this.toastr.error(error,  'Error', { timeOut: 3000 });
        console.log(error); 
    }
}



@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor() {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {

    if (request.url.includes('/assets')) {
      const modifiedRequest = request.clone({
        setHeaders: {
          Authorization: '',
        },
      });
      return next.handle(modifiedRequest); 
    }

    const token = localStorage.getItem(Code.Token); 
    if (token) {
      const modifiedRequest = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });

      return next.handle(modifiedRequest);
    }

    return next.handle(request);
  }
}

 interface ErrorDetails {
  timestamp: string;
  status: number;
  errors: string[];
}

export interface ApiResponse<T> {
  success: boolean;
  error: ErrorDetails | null;
  data: T | null;
  message: string;
}
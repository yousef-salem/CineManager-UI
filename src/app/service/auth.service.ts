import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { ApiResponse, ApiService } from './api.service';
import { JwtHelperService } from '@auth0/angular-jwt';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  decodedTaken : any;
  capabilitiesList : string[] = [];


  constructor(private apiService : ApiService, private router : Router) {
    this.checkToken();
  }
  checkToken(){
    this.apiService.getAll('/demo/user').subscribe({
      next: (data: ApiResponse<any>) => {
      }
      ,error: (error: any) => {
        console.log(error);
        if(error.status == 401 && localStorage.getItem(Code.Token) != null){
          localStorage.clear();
          location.reload();
        }
      }
    })
  }
 logIN(user : any){
  this.apiService.add('/auth/signin',user).subscribe({
    next: (data: ApiResponse<any>) => {
      console.log("login successfull");
      let loginResponse = data.data
      if(loginResponse.accessToken){
        localStorage.setItem(Code.Token,loginResponse.accessToken);
        const helper =  new JwtHelperService()
        this.decodedTaken =  helper.decodeToken(loginResponse.accessToken)
        this.getCapabilities();
        this.apiService.onResponseSuccess('Success',"login success")
        if(this.checkCapabilities('ROLE_USER')){
          this.router.navigate(['/movies']);
        }else if(this.checkCapabilities('ROLE_ADMIN')){
          this.router.navigate(['/dashboard']);
        }
        
      }
    },error:(error: any) => {
      console.log(error);
      this.apiService.onResponsefaild( "login failed")
    }
  });

  }
  isLoggedIn() {
    // console.log('check log fun')
    const  token = localStorage.getItem(Code.Token);
    
    if(!token){
      // console.log('check log fun refreshed but not logged case0')
      return false
    } 
    const helper =  new JwtHelperService()
    const logged = helper.isTokenExpired(token)
    if(logged){
      // console.log("token exp", logged );
      // console.log('check log fun refresh but yes log , but exp case1')
      localStorage.removeItem(Code.Token);
      return false
    }
      this.decodedTaken =  helper.decodeToken(token)
      this.getCapabilities();
      return true;
  }
  getCapabilities(){
    this.capabilitiesList = this.decodedTaken.roles as string[];
  }
  checkCapabilities(capability:string):boolean{
      return this.capabilitiesList.includes(capability);
  }
  logout() {
    this.apiService.add<any>('/auth/logout',localStorage.getItem(Code.Token)).subscribe({
      next: (data: any) => {
        localStorage.clear();
        this.decodedTaken = null;
        this.apiService.onResponseSuccess('Success','logout success')
        this.router.navigate(['/login']);
      },error: (error: any) => {
        console.log(error);
        this.apiService.onResponsefaild("logout failed")
      }
    });
  }
  singUp(user : any) {
  return this.apiService.add('/auth/signup',user)
}
}
export class Code {
  static readonly Token = 'access_token';
 }
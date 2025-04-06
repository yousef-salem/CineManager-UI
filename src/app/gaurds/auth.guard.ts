import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../service/auth.service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
 let status =  inject(AuthService).isLoggedIn();
  if( status&& (route.url[0]?.path == 'login' || route.url[0]?.path == 'register')){
    inject(Router).navigate(['/dashboard']);
    return false;
  }
  if(!status &&  (route.url[0]?.path != 'login' && route.url[0]?.path != 'register') ){
    inject(Router).navigate(['/login']);
    return false;
  }
    return true;
};

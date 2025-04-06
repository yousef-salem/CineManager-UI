import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../service/auth.service';

export const userGuard: CanActivateFn = (route, state) => {
  if(inject(AuthService).checkCapabilities('ROLE_USER')){
    return true;
  }
  else{
    inject(Router).navigate(['/dashboard']);
    return false;;
  }
};

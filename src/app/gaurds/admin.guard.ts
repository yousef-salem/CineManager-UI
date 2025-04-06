import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../service/auth.service';
import { inject } from '@angular/core';

export const adminGuard: CanActivateFn = (route, state) => {
  if(inject(AuthService).checkCapabilities('ROLE_ADMIN'))
  return true;
else
   inject(Router).navigate(['/movies']);
  return false;
};

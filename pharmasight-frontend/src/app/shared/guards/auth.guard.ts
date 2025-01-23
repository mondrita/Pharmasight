import {CanActivateFn, Router} from '@angular/router';
import {inject} from "@angular/core";

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = localStorage?.getItem('token') ? localStorage?.getItem('token') : ''

  return token ? true : router.navigate(['auth/signin']);
};

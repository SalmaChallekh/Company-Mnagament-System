import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../pages/service/auth.service';

@Injectable({
    providedIn: 'root',
  })
  export class roleGuard implements CanActivate {
    constructor(private authService: AuthService, private router: Router) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
      const userRole = this.authService.decodeToken(this.authService.getToken());

      if (!userRole) {
        this.router.navigate(['/login']);
        return false;
      }

      const allowedRoles = route.data['roles'] as Array<string>;
      if (allowedRoles.includes(userRole)) {
        return true;
      }

      this.router.navigate(['/unauthorized']);
      return false;
    }
  }

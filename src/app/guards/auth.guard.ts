import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../pages/service/auth.service';
import { Router } from '@angular/router';

export const authGuard: CanActivateFn = () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    return authService.isLoggedIn() || router.createUrlTree(['/login']);
};

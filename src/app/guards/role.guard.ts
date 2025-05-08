import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../pages/service/auth.service'; // If you want to use the service to check roles
import { jwtDecode } from 'jwt-decode'; // Import jwt-decode
@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
    constructor(private authService: AuthService, private router: Router) { }

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): boolean {
        const requiredRole = next.data['role'];
        const userRole = this.authService.getCurrentUserRole();

        // Debug logging (remove in production)
        console.log('[RoleGuard] Required role:', requiredRole);
        console.log('[RoleGuard] User role:', userRole);

        // If route doesn't require specific role
        if (!requiredRole) return true;

        // If user not logged in
        if (!userRole) {
            this.router.navigate(['/auth/login']);
            return false;
        }

        // Check role (already normalized in getCurrentUserRole)
        if (userRole === requiredRole) {
            return true;
        }

        // If role doesn't match
        this.router.navigate(['auth/access']);
        return false;
    }
}

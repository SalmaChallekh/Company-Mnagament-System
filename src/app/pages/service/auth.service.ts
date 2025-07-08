import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';

interface TokenPayload {
    sub: string;
    role: string;
    exp: number;
    iat: number;
    // Extend as needed
}

interface LoginResponse {
    token: string;
    user?: {
        id: string;
        email: string;
        role: string;
    };
}
@Injectable({ providedIn: 'root' })
export class AuthService {
    private baseUrl = 'http://localhost:4001/api/auth';
    private tokenKey = 'token';

    constructor(private http: HttpClient, private router: Router) { }

    // Login method remains the same
    login(credentials: { email: string; password: string }): Observable<LoginResponse> {
        return this.http.post<LoginResponse>(`${this.baseUrl}/login`, credentials).pipe(
            tap((response) => {
                this.setToken(response.token);
            }),
            catchError(this.handleError)
        );
    }
    getCurrentUser(): Observable<any> {
        const token = localStorage.getItem('token');
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        return this.http.get<any>('http://localhost:4001/api/auth/me',  {
            headers: this.getHeaders()
        });
    }

    // Consolidated role-related methods
    getCurrentUserRole(): string | null {
        const decoded = this.getDecodedToken();
        if (!decoded) return null;

        // Handle both 'ROLE' and 'role' properties with proper normalization
        const role = (decoded as any).ROLE || (decoded as any).role;
        return role ? role.replace(/^ROLE_/, '') : null;
    }

    // Private method to decode token
    private getDecodedToken(): TokenPayload | null {
        const token = this.getToken();
        if (!token) return null;

        try {
            return jwtDecode<TokenPayload>(token);
        } catch (error) {
            console.error('Invalid token:', error);
            return null;
        }
    }
    // In AuthService
    public decodeToken(token: string): TokenPayload | null {
        try {
            return jwtDecode<TokenPayload>(token);
        } catch (error) {
            console.error('Invalid token:', error);
            return null;
        }
    }
    // Existing utility methods
    logout(): void {
        localStorage.removeItem(this.tokenKey);
        this.router.navigate(['/auth/login']);
    }

    setToken(token: string): void {
        localStorage.setItem(this.tokenKey, token);
    }

    getToken(): string | null {
        return localStorage.getItem(this.tokenKey);
    }

    isLoggedIn(): boolean {
        return !!this.getToken();
    }

    private handleError(error: HttpErrorResponse) {
        let errorMsg = 'An unknown error occurred!';
        if (error.error instanceof ErrorEvent) {
            errorMsg = `Client error: ${error.error.message}`;
        } else {
            errorMsg = `Server error: ${error.status}, ${error.message}`;
        }
        return throwError(() => new Error(errorMsg));
    }
     // Helper method for headers
    private getHeaders(): HttpHeaders {
        const token = localStorage.getItem('token');
        return new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        });
    }
}

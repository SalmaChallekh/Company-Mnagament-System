import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
@Injectable({ providedIn: 'root' })
export class AuthService {
    private apiUrl = 'http://localhost:4001/api/auth';

    constructor(private http: HttpClient) { }

    login(email: string, password: string) {
        return this.http.post<{ token: string }>(`${this.apiUrl}/login`, { email, password })
            .pipe(tap(res =>
                localStorage.setItem('token', res.token)
            ));
    }
    decodeToken(token: string) {
        const decoded: any = jwtDecode(token);
        return decoded.role;  // Or decode other parts of the token as needed
    }

    getToken(): string {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('Token not found');
        }
        return token;
    }


    isLoggedIn() {
        return !!this.getToken();
    }

    logout() {
        localStorage.removeItem('token');
    }
}

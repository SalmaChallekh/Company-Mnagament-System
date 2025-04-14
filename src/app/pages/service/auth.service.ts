import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
    private apiUrl = 'http://localhost:4001/api/auth';

    constructor(private http: HttpClient) { }

    login(email: string, password: string) {
        return this.http.post<{ token: string }>(`${this.apiUrl}/login`, { email, password })
            .pipe(tap(res => localStorage.setItem('token', res.token)));
    }

    getToken() {
        return localStorage.getItem('token');
    }

    isLoggedIn() {
        return !!this.getToken();
    }

    logout() {
        localStorage.removeItem('token');
    }
}

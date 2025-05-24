import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
//import { CreateUserRequest } from '../pages/admin/create-user/create-user.component';
import { catchError, Observable, throwError } from 'rxjs';

export interface User {
    id: number;
    //username: string | null;
    email: string;
    role: string;
    departmentId: number;
    enabled: number;
    //verificationToken?: string;
    // tokenExpiry?: Date;
}
export interface RoleOption {
    label: string;
    value: string;
}

export interface CreateUserRequest {
    email: string;
    role: string;
    departmentId: number;
}

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private apiUrl = 'http://localhost:4001/api';
    private apiUrl2 = 'http://localhost:4002/api/admin/departments';
    constructor(private http: HttpClient) { }
    private getAuthHeaders(): HttpHeaders {
        const token = localStorage.getItem('token');
        if (!token) {
            console.warn('No authentication token found');
        }
        return new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });
    }

    private handleError(error: HttpErrorResponse) {
        console.error('API Error:', error);
        let errorMessage = 'An unknown error occurred';

        if (error.error instanceof ErrorEvent) {
            // Client-side error
            errorMessage = `Error: ${error.error.message}`;
        } else {
            // Server-side error
            errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
            if (error.error && error.error.message) {
                errorMessage = error.error.message;
            }
        }
        return throwError(() => new Error(errorMessage));
    }
    createUser(request: CreateUserRequest): Observable<void> {
        return this.http.post<void>(`${this.apiUrl}/admin/create`, request, { headers: this.getHeaders() });
    }
    getRoles() {
        return this.http.get<RoleOption[]>(`${this.apiUrl}/roles`, {
            headers: this.getHeaders()
        });
    }
    getAllDepartments(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl2}/getAll`, {
            headers: this.getAuthHeaders()
        }).pipe(
            catchError(this.handleError)
        );
    }

    getUsers(): Observable<User[]> {
        return this.http.get<User[]>(`${this.apiUrl}/admin/users`, {
            headers: this.getHeaders()
        });
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

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CreateUserRequest } from '../pages/admin/create-user/create-user.component';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private apiUrl = 'http://localhost:4001/api/admin';

    constructor(private http: HttpClient) { }

    createUser(request: CreateUserRequest): Observable<void> {
        return this.http.post<void>(`${this.apiUrl}/create`, request);
    }
}

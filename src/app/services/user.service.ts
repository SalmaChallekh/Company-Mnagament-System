import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CreateUserRequest } from '../pages/admin/create-user/create-user.component';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private apiUrl = 'http://localhost:4001/api/admin/create';

    constructor(private http: HttpClient) { }

    createUser(request: CreateUserRequest) {
        return this.http.post(`${this.apiUrl}/create`, request);
    }
}

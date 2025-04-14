import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';

export interface CreateUserRequest {
    email: string;
    role: string; // Should match RoleEnum values like 'ADMIN', 'MANAGER', etc.
    departmentId: number;
  }
@Component({
    selector: 'app-create-user',
    templateUrl: './create-user.component.html'
})

export class CreateUserComponent {
    user = {
        email: '',
        role: '',
        departmentId: null
    };

    roles = [
        { label: 'Admin', value: 'ADMIN' },
        { label: 'User', value: 'USER' }
    ];

    constructor(private http: HttpClient) { }

    createUser() {
        this.http.post('/api/users/create', this.user).subscribe({
            next: () => alert('User created!'),
            error: (err) => alert('Failed: ' + err.error.message)
        });
    }
}

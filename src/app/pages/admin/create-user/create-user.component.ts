import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
export interface CreateUserRequest {
    email: string;
    role: string;
    departmentId: number;
}
@Component({
    selector: 'app-create-user',
    standalone: true,
    imports: [
        FormsModule,
        CommonModule,
        DropdownModule,
        InputTextModule,
        CardModule,
        ButtonModule
    ],
    templateUrl: './create-user.component.html'
})

export class CreateUserComponent {
    usersList = [
        { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'Active' },
        { id: 2, name: 'dd Doe', email: 'jane@example.com', role: 'User', status: 'Inactive' },
        { id: 3, name: 'Jzerzerane Doe', email: 'jane@example.com', role: 'User', status: 'Inactive' },
        { id: 4, name: 'Jzrzerangge Doe', email: 'jane@example.com', role: 'User', status: 'Inactive' },
        { id: 5, name: 'Jazerzreeeene Doe', email: 'jane@example.com', role: 'User', status: 'Inactive' }
    ];

    selectedUsers: any[] = [];
    userDialog: boolean = false;
    user: any = {};
    roles = ['Admin', 'User'];
    statuses = ['Active', 'Inactive'];
    constructor(private userService: UserService) { }

    openNew() {
        this.user = {};
        this.userDialog = true;
    }

    createUser() {
        if (this.user.id) {
            // Update logic here
        } else {
            const newUser: CreateUserRequest = {
                email: this.user.email,
                role: this.user.role.toUpperCase(), // matches RoleEnum
                departmentId: this.user.departmentId // make sure it's set in the form
            };

            this.userService.createUser(newUser).subscribe({
                next: () => {
                    console.log('User created successfully');
                    // Optionally add to usersList or fetch updated list
                },
                error: (err) => {
                    console.error('Error creating user:', err);
                }
            });
        }

        this.userDialog = false;
    }

    editUser(user: any) {
        this.user = { ...user }; // Populate form with user data
        this.userDialog = true;
    }

    deleteUser(user: any) {
        // Delete user logic here
    }

    deleteSelectedUsers() {
        // Delete selected users logic here
    }

    hideDialog() {
        this.userDialog = false;
    }
}

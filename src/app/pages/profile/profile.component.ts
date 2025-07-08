import { Component, OnInit } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { FormsModule } from '@angular/forms';
import { CheckboxModule } from 'primeng/checkbox';
import { UserService } from '../../services/user.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-profile',
    imports: [CheckboxModule, FormsModule,ToastModule,ButtonModule ,CommonModule],
    providers: [MessageService],
    templateUrl: './profile.component.html',
    styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
    user: any = {};
    editingPassword = false;
    newPassword = '';
    loading = false;

    constructor(
        private authService: AuthService,
        private userService: UserService,
        private messageService: MessageService
    ) { }

    ngOnInit(): void {
        this.authService.getCurrentUser().subscribe({
            next: (data) => (this.user = data),
            error: (err) => console.error('Failed to fetch user:', err),
        });
    }

    toggleEditPassword() {
        this.editingPassword = !this.editingPassword;
        this.newPassword = '';
         console.log('editingPassword:', this.editingPassword)
    }

    updatePassword() {
        if (!this.newPassword || this.newPassword.length < 6) {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Password must be at least 6 characters.',
            });
            return;
        }

        this.loading = true;
        this.userService.updatePassword(this.user.id, this.newPassword).subscribe({
            next: () => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Password updated successfully!',
                });
                this.editingPassword = false;
                this.newPassword = '';
            },
            error: () => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to update password.',
                });
            },
            complete: () => (this.loading = false),
        });
    }
}


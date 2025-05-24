import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ToastModule } from 'primeng/toast';
import { AuthService } from '../../pages/service/auth.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
    standalone: true,
    imports: [
        FormsModule,
        ButtonModule,
        InputTextModule,
        PasswordModule,
        ToastModule
    ],
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css'],
    providers: [MessageService]
})
export class LoginComponent {
    email = '';
    password = '';
    checked: boolean = false;
    isLoading = false;

    constructor(
        private authService: AuthService,
        private router: Router,
        private messageService: MessageService
    ) { }

    login() {
        this.isLoading = true;
        this.authService.login({ email: this.email, password: this.password }).subscribe({
            next: (response) => {
                this.isLoading = false;

                const token = response.token;
                const role = this.authService.decodeToken(token)?.role;

                const redirectUrl = role === 'ADMIN'
                    ? '/admin/dashboard'
                    : '/dashboard';

                this.router.navigate([redirectUrl]);
            },
            error: (error) => {
                this.isLoading = false;
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Invalid credentials'
                });
            }
        });
    }
}

import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ToastModule } from 'primeng/toast';
import { AuthService } from '../../pages/service/auth.service';
import { Router } from '@angular/router';


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
    providers: [MessageService]
})
export class LoginComponent {
    email = '';
    password = '';
    checked: boolean = false;

    constructor(
        private authService: AuthService,
        private router: Router,
        private messageService: MessageService
    ) { }

    isLoading = false;
    login() {
        this.isLoading = true;
        this.authService.login(this.email, this.password).subscribe({
            next: () => {
                this.isLoading = false;
                console.log('Login successful, navigating...');
                this.router.navigate(['/dashboard']);
                //this.router.navigate(['/']);
            },
            error: () => {
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

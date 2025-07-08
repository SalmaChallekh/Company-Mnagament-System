import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ToastModule } from 'primeng/toast';
import { AuthService } from '../../pages/service/auth.service';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { WebcamImage, WebcamInitError, WebcamModule, WebcamUtil } from 'ngx-webcam';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
@Component({
    standalone: true,
    imports: [
        FormsModule,
        ButtonModule,
        InputTextModule,
        PasswordModule,
        ToastModule,
        CommonModule,
        //WebcamModule
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

    // webcamImage: WebcamImage | null = null;
    // trigger: Subject<void> = new Subject<void>();

    constructor(
        private authService: AuthService,
        private router: Router,
        private messageService: MessageService,
        private http: HttpClient
    ) { }




    // triggerSnapshot(): void {
    //     this.trigger.next();
    // }

    // handleImage(webcamImage: WebcamImage): void {
    //     this.webcamImage = webcamImage;
    //     this.sendToAiService(webcamImage.imageAsBase64);
    // }


    // get triggerObservable(): Observable<void> {
    //     return this.trigger.asObservable();
    // }

    // sendToAiService(base64Image: string): void {
    //     this.http.post<any>('http://127.0.0.1:5000/verify', { image: base64Image })
    //         .subscribe(response => {
    //             if (response.present) {
    //                 console.log('✅ Face matched. Marking attendance...');
    //                 this.markAttendance(); // call Spring Boot attendance API
    //             } else {
    //                 alert('❌ Face not recognized. Try again.');
    //             }
    //         }, error => {
    //             console.error('Error communicating with AI service:', error);
    //         });
    // }

    // markAttendance(): void {
    //     const employeeId = 1; // You should get this from the logged-in user info
    //     this.http.post('http://localhost:8081/api/attendance/check-in', {
    //         employeeId
    //     }).subscribe(() => {
    //         alert('✅ Attendance marked successfully');
    //     });
    // }








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

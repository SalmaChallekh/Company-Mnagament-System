import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
    selector: 'app-complete-registration',
    templateUrl: './complete-registration.component.html',
    styleUrls: ['./complete-registration.component.css'],
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
    ],
})
export class CompleteRegistrationComponent implements OnInit {
    registrationForm!: FormGroup;
    token: string = '';
    message: string = '';
    submitting = false;

    constructor(
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private http: HttpClient,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.route.queryParams.subscribe(params => {
            this.token = params['token'] || '';
            if (!this.token) {
                this.message = 'Invalid or missing activation token';
                // Consider redirecting to an error page or login page
                // this.router.navigate(['/error'], { state: { message: 'Invalid activation link' } });
            }
        });

        this.initializeForm();
    }

    private initializeForm(): void {
        this.registrationForm = this.fb.group({
            username: ['', [Validators.required, Validators.minLength(3)]],
            password: ['', [Validators.required, Validators.minLength(6)]],
        });
    }

    get f() {
        return this.registrationForm.controls;
    }

    onSubmit(): void {
        if (this.registrationForm.invalid || !this.token) {
            this.markFormAsTouched();
            this.message = 'Please fill all fields correctly.';
            return;
        }

        this.completeRegistration();
    }

    private markFormAsTouched(): void {
        Object.values(this.registrationForm.controls).forEach(control => {
            control.markAsTouched();
        });
    }

    private completeRegistration(): void {
        this.submitting = true;
        this.message = '';

        const payload = {
            token: this.token,
            username: this.f['username'].value.trim(),
            password: this.f['password'].value,
        };

        this.http.post('http://localhost:4001/api/auth/complete-registration', payload)
            .subscribe({
                next: () => this.handleSuccess(),
                error: (err) => this.handleError(err)
            });
    }

    private handleSuccess(): void {
        this.message = '✅ Registration complete! Redirecting to login...';
        setTimeout(() => this.router.navigate(['/login']), 3000);
    }

    private handleError(err: any): void {
        this.submitting = false;
        this.message = err.error?.message ||
            err.statusText ||
            '❌ Failed to complete registration. Please try again.';

        // Optional: Clear password field on error
        this.registrationForm.get('password')?.reset();
    }
}

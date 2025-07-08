import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { ChartModule } from 'primeng/chart';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { KnobModule } from 'primeng/knob';
import { TableModule } from 'primeng/table';
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
    sub: string;
    ROLE: string;
}

interface EmployeeOption {
    label: string;
    value: number;
}

@Component({
    selector: 'app-evaluation-form',
    standalone: true,
    templateUrl: './evaluation-form.component.html',
    styleUrl: './evaluation-form.component.scss',
    imports: [
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        ButtonModule,
        DropdownModule,
        CalendarModule,
        ChartModule,
        TableModule,
        KnobModule,
        DialogModule
    ]
})
export class EvaluationFormComponent implements OnInit {
    evaluationForm!: FormGroup;
    employees: EmployeeOption[] = [];
    periodTypes = [
        { label: 'Monthly', value: 'MONTHLY' },
        { label: 'Quarterly', value: 'QUARTERLY' },
        { label: 'Yearly', value: 'YEARLY' }
    ];
    managerName?: string;
    evaluationDialog: boolean = false; // Controls dialog visibility

    constructor(private fb: FormBuilder, private http: HttpClient) { }

    ngOnInit(): void {
        this.decodeToken();
        this.initializeForm();
        this.loadEmployees();
    }

    private decodeToken(): void {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = jwtDecode<DecodedToken>(token);
                this.managerName = decoded.sub;
            } catch (error) {
                console.error('Error decoding token:', error);
            }
        } else {
            console.warn('No token found');
        }
    }

    private initializeForm(): void {
        this.evaluationForm = this.fb.group({
            employeeId: [null, Validators.required],
            evaluationDate: [new Date(), Validators.required],
            comments: ['', Validators.required],
            score: [null, [Validators.required, Validators.min(0), Validators.max(5)]],
            periodType: ['MONTHLY', Validators.required]
        });
    }

    private getHeaders(): HttpHeaders {
        const token = localStorage.getItem('token');
        return new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        });
    }

    loadEmployees(): void {
        this.http.get<any[]>('http://localhost:4001/api/user?role=ROLE_EMPLOYEE', {
            headers: this.getHeaders()
        }).subscribe({
            next: data => {
                this.employees = data
                    .filter(emp => emp.enabled)
                    .map(emp => ({ label: emp.username, value: emp.id }));
            },
            error: err => console.error('Failed to load employees:', err)
        });
    }

    submit(): void {
        if (this.evaluationForm.invalid) {
            this.evaluationForm.markAllAsTouched();
            return;
        }

        if (!this.managerName) {
            alert('Manager not identified.');
            return;
        }

        const payload = {
            ...this.evaluationForm.value,
            managerName: this.managerName
        };

        this.http.post('http://localhost:4008/api/evaluations', payload, {
            headers: this.getHeaders()
        }).subscribe({
            next: () => {
                alert('Evaluation submitted!');
                this.resetForm();
                this.evaluationDialog = false; // close dialog
            },
            error: err => {
                console.error('Submission error:', err);
                alert('Error submitting evaluation.');
            }
        });
    }

    resetForm(): void {
        this.evaluationForm.reset();
        this.evaluationForm.patchValue({
            evaluationDate: new Date(),
            periodType: 'MONTHLY'
        });
    }

    openDialog(): void {
        this.resetForm();
        this.evaluationDialog = true;
    }
    hideEvaluationDialog(): void {
        this.evaluationDialog = false;
    }

    closeDialog(): void {
        this.evaluationDialog = false;
    }
}

import { Component, NgModule, OnInit, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextarea } from 'primeng/inputtextarea';
import { MultiSelectModule } from 'primeng/multiselect';
import { ProgressBarModule } from 'primeng/progressbar';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { MessageService, ConfirmationService } from 'primeng/api';

interface LeaveRequest {
    id?: number;
    employeeId: number;
    employeeName?: string;
    //leaveType: string;
    startDate: Date;
    endDate: Date;
    daysRequested: number;
    reason: string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    approvedBy?: string;
}

@Component({
    selector: 'app-leave-request',
    templateUrl: './leave-request.component.html',
    styleUrls: ['./leave-request.component.scss'],
    providers: [MessageService, ConfirmationService],
    imports: [
        CommonModule,
        FormsModule,
        CalendarModule,
        CommonModule,
        FormsModule,
        TableModule,
        TagModule,
        ButtonModule,
        ToolbarModule,
        DialogModule,
        InputTextModule,
        InputTextarea,
        CalendarModule,
        DropdownModule,
        MultiSelectModule,
        ToastModule,
        CardModule,
        ConfirmDialogModule,
        ProgressBarModule,
        IconFieldModule,
        InputIconModule,
        DialogModule

    ]
})

export class LeaveRequestComponent implements OnInit {
    private http = inject(HttpClient);
    private baseUrl = 'http://localhost:4007/api/leaves';

    leaveRequests: LeaveRequest[] = [];
    leaveRequest: LeaveRequest = this.createEmptyLeaveRequest();
    leaveDialog: boolean = false;
    submitted: boolean = false;

    leaveTypes = [
        { label: 'Vacation', value: 'Vacation' },
        { label: 'Sick Leave', value: 'Sick Leave' },
        { label: 'Personal', value: 'Personal' }
    ];

    constructor() { }

    ngOnInit(): void {
        this.fetchLeaveRequests();
    }

    createEmptyLeaveRequest(): LeaveRequest {
        return {
            employeeId: 1, // Set dynamically in real app
            //leaveType: '',
            startDate: new Date(),
            endDate: new Date(),
            daysRequested: 1,
            reason: '',
            status: 'PENDING',
        };
    }

    openNew() {
        this.leaveRequest = this.createEmptyLeaveRequest();
        this.submitted = false;
        this.leaveDialog = true;
    }

    editLeave(leaveRequest: LeaveRequest) {
        this.leaveRequest = { ...leaveRequest };
        this.leaveDialog = true;
    }

    deleteLeave(request: LeaveRequest) {
        // If backend DELETE is implemented, use:
        // this.http.delete(`${this.baseUrl}/${request.id}`).subscribe(() => this.removeFromList(request.id!));
        this.removeFromList(request.id!);
    }

    removeFromList(id: number) {
        this.leaveRequests = this.leaveRequests.filter(r => r.id !== id);
    }

    hideDialog() {
        this.leaveDialog = false;
        this.submitted = false;
    }

    saveLeave() {
        this.submitted = true;

        if (this.leaveRequest.startDate && this.leaveRequest.endDate) {
            const isNew = !this.leaveRequest.id;

            if (isNew) {
                this.http.post<LeaveRequest>(`${this.baseUrl}/submit`, this.leaveRequest).subscribe(saved => {
                    this.leaveRequests.push(saved);
                    this.leaveDialog = false;
                });
            } else {
                // Optionally update if backend supports it
                this.leaveDialog = false;
            }
        }
    }

    fetchLeaveRequests() {
        const token = localStorage.getItem('token'); // Adjust this based on where you store the token
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });
        this.http.get<LeaveRequest[]>(`${this.baseUrl}/all`, { headers }).subscribe({
        next: data => {
            this.leaveRequests = data;
        },
        error: err => {
            console.error('Error fetching leave requests:', err);
        }
    });
    }

    approveLeave(request: LeaveRequest) {
        this.http.put<LeaveRequest>(`${this.baseUrl}/approve/${request.id}`, {}).subscribe(updated => {
            this.updateRequestInList(updated);
        });
    }

    rejectLeave(request: LeaveRequest) {
        this.http.put<LeaveRequest>(`${this.baseUrl}/reject/${request.id}`, {}).subscribe(updated => {
            this.updateRequestInList(updated);
        });
    }

    updateRequestInList(updated: LeaveRequest) {
        const index = this.leaveRequests.findIndex(r => r.id === updated.id);
        if (index !== -1) {
            this.leaveRequests[index] = updated;
        }
    }
}

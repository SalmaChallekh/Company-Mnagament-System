import { Component, NgModule, OnInit, ViewChild, inject } from '@angular/core';
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
import { Table, TableModule } from 'primeng/table';
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
    private messageService = inject(MessageService);
    private baseUrl = 'http://localhost:4007/api/leaves';

    leaveRequests: LeaveRequest[] = [];
    leaveRequest: LeaveRequest = this.createEmptyLeaveRequest();
    leaveDialog: boolean = false;
    submitted: boolean = false;

    constructor() {}

    @ViewChild('dt') dt!: Table;

    ngOnInit(): void {
        this.fetchLeaveRequests();
    }

    createEmptyLeaveRequest(): LeaveRequest {
        return {
            employeeId: 1,
            startDate: new Date(),
            endDate: new Date(),
            daysRequested: 1,
            reason: '',
            status: 'PENDING'
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
        this.removeFromList(request.id!);
        this.messageService.add({ severity: 'warn', summary: 'Deleted', detail: 'Leave request deleted' });
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
                this.http.post<LeaveRequest>(`${this.baseUrl}/submit`, this.leaveRequest).subscribe({
                    next: saved => {
                        this.leaveRequests.push(saved);
                        this.leaveDialog = false;
                        this.messageService.add({ severity: 'success', summary: 'Saved', detail: 'Leave request submitted' });
                    },
                    error: err => {
                        console.error('Error saving leave:', err);
                        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Could not submit leave request' });
                    }
                });
            } else {
                this.leaveDialog = false;
            }
        }
    }

    fetchLeaveRequests() {
        const token = localStorage.getItem('token');
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });

        this.http.get<LeaveRequest[]>(`${this.baseUrl}/all`, { headers }).subscribe({
            next: data => {
                this.leaveRequests = data;
            },
            error: err => {
                console.error('Error fetching leave requests:', err);
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Could not load leave requests' });
            }
        });
    }

    approveLeave(request: LeaveRequest) {
        const headers = this.getAuthHeaders();

        this.http.put<LeaveRequest>(`${this.baseUrl}/approve/${request.id}`, {}, { headers }).subscribe({
            next: updated => {
                this.updateRequestInList(updated);
                this.messageService.add({ severity: 'success', summary: 'Approved', detail: 'Leave request approved' });
            },
            error: err => {
                console.error('Approval error:', err);
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Approval failed' });
            }
        });
    }

    rejectLeave(request: LeaveRequest) {
        const headers = this.getAuthHeaders();

        this.http.put<LeaveRequest>(`${this.baseUrl}/reject/${request.id}`, {}, { headers }).subscribe({
            next: updated => {
                this.updateRequestInList(updated);
                this.messageService.add({ severity: 'warn', summary: 'Rejected', detail: 'Leave request rejected' });
            },
            error: err => {
                console.error('Rejection error:', err);
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Rejection failed' });
            }
        });
    }

    updateRequestInList(updated: LeaveRequest) {
        const index = this.leaveRequests.findIndex(r => r.id === updated.id);
        if (index !== -1) {
            this.leaveRequests[index] = updated;
        }
    }

    getStatusSeverity(status: string): 'success' | 'info' | 'warn' | 'danger' {
        switch (status) {
            case 'APPROVED': return 'success';
            case 'PENDING': return 'info';
            case 'REJECTED': return 'danger';
            default: return 'warn';
        }
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    private getAuthHeaders(): HttpHeaders {
        const token = localStorage.getItem('token') || '';
        return new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    }
}

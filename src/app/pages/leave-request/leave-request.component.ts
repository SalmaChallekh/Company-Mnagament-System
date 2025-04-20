import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { ToolbarModule } from 'primeng/toolbar';
import { DialogModule } from 'primeng/dialog';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextarea } from 'primeng/inputtextarea';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { InputNumberModule } from 'primeng/inputnumber';

export interface LeaveRequest {
    id: string;
    employeeId: string;
    employeeName: string;
    leaveType: 'ANNUAL' | 'SICK' | 'MATERNITY' | 'PATERNITY' | 'UNPAID';
    startDate: Date;
    endDate: Date;
    daysRequested: number;
    reason: string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    approvedBy?: string;
    approvedDate?: Date;
}

@Component({
    selector: 'app-leave-request',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        TableModule,
        ButtonModule,
        TagModule,
        ToolbarModule,
        DialogModule,
        CalendarModule,
        DropdownModule,
        InputTextarea,
        ConfirmDialogModule,
        ToastModule,
        InputNumberModule
    ],
    templateUrl: './leave-request.component.html',
    styleUrls: ['./leave-request.component.scss'],
    providers: [ConfirmationService, MessageService]
})
export class LeaveRequestComponent {
    leaveRequests = signal<LeaveRequest[]>([]);
    selectedLeaveRequests: LeaveRequest[] = [];
    leaveDialog = false;
    leaveRequest: LeaveRequest = this.emptyLeaveRequest();
    submitted = false;

    leaveTypes = [
        { label: 'Annual Leave', value: 'ANNUAL' },
        { label: 'Sick Leave', value: 'SICK' },
        { label: 'Maternity Leave', value: 'MATERNITY' },
        { label: 'Paternity Leave', value: 'PATERNITY' },
        { label: 'Unpaid Leave', value: 'UNPAID' }
    ];

    statuses = [
        { label: 'Pending', value: 'PENDING' },
        { label: 'Approved', value: 'APPROVED' },
        { label: 'Rejected', value: 'REJECTED' }
    ];

    constructor(
        private confirmationService: ConfirmationService,
        private messageService: MessageService
    ) { }

    ngOnInit() {
        this.loadSampleData();
    }

    loadSampleData() {
        const sampleData: LeaveRequest[] = [
            {
                id: '1',
                employeeId: 'EMP001',
                employeeName: 'John Doe',
                leaveType: 'ANNUAL',
                startDate: new Date(2023, 5, 1),
                endDate: new Date(2023, 5, 5),
                daysRequested: 5,
                reason: 'Family vacation',
                status: 'APPROVED',
                approvedBy: 'Manager',
                approvedDate: new Date(2023, 4, 25)
            },
            {
                id: '2',
                employeeId: 'EMP002',
                employeeName: 'Jane Smith',
                leaveType: 'SICK',
                startDate: new Date(2023, 5, 10),
                endDate: new Date(2023, 5, 12),
                daysRequested: 3,
                reason: 'Flu',
                status: 'APPROVED'
            },
            {
                id: '3',
                employeeId: 'EMP003',
                employeeName: 'Bob Johnson',
                leaveType: 'PATERNITY',
                startDate: new Date(2023, 6, 1),
                endDate: new Date(2023, 6, 14),
                daysRequested: 14,
                reason: 'Newborn baby',
                status: 'PENDING'
            }
        ];
        this.leaveRequests.set(sampleData);
    }

    emptyLeaveRequest(): LeaveRequest {
        return {
            id: '',
            employeeId: '',
            employeeName: '',
            leaveType: 'ANNUAL',
            startDate: new Date(),
            endDate: new Date(),
            daysRequested: 1,
            reason: '',
            status: 'PENDING'
        };
    }

    openNew() {
        this.leaveRequest = this.emptyLeaveRequest();
        this.submitted = false;
        this.leaveDialog = true;
    }

    editLeave(leave: LeaveRequest) {
        this.leaveRequest = { ...leave };
        this.leaveDialog = true;
    }

    deleteLeave(leave: LeaveRequest) {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete this leave request?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.leaveRequests.set(this.leaveRequests().filter(l => l.id !== leave.id));
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Leave Request Deleted',
                    life: 3000
                });
            }
        });
    }

    calculateDays() {
        if (this.leaveRequest.startDate && this.leaveRequest.endDate) {
            const diffTime = Math.abs(this.leaveRequest.endDate.getTime() - this.leaveRequest.startDate.getTime());
            this.leaveRequest.daysRequested = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
        }
    }

    saveLeave() {
        this.submitted = true;

        if (this.leaveRequest.employeeName?.trim() && this.leaveRequest.reason?.trim()) {
            if (this.leaveRequest.id) {
                // Update existing
                const index = this.leaveRequests().findIndex(l => l.id === this.leaveRequest.id);
                const updatedRequests = [...this.leaveRequests()];
                updatedRequests[index] = this.leaveRequest;
                this.leaveRequests.set(updatedRequests);

                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Leave Request Updated',
                    life: 3000
                });
            } else {
                // Create new
                this.leaveRequest.id = this.createId();
                this.leaveRequest.status = 'PENDING';
                this.leaveRequests.set([...this.leaveRequests(), this.leaveRequest]);
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Leave Request Created',
                    life: 3000
                });
            }

            this.leaveDialog = false;
            this.leaveRequest = this.emptyLeaveRequest();
        }
    }

    createId(): string {
        return Math.random().toString(36).substring(2, 9);
    }

    getSeverity(status: 'PENDING' | 'APPROVED' | 'REJECTED') {
        switch (status) {
            case 'APPROVED':
                return 'success';
            case 'PENDING':
                return 'warn';
            case 'REJECTED':
                return 'danger';
        }
    }
}

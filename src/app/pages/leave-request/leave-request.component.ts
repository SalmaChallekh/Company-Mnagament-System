import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextarea } from 'primeng/inputtextarea';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { ConfirmationService, MessageService } from 'primeng/api';

interface LeaveRequest {
    id: string;
    employeeName: string;
    leaveType: string;
    startDate: Date;
    endDate: Date;
    daysRequested: number;
    reason: string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    approvedBy?: string;
}

@Component({
    selector: 'app-leave-management',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        TableModule,
        TagModule,
        ButtonModule,
        ToolbarModule,
        DialogModule,
        InputTextModule,
        InputTextModule,
        CalendarModule,
        DropdownModule,
        InputNumberModule,
        ConfirmDialogModule,
        IconFieldModule,
        InputIconModule
    ],
    templateUrl: './leave-request.component.html',
    styleUrls: ['./leave-request.component.scss'],
    providers: [ConfirmationService, MessageService]
})
export class LeaveRequestComponent {
    leaveRequests = signal<LeaveRequest[]>([]);
    leaveTypes = ['Annual', 'Sick', 'Maternity', 'Paternity', 'Unpaid', 'Other'];
    selectedRequests: LeaveRequest[] = [];
    leaveDialog = false;
    leaveRequest: LeaveRequest = this.emptyRequest();

    cols = [
        { field: 'employeeName', header: 'Employee' },
        { field: 'leaveType', header: 'Leave Type' },
        { field: 'startDate', header: 'Start Date' },
        { field: 'daysRequested', header: 'Days' },
        { field: 'reason', header: 'Reason' },
        { field: 'status', header: 'Status' },
        { field: 'approvedBy', header: 'Approved By' }
    ];

    ngOnInit(): void {
        this.loadDemoData();
    }

    loadDemoData() {
        const demoRequests: LeaveRequest[] = [
            {
                id: '1',
                employeeName: 'John Doe',
                leaveType: 'Annual',
                startDate: new Date(2023, 10, 1),
                endDate: new Date(2023, 10, 5),
                daysRequested: 5,
                reason: 'Vacation with family',
                status: 'APPROVED',
                approvedBy: 'Jane Smith'
            },
            {
                id: '2',
                employeeName: 'Jane Smith',
                leaveType: 'Sick',
                startDate: new Date(2023, 10, 10),
                endDate: new Date(2023, 10, 12),
                daysRequested: 3,
                reason: 'Flu recovery',
                status: 'PENDING'
            }
        ];
        this.leaveRequests.set(demoRequests);
    }

    emptyRequest(): LeaveRequest {
        return {
            id: '',
            employeeName: '',
            leaveType: 'Annual',
            startDate: new Date(),
            endDate: new Date(),
            daysRequested: 1,
            reason: '',
            status: 'PENDING'
        };
    }

    openNew() {
        this.leaveRequest = this.emptyRequest();
        this.leaveDialog = true;
    }

    editLeave(request: LeaveRequest) {
        this.leaveRequest = { ...request };
        this.leaveDialog = true;
    }

    saveLeave() {
        const requests = this.leaveRequests();

        if (this.leaveRequest.id) {
            const index = requests.findIndex(r => r.id === this.leaveRequest.id);
            if (index !== -1) {
                requests[index] = { ...this.leaveRequest };
            }
        } else {
            this.leaveRequest.id = this.generateId();
            requests.push({ ...this.leaveRequest });
        }

        this.leaveRequests.set([...requests]);
        this.leaveDialog = false;
    }

    deleteLeave(request: LeaveRequest) {
        this.leaveRequests.set(this.leaveRequests().filter(r => r.id !== request.id));
    }

    calculateDays() {
        if (this.leaveRequest.startDate && this.leaveRequest.endDate) {
            const diffTime = Math.abs(this.leaveRequest.endDate.getTime() - this.leaveRequest.startDate.getTime());
            this.leaveRequest.daysRequested = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
        }
    }

    getStatusSeverity(status: string): 'success' | 'info' | 'warn' | 'danger' {
        switch (status) {
            case 'APPROVED':
                return 'success';
            case 'PENDING':
                return 'warn';
            case 'REJECTED':
                return 'danger';
            default:
                return 'info';
        }
    }

    exportCSV() {
        console.log('Exporting leave requests to CSV');
    }

    onGlobalFilter(table: any, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    hideDialog() {
        this.leaveDialog = false;
    }

    private generateId(): string {
        return Math.random().toString(36).substring(2, 9);
    }
}

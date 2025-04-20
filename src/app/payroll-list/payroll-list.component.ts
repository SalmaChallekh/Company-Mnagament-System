import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { ToolbarModule } from 'primeng/toolbar';
import { DialogModule } from 'primeng/dialog';
import { CalendarModule } from 'primeng/calendar';
import { InputNumberModule } from 'primeng/inputnumber';
import { DropdownModule } from 'primeng/dropdown';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';

export interface Payroll {
    id: string;
    employeeId: string;
    employeeName: string;
    periodStart: Date;
    periodEnd: Date;
    basicSalary: number;
    allowances: number;
    deductions: number;
    netSalary: number;
    status: 'DRAFT' | 'PROCESSED' | 'PAID' | 'CANCELLED';
    paymentDate?: Date;
}

@Component({
    selector: 'app-payroll-list',
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
        InputNumberModule,
        DropdownModule,
        ConfirmDialogModule,
        ToastModule
    ],
    templateUrl: './payroll-list.component.html',
    styleUrls: ['./payroll-list.component.scss'],
    providers: [ConfirmationService, MessageService]
})
export class PayrollListComponent {
    payrolls = signal<Payroll[]>([]);
    selectedPayrolls: Payroll[] = [];
    payrollDialog = false;
    payroll: Payroll = this.emptyPayroll();
    submitted = false;

    statuses = [
        { label: 'Draft', value: 'DRAFT' },
        { label: 'Processed', value: 'PROCESSED' },
        { label: 'Paid', value: 'PAID' },
        { label: 'Cancelled', value: 'CANCELLED' }
    ];

    constructor(
        private confirmationService: ConfirmationService,
        private messageService: MessageService
    ) { }

    ngOnInit() {
        this.loadSampleData();
    }

    loadSampleData() {
        const sampleData: Payroll[] = [
            {
                id: '1',
                employeeId: 'EMP001',
                employeeName: 'John Doe',
                periodStart: new Date(2023, 5, 1),
                periodEnd: new Date(2023, 5, 30),
                basicSalary: 5000,
                allowances: 1000,
                deductions: 500,
                netSalary: 5500,
                status: 'PAID',
                paymentDate: new Date(2023, 5, 5)
            },
            {
                id: '2',
                employeeId: 'EMP002',
                employeeName: 'Jane Smith',
                periodStart: new Date(2023, 5, 1),
                periodEnd: new Date(2023, 5, 30),
                basicSalary: 6000,
                allowances: 1200,
                deductions: 600,
                netSalary: 6600,
                status: 'PROCESSED'
            },
            {
                id: '3',
                employeeId: 'EMP003',
                employeeName: 'Bob Johnson',
                periodStart: new Date(2023, 5, 1),
                periodEnd: new Date(2023, 5, 30),
                basicSalary: 4500,
                allowances: 900,
                deductions: 450,
                netSalary: 4950,
                status: 'DRAFT'
            }
        ];
        this.payrolls.set(sampleData);
    }

    emptyPayroll(): Payroll {
        return {
            id: '',
            employeeId: '',
            employeeName: '',
            periodStart: new Date(),
            periodEnd: new Date(),
            basicSalary: 0,
            allowances: 0,
            deductions: 0,
            netSalary: 0,
            status: 'DRAFT'
        };
    }

    openNew() {
        this.payroll = this.emptyPayroll();
        this.submitted = false;
        this.payrollDialog = true;
    }

    editPayroll(payroll: Payroll) {
        this.payroll = { ...payroll };
        this.payrollDialog = true;
    }

    deletePayroll(payroll: Payroll) {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete this payroll record?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.payrolls.set(this.payrolls().filter(p => p.id !== payroll.id));
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Payroll Deleted',
                    life: 3000
                });
            }
        });
    }

    calculateNetSalary() {
        this.payroll.netSalary = this.payroll.basicSalary +
            this.payroll.allowances -
            this.payroll.deductions;
    }

    savePayroll() {
        this.submitted = true;

        if (this.payroll.employeeName?.trim()) {
            if (this.payroll.id) {
                // Update existing
                const index = this.payrolls().findIndex(p => p.id === this.payroll.id);
                const updatedPayrolls = [...this.payrolls()];
                updatedPayrolls[index] = this.payroll;
                this.payrolls.set(updatedPayrolls);

                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Payroll Updated',
                    life: 3000
                });
            } else {
                // Create new
                this.payroll.id = this.createId();
                this.payrolls.set([...this.payrolls(), this.payroll]);
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Payroll Created',
                    life: 3000
                });
            }

            this.payrollDialog = false;
            this.payroll = this.emptyPayroll();
        }
    }

    createId(): string {
        return Math.random().toString(36).substring(2, 9);
    }

    getSeverity(status: 'DRAFT' | 'PROCESSED' | 'PAID' | 'CANCELLED') {
        switch (status) {
            case 'PAID':
                return 'success';
            case 'PROCESSED':
                return 'info';
            case 'DRAFT':
                return 'warn';
            case 'CANCELLED':
                return 'danger';
        }
    }
}

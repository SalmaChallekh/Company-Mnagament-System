import { Component, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Table, TableModule } from 'primeng/table';
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
import { Payroll, PayrollService } from '../services/payroll.service';
import { IconFieldModule } from 'primeng/iconfield';
import { InputTextModule } from 'primeng/inputtext';
import { InputIconModule } from 'primeng/inputicon';

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
        ToastModule,
        IconFieldModule,
        InputTextModule, InputIconModule
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
        { label: 'Pending', value: 'PENDING' },
        { label: 'Processed', value: 'PROCESSED' },
        { label: 'Failed', value: 'FAILED' }
    ];
    @ViewChild('dt') dt!: Table;
    constructor(
        private confirmationService: ConfirmationService,
        private messageService: MessageService,
        private payrollService: PayrollService
    ) { }

    ngOnInit() {
        this.loadPayrolls();
    }

    loadPayrolls() {
        this.payrollService.getPayrolls().subscribe({
            next: (data) => this.payrolls.set(data),
            error: () => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to load payrolls',
                    life: 3000
                });
            }
        });
    }

    emptyPayroll(): Payroll {
        return {
            id: 0,
            employeeId: 0,
            date: new Date(),
            baseSalary: 0,
            bonuses: 0,
            deductions: 0,
            totalSalary: 0,
            status: 'PENDING'
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
            message: 'Are you sure you want to delete this payroll?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.payrollService.deletePayroll(payroll.id).subscribe(() => {
                    this.payrolls.set(this.payrolls().filter(p => p.id !== payroll.id));
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Deleted',
                        detail: 'Payroll deleted',
                        life: 3000
                    });
                });
            }
        });
    }

    calculateTotalSalary() {
        this.payroll.totalSalary =
            (this.payroll.baseSalary || 0) +
            (this.payroll.bonuses || 0) -
            (this.payroll.deductions || 0);
    }

    savePayroll() {
        this.submitted = true;
        if (this.payroll.employeeId) {
            const isNew = !this.payroll.id;
            const action$ = isNew
                ? this.payrollService.createPayroll(this.payroll)
                : this.payrollService.updatePayroll(this.payroll.id, this.payroll);

            action$.subscribe({
                next: (result) => {
                    if (isNew) {
                        this.payrolls.set([...this.payrolls(), result]);
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Created',
                            detail: 'Payroll created',
                            life: 3000
                        });
                    } else {
                        const updatedList = [...this.payrolls()];
                        const idx = updatedList.findIndex(p => p.id === this.payroll.id);
                        if (idx !== -1) updatedList[idx] = result;
                        this.payrolls.set(updatedList);
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Updated',
                            detail: 'Payroll updated',
                            life: 3000
                        });
                    }
                    this.closeDialog();
                },
                error: () => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Could not save payroll',
                        life: 3000
                    });
                }
            });
        }
    }

    closeDialog() {
        this.payrollDialog = false;
        this.payroll = this.emptyPayroll();
    }

    getSeverity(status: Payroll['status']) {
        switch (status) {
            case 'PENDING': return 'warn';
            case 'PROCESSED': return 'info';
            case 'FAILED': return 'danger';
        }
    }
    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }
    selectedMonth: Date = new Date();
    exportCsv() {
    const monthString = this.selectedMonth.toISOString().split('T')[0]; // "yyyy-MM-dd"
    this.payrollService.exportCsv(monthString).subscribe({
        next: (blob) => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `payroll-${monthString}.csv`;
            a.click();
            window.URL.revokeObjectURL(url);
        },
        error: (err) => {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Export failed'
            });
        }
    });
}
    // downloadCsv(month: string) {
    //     this.payrollService.exportCsv(month).subscribe({
    //         next: (blob) => {
    //             const url = window.URL.createObjectURL(blob);
    //             const a = document.createElement('a');
    //             a.href = url;
    //             a.download = `payroll-${month}.csv`;
    //             a.click();
    //             window.URL.revokeObjectURL(url);
    //         },
    //         error: (err) => {
    //             console.error('Failed to download CSV', err);
    //         }
    //     });
    // }

}

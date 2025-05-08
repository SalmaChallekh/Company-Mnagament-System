import { Component, OnInit, signal, ViewChild } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table, TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { TagModule } from 'primeng/tag';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DropdownModule } from 'primeng/dropdown';
import { SelectButtonModule } from 'primeng/selectbutton';

interface Employee {
    id?: string;
    username: string;
    email: string;
    department: string;
    role: string;
    status: 'ENABLED' | 'DISABLED' | 'WAITING';
}

interface Column {
    field: string;
    header: string;
    customExportHeader?: string;
}

interface ExportColumn {
    title: string;
    dataKey: string;
}

@Component({
    selector: 'app-crud',
    standalone: true,
    imports: [
        CommonModule,
        TableModule,
        FormsModule,
        ButtonModule,
        RippleModule,
        ToastModule,
        ToolbarModule,
        InputTextModule,
        DialogModule,
        TagModule,
        InputIconModule,
        IconFieldModule,
        ConfirmDialogModule,
        DropdownModule,
        SelectButtonModule
    ],
    template: `
        <p-toolbar styleClass="mb-6">
            <ng-template #start>
                <p-button label="New" icon="pi pi-plus" severity="secondary" class="mr-2" (onClick)="openNew()" />
            </ng-template>

            <ng-template #end>
                <p-button label="Export" icon="pi pi-upload" severity="secondary" (onClick)="exportCSV()" />
            </ng-template>
        </p-toolbar>

        <p-table
            #dt
            [value]="employees()"
            [rows]="10"
            [columns]="cols"
            [paginator]="true"
            [globalFilterFields]="['username', 'email', 'department', 'role', 'status']"
            [tableStyle]="{ 'min-width': '75rem' }"
            [(selection)]="selectedEmployees"
            [rowHover]="true"
            dataKey="id"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} employees"
            [showCurrentPageReport]="true"
            [rowsPerPageOptions]="[10, 20, 30]"
        >
            <ng-template #caption>
                <div class="flex items-center justify-between">
                    <h5 class="m-0">Manage Employees</h5>
                    <p-iconfield>
                        <p-inputicon styleClass="pi pi-search" />
                        <input pInputText type="text" (input)="onGlobalFilter(dt, $event)" placeholder="Search..." />
                    </p-iconfield>
                </div>
            </ng-template>
            <ng-template #header>
                <tr>
                    <th style="width: 3rem">
                        <p-tableHeaderCheckbox />
                    </th>
                    <th pSortableColumn="username" style="min-width:12rem">
                        Username
                        <p-sortIcon field="username" />
                    </th>
                    <th pSortableColumn="email" style="min-width:16rem">
                        Email
                        <p-sortIcon field="email" />
                    </th>
                    <th pSortableColumn="department" style="min-width:10rem">
                        Department
                        <p-sortIcon field="department" />
                    </th>
                    <th pSortableColumn="role" style="min-width:10rem">
                        Role
                        <p-sortIcon field="role" />
                    </th>
                    <th pSortableColumn="status" style="min-width:10rem">
                        Status
                        <p-sortIcon field="status" />
                    </th>
                    <th style="min-width: 12rem"></th>
                </tr>
            </ng-template>
            <ng-template #body let-employee>
                <tr>
                    <td style="width: 3rem">
                        <p-tableCheckbox [value]="employee" />
                    </td>
                    <td style="min-width: 12rem">{{ employee.username }}</td>
                    <td style="min-width: 16rem">{{ employee.email }}</td>
                    <td>{{ employee.department }}</td>
                    <td>{{ employee.role }}</td>
                    <td>
                        <p-tag [value]="employee.status" [severity]="getSeverity(employee.status)" />
                    </td>
                    <td>
                        <p-button icon="pi pi-pencil" class="mr-2" [rounded]="true" [outlined]="true" (click)="editEmployee(employee)" />
                        <p-button icon="pi pi-trash" severity="danger" [rounded]="true" [outlined]="true" (click)="deleteEmployee(employee)" />
                    </td>
                </tr>
            </ng-template>
        </p-table>

        <p-dialog [(visible)]="employeeDialog" [style]="{ width: '550px' }" header="Employee Details" [modal]="true">
            <ng-template #content>
                <div class="flex flex-col gap-6">
                    <div>
                        <label for="username" class="block font-bold mb-3">Username</label>
                        <input type="text" pInputText id="username" [(ngModel)]="employee.username" required autofocus />
                    </div>

                    <div>
                        <label for="email" class="block font-bold mb-3">Email</label>
                        <input type="email" pInputText id="email" [(ngModel)]="employee.email" required />
                    </div>

                    <div>
                        <label for="department" class="block font-bold mb-3">Department</label>
                        <p-dropdown [options]="departments" [(ngModel)]="employee.department"
                                   placeholder="Select Department" inputId="department"></p-dropdown>
                    </div>

                    <div>
                        <label for="role" class="block font-bold mb-3">Role</label>
                        <p-dropdown [options]="roles" [(ngModel)]="employee.role"
                                   placeholder="Select Role" inputId="role"></p-dropdown>
                    </div>

                    <div>
                        <label for="status" class="block font-bold mb-3">Status</label>
                        <p-selectButton [options]="statuses" [(ngModel)]="employee.status"
                                       optionLabel="label" optionValue="value" inputId="status"></p-selectButton>
                    </div>
                </div>
            </ng-template>

            <ng-template #footer>
                <p-button label="Cancel" icon="pi pi-times" text (click)="hideDialog()" />
                <p-button label="Save" icon="pi pi-check" (click)="saveEmployee()" />
            </ng-template>
        </p-dialog>

        <p-confirmdialog [style]="{ width: '450px' }" />
    `,
    providers: [MessageService, ConfirmationService]
})
export class Crud implements OnInit {
    employeeDialog: boolean = false;
    employees = signal<Employee[]>([]);
    employee: Employee = {
        username: '',
        email: '',
        department: '',
        role: '',
        status: 'WAITING'
    };
    selectedEmployees: Employee[] | null = null;
    submitted: boolean = false;

    statuses = [
        { label: 'ENABLED', value: 'ENABLED' },
        { label: 'DISABLED', value: 'DISABLED' },
        { label: 'WAITING', value: 'WAITING' }
    ];

    roles = ['Admin', 'Manager', 'Developer', 'Designer', 'HR'];
    departments = ['IT', 'HR', 'Finance', 'Marketing', 'Operations'];

    cols: Column[] = [
        { field: 'username', header: 'Username' },
        { field: 'email', header: 'Email' },
        { field: 'department', header: 'Department' },
        { field: 'role', header: 'Role' },
        { field: 'status', header: 'Status' }
    ];

    exportColumns: ExportColumn[] = this.cols.map((col) => ({ title: col.header, dataKey: col.field }));

    @ViewChild('dt') dt!: Table;

    constructor(
        private messageService: MessageService,
        private confirmationService: ConfirmationService
    ) { }

    ngOnInit() {
        this.loadDemoData();
    }

    loadDemoData() {
        this.employees.set([
            { id: '1', username: 'jdoe', email: 'jdoe@example.com', department: 'IT', role: 'Developer', status: 'ENABLED' },
            { id: '2', username: 'asmith', email: 'asmith@example.com', department: 'HR', role: 'HR', status: 'ENABLED' },
            { id: '3', username: 'mjohnson', email: 'mjohnson@example.com', department: 'Finance', role: 'Manager', status: 'WAITING' }
        ]);
    }

    exportCSV() {
        this.dt.exportCSV();
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    openNew() {
        this.employee = {
            username: '',
            email: '',
            department: '',
            role: '',
            status: 'WAITING'
        };
        this.submitted = false;
        this.employeeDialog = true;
    }

    editEmployee(employee: Employee) {
        this.employee = { ...employee };
        this.employeeDialog = true;
    }

    deleteSelectedEmployees() {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete the selected employees?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.employees.set(this.employees().filter((val) => !this.selectedEmployees?.includes(val)));
                this.selectedEmployees = null;
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Employees Deleted',
                    life: 3000
                });
            }
        });
    }

    hideDialog() {
        this.employeeDialog = false;
        this.submitted = false;
    }

    deleteEmployee(employee: Employee) {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete ' + employee.username + '?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.employees.set(this.employees().filter((val) => val.id !== employee.id));
                this.employee = {
                    username: '',
                    email: '',
                    department: '',
                    role: '',
                    status: 'WAITING'
                };
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Employee Deleted',
                    life: 3000
                });
            }
        });
    }

    findIndexById(id: string): number {
        let index = -1;
        for (let i = 0; i < this.employees().length; i++) {
            if (this.employees()[i].id === id) {
                index = i;
                break;
            }
        }
        return index;
    }

    createId(): string {
        let id = '';
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < 5; i++) {
            id += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return id;
    }

    getSeverity(status: string) {
        switch (status) {
            case 'ENABLED':
                return 'success';
            case 'DISABLED':
                return 'danger';
            case 'WAITING':
                return 'warn';
            default:
                return 'info';
        }
    }

    saveEmployee() {
        this.submitted = true;
        let _employees = this.employees();

        if (this.employee.username?.trim() && this.employee.email?.trim()) {
            if (this.employee.id) {
                _employees[this.findIndexById(this.employee.id)] = this.employee;
                this.employees.set([..._employees]);
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Employee Updated',
                    life: 3000
                });
            } else {
                this.employee.id = this.createId();
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Employee Created',
                    life: 3000
                });
                this.employees.set([..._employees, this.employee]);
            }

            this.employeeDialog = false;
            this.employee = {
                username: '',
                email: '',
                department: '',
                role: '',
                status: 'WAITING'
            };
        }
    }
}

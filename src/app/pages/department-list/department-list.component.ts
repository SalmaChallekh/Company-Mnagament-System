import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { TableModule, Table } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { TagModule } from 'primeng/tag';
import { SelectButtonModule } from 'primeng/selectbutton';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { RippleModule } from 'primeng/ripple';
import { DepartmentService } from '../../services/department.service';

export interface Department {
    id: number;
    name: string;
    description: string;
}

export interface DepartmentRequest {
    id:number;
    name: string;
    description: string;
}

export interface DepartmentResponse {
    id: number;
    name: string;
    description: string;
}


interface ExportColumn {
    title: string;
    dataKey: string;
}
@Component({
    selector: 'app-department-list',
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
    templateUrl: './department-list.component.html',
    providers: [ConfirmationService, MessageService]
})
export class DepartmentListComponent implements OnInit {
    departments: Department[] = [];
    selectedDepartments: Department[] = [];
    departmentDialog: boolean = false;
    department: DepartmentRequest = {id: 0,name: '', description: '',
    };
    submitted: boolean = false;
    isLoading: boolean = false;

    cols = [
        { field: 'name', header: 'Name' },
        { field: 'description', header: 'Description' }
    ];

    exportColumns = this.cols.map(col => ({
        title: col.header,
        dataKey: col.field
    }));

    @ViewChild('dt') dt!: Table;

    constructor(
        private departmentService: DepartmentService,
        private confirmationService: ConfirmationService,
        private messageService: MessageService
    ) { }

    ngOnInit() {
        this.loadDepartments();
    }

    loadDepartments(): void {
        this.isLoading = true;
        this.departmentService.getAllDepartments().subscribe({
            next: (departments) => {
                this.departments = departments;
                this.isLoading = false;
            },
            error: (error) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to load departments'
                });
                this.isLoading = false;
            }
        });
    }

    openNew() {
        this.department = {id: 0, name: '', description: '' };
        this.submitted = false;
        this.departmentDialog = true;
    }

    hideDialog() {
        this.departmentDialog = false;
        this.submitted = false;
    }

    editDepartment(department: Department) {
        this.department = {
            id: department.id,
            name: department.name,
            description: department.description
        };
        this.departmentDialog = true;
    }

    saveDepartment() {
        this.submitted = true;

        if (!this.department.name?.trim()) return;

        this.isLoading = true;

        const request: DepartmentRequest = {
            id:this.department.id,
            name: this.department.name,
            description: this.department.description
        };

        const operation = this.department.id
            ? this.departmentService.updateDepartment(this.department.id, request)
            : this.departmentService.createDepartment(request);

        operation.subscribe({
            next: () => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: this.department.id ? 'Department Updated' : 'Department Created',
                    life: 3000
                });
                this.loadDepartments();
                this.departmentDialog = false;
                this.department = { id: 0,name: '', description: '' };
                this.isLoading = false;
            },
            error: (error) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: error.error?.message || 'Operation failed'
                });
                this.isLoading = false;
            }
        });
    }

    deleteDepartment(department: Department) {
        this.confirmationService.confirm({
            message: `Are you sure you want to delete ${department.name}?`,
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.departmentService.deleteDepartment(department.id).subscribe({
                    next: () => {
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Successful',
                            detail: 'Department Deleted',
                            life: 3000
                        });
                        this.loadDepartments();
                    },
                    error: (error) => {
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: error.error?.message || 'Failed to delete department'
                        });
                    }
                });
            }
        });
    }

    deleteSelectedDepartments() {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete the selected departments?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                const deleteRequests = this.selectedDepartments.map(department =>
                    this.departmentService.deleteDepartment(department.id)
                );

                // You might want to use forkJoin here for multiple parallel requests
                deleteRequests[0].subscribe({
                    next: () => {
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Successful',
                            detail: 'Departments Deleted',
                            life: 3000
                        });
                        this.loadDepartments();
                        this.selectedDepartments = [];
                    },
                    error: (error) => {
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: error.error?.message || 'Failed to delete departments'
                        });
                    }
                });
            }
        });
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }
}

import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Table, TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ProjectService } from '../../services/project.service';
import { RippleModule } from 'primeng/ripple';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TextareaModule } from 'primeng/textarea';
import { Router } from '@angular/router';

@Component({
    selector: 'app-project-management',
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
        SelectButtonModule,
        TextareaModule,
        CalendarModule
    ],
    templateUrl: './project-management.component.html',
    styleUrl: './project-management.component.scss',
    providers: [MessageService, ConfirmationService]
})
export class ProjectManagementComponent implements OnInit {
    projectDialog: boolean = false;
    submitted: boolean = false;
    editMode: boolean = false;
    projects: any[] = [];
    selectedProjects: any[] = [];
    statusOptions = [
        { label: 'Planned', value: 'PLANNED' },
        { label: 'In Progress', value: 'IN_PROGRESS' },
        { label: 'Completed', value: 'COMPLETED' }
    ];

    project: any = {
        name: '',
        description: '',
        startDate: new Date(),
        endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
        status: 'PLANNED',
        managerId: 0,
        departmentId: 0
    };

    departments: any[] = [];
    managers: any[] = [];

    constructor(
        private projectService: ProjectService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.loadProjects();
    }

    loadProjects() {
        this.projectService.getAllProjects().subscribe({
            next: (res) => (this.projects = res),
            error: () => this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to load projects',
                life: 3000
            })
        });
    }
    goToGantt() {
        this.router.navigate(['/gantt']);
    }

    openNew() {
        this.project = {
            name: '',
            description: '',
            startDate: new Date(),
            endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
            status: 'PLANNED',
            managerId: 0,
            departmentId: 0
        };
        this.editMode = false;
        this.fetchDepartmentsAndManagers();
        this.projectDialog = true;
    }

    fetchDepartmentsAndManagers() {
        this.projectService.getAllDepartments().subscribe({
            next: (res) => (this.departments = res),
            error: () => this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to fetch departments',
                life: 3000
            })
        });

        this.projectService.getAllManagers().subscribe({
            next: (res) => (this.managers = res),
            error: () => this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to fetch managers',
                life: 3000
            })
        });
    }

    editProject(project: any) {
        this.project = { ...project };
        this.editMode = true;
        this.projectDialog = true;
    }

    confirmDelete(project: any) {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete ' + project.name + '?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.deleteProject(project.id);
            }
        });
    }

    deleteProject(id: string) {
        this.projectService.deleteProject(id).subscribe({
            next: () => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Project Deleted',
                    life: 3000
                });
                this.loadProjects();
            },
            error: () => this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to delete project',
                life: 3000
            })
        });
    }

    getStatusSeverity(status: string): 'success' | 'info' | 'warn' | 'danger' {
        switch (status) {
            case 'COMPLETED': return 'success';
            case 'IN_PROGRESS': return 'info';
            case 'BLOCKED': return 'danger';
            case 'NOT_STARTED':
            default: return 'warn';
        }
    }

    getDepartmentName(id: number) {
        const dept = this.departments.find(d => d.id === id);
        return dept ? dept.name : 'Unknown';
    }
    getManagerEmail(id: number): string {
        if (!id) return 'Unassigned';

        const manager = this.managers.find(m => m.id == id); // Use == for loose comparison
        if (!manager) {
            console.warn('Manager not found for ID:', id, 'Available managers:', this.managers);
            return 'Unknown';
        }
        return manager.email;
    }
    //     getManagerName(id: number): string {
    //     if (!id) return 'Unassigned';

    //     const manager = this.managers.find(m => m.id == id); // Use == for loose comparison
    //     if (!manager) {
    //         console.warn('Manager not found for ID:', id, 'Available managers:', this.managers);
    //         return 'Unknown';
    //     }
    //     return manager.name || `${manager.firstName} ${manager.lastName}` || 'Unnamed';
    // }

    saveProject() {
        this.submitted = true;

        if (!this.project.name || !this.project.departmentId || !this.project.managerId) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Validation',
                detail: 'Name, Department, and Manager are required',
                life: 3000
            });
            return;
        }

        const action = this.editMode
            ? this.projectService.updateProject(this.project)
            : this.projectService.createProject(this.project);

        action.subscribe({
            next: () => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: `Project ${this.editMode ? 'Updated' : 'Created'}`,
                    life: 3000
                });
                this.projectDialog = false;
                this.loadProjects();
            },
            error: () => this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: `Failed to ${this.editMode ? 'update' : 'create'} project`,
                life: 3000
            })
        });
    }

    hideDialog() {
        this.projectDialog = false;
        this.submitted = false;
    }
    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

}

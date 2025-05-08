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
import { MultiSelectModule } from 'primeng/multiselect';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { CardModule } from 'primeng/card';
import { ProgressBarModule } from 'primeng/progressbar';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ProjectService } from '../../services/project.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-project-management',
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
        InputTextarea,
        CalendarModule,
        DropdownModule,
        MultiSelectModule,
        ToastModule,
        CardModule,
        ConfirmDialogModule,
        ProgressBarModule,
        IconFieldModule,
        InputIconModule
    ],
    templateUrl: './project-management.component.html',
    styleUrl: './project-management.component.scss',
    providers: [MessageService, ConfirmationService]
})
export class ProjectManagementComponent {
    projects = signal<any[]>([]);
    selectedProjects: any[] = [];
    projectDialog = false;
    loading = signal(false);
    deleteProjectDialog = false;
    projectToDelete: any = null;

    project: any = {
        name: '',
        description: '',
        startDate: new Date(),
        endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
        status: 'PLANNED',
        ownerId: 0,
        departmentId: 0
    };

    statusOptions = [
        { label: 'Planned', value: 'PLANNED' },
        { label: 'In Progress', value: 'IN_PROGRESS' },
        { label: 'Completed', value: 'COMPLETED' },
        { label: 'On Hold', value: 'ON_HOLD' }
    ];

    cols = [
        { field: 'name', header: 'Project' },
        { field: 'description', header: 'Description' },
        { field: 'startDate', header: 'Start Date' },
        { field: 'endDate', header: 'End Date' },
        { field: 'status', header: 'Status' }
    ];

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
        this.loading.set(true);
        this.projectService.getAllProjects().subscribe({
            next: (projects) => {
                this.projects.set(projects);
                this.loading.set(false);
            },
            error: (err) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to load projects',
                    life: 3000
                });
                this.loading.set(false);
            }
        });
    }

    openNew() {
        this.project = {
            name: '',
            description: '',
            startDate: new Date(),
            endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
            status: 'PLANNED',
            ownerId: 0,
            departmentId: 0
        };
        this.projectDialog = true;
    }

    editProject(project: any) {
        this.project = { ...project };
        this.projectDialog = true;
    }

    confirmDelete(project: any) {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete this project?',
            header: 'Confirm Deletion',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Delete',
            rejectLabel: 'Cancel',
            acceptButtonStyleClass: 'p-button-danger',
            rejectButtonStyleClass: 'p-button-secondary',
            accept: () => {
                this.deleteProject(project);
            }
        });
    }

    deleteProject(project: any) {
        this.loading.set(true);

        this.projectService.deleteProject(project.id).subscribe({
            next: () => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Project deleted successfully',
                    life: 3000
                });
                this.projects.update(projects => projects.filter(p => p.id !== project.id));
            },
            error: (err) => {
                let errorDetail = 'Failed to delete project';
                if (err.status === 403) {
                    errorDetail = 'You lack permissions to delete projects';
                } else if (err.status === 404) {
                    errorDetail = 'Project not found';
                }

                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: errorDetail,
                    life: 3000
                });
            },
            complete: () => {
                this.loading.set(false);
                this.deleteProjectDialog = false;
                this.projectToDelete = null;
            }
        });
    }

    saveProject() {
        this.loading.set(true);

        if (this.project.id) {
            // Update existing project
            this.projectService.updateProject(this.project).subscribe({
                next: () => {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'Project updated',
                        life: 3000
                    });
                    this.loadProjects();
                    this.projectDialog = false;
                },
                error: (err) => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Failed to update project',
                        life: 3000
                    });
                    this.loading.set(false);
                }
            });
        } else {
            // Create new project
            this.projectService.createProject(this.project).subscribe({
                next: () => {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'Project created',
                        life: 3000
                    });
                    this.loadProjects();
                    this.projectDialog = false;
                },
                error: (err) => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Failed to create project',
                        life: 3000
                    });
                    this.loading.set(false);
                }
            });
        }
    }

    hideDialog() {
        this.projectDialog = false;
    }

    viewProject(project: any) {
        this.router.navigate(['/projects', project.id]);
    }

    getSeverity(status: string): 'success' | 'info' | 'warn' | 'danger' {
        switch (status) {
            case 'COMPLETED':
                return 'success';
            case 'IN_PROGRESS':
                return 'info';
            case 'ON_HOLD':
                return 'warn';
            case 'PLANNED':
                return 'danger';
            default:
                return 'danger';
        }
    }

    calculateProgress(project: any): number {
        if (!project.tasks || project.tasks.length === 0) return 0;

        const completed = project.tasks.filter((t: any) => t.status === 'COMPLETED').length;
        return Math.round((completed / project.tasks.length) * 100);
    }

    refreshProjects() {
        this.loadProjects();
    }
}

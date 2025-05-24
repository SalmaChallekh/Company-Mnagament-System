import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
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
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ActivatedRoute } from '@angular/router';
import { ProjectService } from '../../services/project.service';
import { TaskService } from '../../services/task.service';

interface TeamMember {
    id: string;
    name: string;
    role: string;
}

interface Task {
    id: string;
    name: string;
    description: string;
    startDate: Date;
    endDate: Date;
    //dueDate: Date;
    priority: 'LOW' | 'MEDIUM' | 'HIGH';
    status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'BLOCKED';
    assignedTo: TeamMember;
    projectId: string;
    projectName: string;
}

@Component({
    selector: 'app-task-management',
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
        CalendarModule,
        DropdownModule,
        ConfirmDialogModule,
        IconFieldModule,
        InputIconModule
    ],
    templateUrl: './tasks.component.html',
    styleUrls: ['./tasks.component.scss'],
    providers: [MessageService, ConfirmationService]
})
export class TasksComponent implements OnInit {
    tasks = signal<Task[]>([]);
    teamMembers: TeamMember[] = [];
    projects: any[] = [];
    selectedTasks: Task[] = [];
    taskDialog = false;
    task: Task = this.emptyTask();
    loading = signal(false);
    projectId: string | null = null;

    cols = [
        { field: 'name', header: 'Title' },
        { field: 'description', header: 'Description' },
        { field: 'projectName', header: 'Project' },
        { field: 'dueDate', header: 'Due Date' },
        { field: 'priority', header: 'Priority' },
        { field: 'status', header: 'Status' },
        { field: 'assignedTo.name', header: 'Assigned To' }
    ];

    priorities = [
        { label: 'Low', value: 'LOW' },
        { label: 'Medium', value: 'MEDIUM' },
        { label: 'High', value: 'HIGH' }
    ];

    statuses = [
        { label: 'Not Started', value: 'NOT_STARTED' },
        { label: 'In Progress', value: 'IN_PROGRESS' },
        { label: 'Completed', value: 'COMPLETED' },
        { label: 'Blocked', value: 'BLOCKED' }
    ];

    constructor(
        private taskService: TaskService,
        private projectService: ProjectService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private route: ActivatedRoute
    ) { }

    ngOnInit(): void {
        this.projectId = this.route.snapshot.paramMap.get('projectId');
        this.loadData();
    }

    loadData() {
        this.loading.set(true);

        this.projectService.getAllProjects().subscribe({
            next: (projects) => {
                this.projects = projects;

                if (this.projectId) {
                    this.loadTasksByProject(this.projectId);
                } else {
                    this.loadAllTasks();
                }
            },
            error: () => {
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

    loadTasksByProject(projectId: string) {
        this.taskService.getTasksByProjectId(projectId).subscribe({
            next: (tasks) => {
                this.tasks.set(tasks.map(task => ({
                    ...task,
                    projectName: this.getProjectName(task.projectId),
                    assignedTo: this.teamMembers.find(m => m.id === task.assignedTo) || {} as TeamMember
                })));
                this.loading.set(false);
            },
            error: () => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to load tasks',
                    life: 3000
                });
                this.loading.set(false);
            }
        });
    }

    loadAllTasks() {
        this.taskService.getAllTasks().subscribe({
            next: (tasks) => {
                this.tasks.set(tasks.map(task => ({
                    ...task,
                    projectName: this.getProjectName(task.projectId),
                    assignedTo: this.teamMembers.find(m => m.id === task.assignedTo) || {} as TeamMember
                })));
                this.loading.set(false);
            },
            error: () => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to load tasks',
                    life: 3000
                });
                this.loading.set(false);
            }
        });
    }

    getProjectName(projectId: string): string {
        const project = this.projects.find(p => p.id === projectId);
        return project ? project.name : 'Unknown Project';
    }
    formatDate(date: Date): string {
        return date.toISOString().split('T')[0]; // returns 'yyyy-MM-dd'
    }

    emptyTask(): Task {
        return {
            id: '',
            name: '',
            description: '',
            startDate: new Date,
            endDate: new Date,
            priority: 'MEDIUM',
            status: 'NOT_STARTED',
            assignedTo: {} as TeamMember,
            projectId: this.projectId || '',
            projectName: this.projectId ? this.getProjectName(this.projectId) : ''
        };
    }

    openNew() {
        this.task = this.emptyTask();
        this.taskDialog = true;
    }

    editTask(task: Task) {
        this.task = { ...task };
        this.taskDialog = true;
    }

    saveTask() {
    this.loading.set(true);

    const taskToSave: any = {
        ...this.task,
        startDate: this.formatDate(this.task.startDate),
        endDate: this.formatDate(this.task.endDate),
        assignedTo: this.task.assignedTo?.id,
        projectId: this.task.projectId
    };

    if (!this.task.id) {
        delete taskToSave.id; // ✅ prevent sending id: ""
    }

    if (this.task.id) {
        this.taskService.updateTask(this.task.id, taskToSave).subscribe({
            next: () => {
                this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Task updated successfully', life: 3000 });
                this.loadData();
                this.taskDialog = false;
            },
            error: () => {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to update task', life: 3000 });
                this.loading.set(false);
            }
        });
    } else {
        this.taskService.createTask(taskToSave).subscribe({
            next: () => {
                this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Task created successfully', life: 3000 });
                this.loadData();
                this.taskDialog = false;
            },
            error: () => {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to create task', life: 3000 });
                this.loading.set(false);
            }
        });
    }
}



    confirmDelete(task: Task) {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete this task?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.deleteTask(task.id);
            }
        });
    }

    deleteTask(taskId: string) {
        this.loading.set(true);
        this.taskService.deleteTask(taskId).subscribe({
            next: () => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Task deleted successfully',
                    life: 3000
                });
                this.loadData();
            },
            error: () => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to delete task',
                    life: 3000
                });
                this.loading.set(false);
            }
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

    getPrioritySeverity(priority: string): 'success' | 'info' | 'warn' | 'danger' {
        switch (priority) {
            case 'HIGH': return 'danger';
            case 'MEDIUM': return 'warn';
            case 'LOW':
            default: return 'success';
        }
    }

    hideDialog() {
        this.taskDialog = false;
    }
}

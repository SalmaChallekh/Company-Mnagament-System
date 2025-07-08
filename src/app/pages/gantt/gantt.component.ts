import { Component, OnInit } from '@angular/core';
import { ProjectService } from '../../services/project.service';
import { TimelineModule } from 'primeng/timeline';
import { CardModule } from 'primeng/card';
import { CommonModule } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { ProgressBarModule } from 'primeng/progressbar';
import { TooltipModule } from 'primeng/tooltip';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { MessageService } from 'primeng/api';
import { InputNumberModule } from 'primeng/inputnumber';
import { TaskService } from '../../services/task.service';

interface GanttTask {
    id: string;
    name: string;
    startDate: Date;
    endDate: Date;
    progress: number;
    status: string;
    projectId: string;
    duration?: number;
    statusClass?: string;
}

@Component({
    selector: 'app-gantt',
    templateUrl: './gantt.component.html',
    styleUrls: ['./gantt.component.scss'],
    standalone: true,
    imports: [
        CommonModule,
        TimelineModule,
        CardModule,
        DropdownModule,
        FormsModule,
        ProgressBarModule,
        TooltipModule,
        ButtonModule,
        DialogModule,
        InputTextModule,
        CalendarModule,
        InputNumberModule
    ],
    providers: [MessageService]
})
export class GanttComponent implements OnInit {
    projects: any[] = [];
    selectedProject: any;
    tasks: GanttTask[] = [];
    filteredTasks: GanttTask[] = [];

    // Dialog controls
    displayTaskDialog = false;
    newTask: Partial<GanttTask> = {
        startDate: new Date(),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Default 1 week duration
        progress: 0,
        status: 'NOT_STARTED'
    };

    statusOptions = [
        { label: 'Not Started', value: 'NOT_STARTED' },
        { label: 'In Progress', value: 'IN_PROGRESS' },
        { label: 'Completed', value: 'COMPLETED' }
    ];

    constructor(
        private projectService: ProjectService,
        private taskService: TaskService,
        private messageService: MessageService
    ) { }

    ngOnInit() {
        this.loadProjects();
    }

    loadProjects() {
        this.projectService.getAllProjects().subscribe({
            next: (projects) => {
                this.projects = projects;
                if (projects.length > 0) {
                    this.selectedProject = projects[0];
                    this.loadTasks(projects[0].id);
                }
            },
            error: (err) => this.showError('Failed to load projects')
        });
    }

    loadTasks(projectId: string) {
        this.taskService.getTasksByProject(projectId).subscribe({
            next: (tasks) => {
                this.tasks = tasks.map(task => this.processTask(task));
                this.filteredTasks = [...this.tasks];
            },
            error: (err) => this.showError('Failed to load tasks')
        });
    }

    processTask(task: any): GanttTask {
        return {
            ...task,
            startDate: new Date(task.startDate),
            endDate: new Date(task.endDate),
            duration: this.calculateDuration(task.startDate, task.endDate),
            statusClass: this.getStatusClass(task.status)
        };
    }

    calculateDuration(start: string | Date, end: string | Date): number {
        const startDate = new Date(start);
        const endDate = new Date(end);
        return Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    }

    getStatusClass(status: string): string {
        switch (status) {
            case 'COMPLETED': return 'bg-green-500';
            case 'IN_PROGRESS': return 'bg-blue-500';
            case 'NOT_STARTED': return 'bg-gray-500';
            default: return 'bg-yellow-500';
        }
    }

    onProjectChange() {
        this.loadTasks(this.selectedProject.id);
    }

    showAddTaskDialog() {
        this.newTask = {
            projectId: this.selectedProject.id,
            startDate: new Date(),
            endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            progress: 0,
            status: 'NOT_STARTED'
        };
        this.displayTaskDialog = true;
    }

    addTask() {
        if (!this.newTask.name || !this.newTask.startDate || !this.newTask.endDate) {
            this.showError('Please fill all required fields');
            return;
        }

        this.projectService.addTaskToProject(this.selectedProject.id, this.newTask).subscribe({
            next: (task) => {
                this.tasks.push(this.processTask(task));
                this.filteredTasks = [...this.tasks];
                this.displayTaskDialog = false;
                this.showSuccess('Task added successfully');
            },
            error: (err) => this.showError('Failed to add task')
        });
    }

    updateTaskProgress(task: GanttTask, progress: number) {
        const updatedTask = { ...task, progress };
        this.projectService.updateProject(updatedTask).subscribe({
            next: () => {
                task.progress = progress;
                this.showSuccess('Progress updated');
            },
            error: (err) => this.showError('Failed to update progress')
        });
    }

    private showSuccess(message: string) {
        this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: message
        });
    }

    private showError(message: string) {
        this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: message
        });
    }
}

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
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { ConfirmationService, MessageService } from 'primeng/api';

interface TeamMember {
    id: string;
    name: string;
    role: string;
}

interface Task {
    id: string;
    title: string;
    description: string;
    dueDate: Date;
    priority: 'LOW' | 'MEDIUM' | 'HIGH';
    status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'BLOCKED';
    assignedTo: TeamMember;
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
export class TasksComponent {
    tasks = signal<Task[]>([]);
    teamMembers: TeamMember[] = [];
    selectedTasks: Task[] = [];
    taskDialog = false;
    task: Task = this.emptyTask();

    cols = [
        { field: 'title', header: 'Title' },
        { field: 'description', header: 'Description' },
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

    ngOnInit(): void {
        this.loadDemoData();
    }

    loadDemoData() {
        this.teamMembers = [
            { id: '1', name: 'John Doe', role: 'Developer' },
            { id: '2', name: 'Jane Smith', role: 'Designer' },
            { id: '3', name: 'Mike Johnson', role: 'QA Engineer' }
        ];

        const demoTasks: Task[] = [
            {
                id: '1',
                title: 'Implement authentication',
                description: 'Create login and registration functionality with JWT support',
                dueDate: new Date(2023, 11, 15),
                priority: 'HIGH',
                status: 'IN_PROGRESS',
                assignedTo: this.teamMembers[0]
            },
            {
                id: '2',
                title: 'Design dashboard UI',
                description: 'Create mockups for the admin dashboard with responsive design',
                dueDate: new Date(2023, 11, 10),
                priority: 'MEDIUM',
                status: 'COMPLETED',
                assignedTo: this.teamMembers[1]
            },
            {
                id: '3',
                title: 'Write API documentation',
                description: 'Document all endpoints for the REST API with examples',
                dueDate: new Date(2023, 11, 20),
                priority: 'LOW',
                status: 'NOT_STARTED',
                assignedTo: this.teamMembers[2]
            }
        ];

        this.tasks.set(demoTasks);
    }

    emptyTask(): Task {
        return {
            id: '',
            title: '',
            description: '',
            dueDate: new Date(),
            priority: 'MEDIUM',
            status: 'NOT_STARTED',
            assignedTo: {} as TeamMember
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
        const tasks = this.tasks();

        if (this.task.id) {
            // Update existing task
            const index = tasks.findIndex(t => t.id === this.task.id);
            if (index !== -1) {
                tasks[index] = { ...this.task };
            }
        } else {
            // Add new task
            this.task.id = this.generateId();
            tasks.push({ ...this.task });
        }

        this.tasks.set([...tasks]);
        this.taskDialog = false;
    }

    deleteTask(task: Task) {
        this.tasks.set(this.tasks().filter(t => t.id !== task.id));
    }

    exportCSV() {
        // Implement CSV export functionality
        console.log('Exporting tasks to CSV');
    }

    onGlobalFilter(table: any, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }
    getStatusSeverity(status: string): 'success' | 'info' | 'warn' | 'danger' {
        switch (status) {
            case 'COMPLETED':
                return 'success';
            case 'IN_PROGRESS':
                return 'info';
            case 'BLOCKED':
                return 'danger';
            case 'NOT_STARTED':
            default:
                return 'warn';
        }
    }
    getPrioritySeverity(priority: string): 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' {
        switch (priority) {
            case 'HIGH':
                return 'danger';
            case 'MEDIUM':
                return 'warn';
            case 'LOW':
            default:
                return 'success';
        }
    }

    hideDialog() {
        this.taskDialog = false;
    }

    private generateId(): string {
        return Math.random().toString(36).substring(2, 9);
    }
}

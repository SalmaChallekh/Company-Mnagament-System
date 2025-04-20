import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextarea } from 'primeng/inputtextarea';
import { CheckboxModule } from 'primeng/checkbox';
import { DialogModule } from 'primeng/dialog';
import { TagModule } from 'primeng/tag';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';

interface Task {
    id: string;
    title: string;
    description: string;
    dueDate: Date;
    priority: 'LOW' | 'MEDIUM' | 'HIGH';
    status: 'TODO' | 'IN_PROGRESS' | 'COMPLETED' | 'OVERDUE';
    assignedTo: string;
    completed: boolean;
}

@Component({
    selector: 'app-tasks',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        TableModule,
        ButtonModule,
        CardModule,
        DropdownModule,
        CalendarModule,
        InputTextModule,
        InputTextModule,
        CheckboxModule,
        DialogModule,
        TagModule,
        ConfirmDialogModule,
        ToastModule,
        ToolbarModule,
    ],
    templateUrl: './tasks.component.html',
    styleUrls: ['./tasks.component.scss'],
    providers: [ConfirmationService, MessageService]
})
export class TasksComponent {
    tasks = signal<Task[]>([]);
    selectedTasks: Task[] = [];
    taskDialog = false;
    task: Task = this.emptyTask();
    submitted = false;

    priorities = [
        { label: 'Low', value: 'LOW' },
        { label: 'Medium', value: 'MEDIUM' },
        { label: 'High', value: 'HIGH' }
    ];

    statuses = [
        { label: 'To Do', value: 'TODO' },
        { label: 'In Progress', value: 'IN_PROGRESS' },
        { label: 'Completed', value: 'COMPLETED' },
        { label: 'Overdue', value: 'OVERDUE' }
    ];

    teamMembers = [
        'John Doe',
        'Jane Smith',
        'Robert Johnson',
        'Emily Davis',
        'Michael Wilson'
    ];

    constructor(
        private confirmationService: ConfirmationService,
        private messageService: MessageService
    ) { }

    ngOnInit() {
        this.loadSampleData();
    }

    loadSampleData() {
        const sampleData: Task[] = [
            {
                id: '1',
                title: 'Complete payroll processing',
                description: 'Process payroll for June 2023',
                dueDate: new Date(2023, 6, 5),
                priority: 'HIGH',
                status: 'IN_PROGRESS',
                assignedTo: 'John Doe',
                completed: false
            },
            {
                id: '2',
                title: 'Prepare quarterly reports',
                description: 'Generate financial reports for Q2',
                dueDate: new Date(2023, 6, 15),
                priority: 'MEDIUM',
                status: 'TODO',
                assignedTo: 'Jane Smith',
                completed: false
            },
            {
                id: '3',
                title: 'Update employee handbook',
                description: 'Review and update company policies',
                dueDate: new Date(2023, 5, 30),
                priority: 'LOW',
                status: 'OVERDUE',
                assignedTo: 'Robert Johnson',
                completed: false
            }
        ];
        this.tasks.set(sampleData);
    }

    emptyTask(): Task {
        return {
            id: '',
            title: '',
            description: '',
            dueDate: new Date(),
            priority: 'MEDIUM',
            status: 'TODO',
            assignedTo: '',
            completed: false
        };
    }

    openNew() {
        this.task = this.emptyTask();
        this.submitted = false;
        this.taskDialog = true;
    }

    editTask(task: Task) {
        this.task = { ...task };
        this.taskDialog = true;
    }

    deleteTask(task: Task) {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete this task?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.tasks.set(this.tasks().filter(t => t.id !== task.id));
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Task Deleted',
                    life: 3000
                });
            }
        });
    }

    saveTask() {
        this.submitted = true;

        if (this.task.title?.trim()) {
            if (this.task.id) {
                // Update existing
                const index = this.tasks().findIndex(t => t.id === this.task.id);
                const updatedTasks = [...this.tasks()];
                updatedTasks[index] = this.task;
                this.tasks.set(updatedTasks);

                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Task Updated',
                    life: 3000
                });
            } else {
                // Create new
                this.task.id = this.createId();
                this.tasks.set([...this.tasks(), this.task]);
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Task Created',
                    life: 3000
                });
            }

            this.taskDialog = false;
            this.task = this.emptyTask();
        }
    }

    createId(): string {
        return Math.random().toString(36).substring(2, 9);
    }

    getSeverity(status: string) {
        switch (status) {
            case 'COMPLETED':
                return 'success';
            case 'IN_PROGRESS':
                return 'info';
            case 'TODO':
                return 'warn';
            case 'OVERDUE':
                return 'danger';
            default:
                return undefined;
        }
    }

    toggleTaskCompletion(task: Task) {
        task.completed = !task.completed;
        task.status = task.completed ? 'COMPLETED' : 'TODO';
        this.tasks.set([...this.tasks()]);
    }
}

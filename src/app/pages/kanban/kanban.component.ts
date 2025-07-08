import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { TaskService, Task } from '../../services/task.service';
import { CommonModule } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';

@Component({
    selector: 'app-kanban',
    templateUrl: './kanban.component.html',
    styleUrls: ['./kanban.component.scss'],
    standalone: true,
    imports: [
        CommonModule,
        DragDropModule
    ]
})
export class KanbanComponent implements OnInit {
    // Task arrays
    todo: Task[] = [];
    inProgress: Task[] = [];
    done: Task[] = [];
    allTasks: Task[] = [];

    // Column configuration
    columns = [
        { id: 'NOT_STARTED', title: 'To Do' },
        { id: 'IN_PROGRESS', title: 'In Progress' },
        { id: 'COMPLETED', title: 'Done' }
    ];

    // Add this property for connected drop lists
    connectedDropLists: string[] = [];

    constructor(private taskService: TaskService) { }

    ngOnInit() {
        // Initialize connected drop lists
        this.connectedDropLists = this.columns.map(c => c.id);
        this.loadTasks();
    }

    loadTasks() {
        console.log('Loading tasks...');
        this.taskService.getAllTasks().subscribe({
            next: (tasks) => {
                console.log('Tasks received:', tasks);
                this.allTasks = tasks;

                this.todo = tasks.filter(t => t.status === 'NOT_STARTED');
                this.inProgress = tasks.filter(t => t.status === 'IN_PROGRESS');
                this.done = tasks.filter(t => t.status === 'COMPLETED');

                console.log('To Do tasks:', this.todo);
                console.log('In Progress tasks:', this.inProgress);
                console.log('Done tasks:', this.done);
            },
            error: (err) => {
                console.error('Failed to fetch tasks', err);
            }
        });
    }

    drop(event: CdkDragDrop<Task[]>, newStatusId: string) {
        if (event.previousContainer === event.container) {
            moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
        } else {
            const task = event.previousContainer.data[event.previousIndex];
            const previousStatus = task.status;

            task.status = newStatusId as 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';

            transferArrayItem(
                event.previousContainer.data,
                event.container.data,
                event.previousIndex,
                event.currentIndex
            );

            this.taskService.updateTask(task.id, task).subscribe({
                error: () => {
                    console.error('Failed to update task status');
                    task.status = previousStatus;
                    transferArrayItem(
                        event.container.data,
                        event.previousContainer.data,
                        event.currentIndex,
                        event.previousIndex
                    );
                }
            });
        }
    }

    getList(statusId: string): Task[] {
        switch (statusId) {
            case 'NOT_STARTED': return this.todo;
            case 'IN_PROGRESS': return this.inProgress;
            case 'COMPLETED': return this.done;
            default: return [];
        }
    }

    getColumnTitle(statusId: string): string {
        const column = this.columns.find(c => c.id === statusId);
        return column ? column.title : '';
    }
}

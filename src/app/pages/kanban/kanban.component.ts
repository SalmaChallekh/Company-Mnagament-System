import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Task } from '../../services/task.service';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-kanban',
    templateUrl: './kanban.component.html',
    styleUrls: ['./kanban.component.scss'],
    imports: [
        DragDropModule,
        CommonModule
    ]
})
export class KanbanComponent implements OnInit {

    todo: Task[] = [];
    inProgress: Task[] = [];
    done: Task[] = [];

    ngOnInit() {
        const allTasks: Task[] = [
            { id: '1', name: 'Deploy app', status: 'To Do', projectId: 'p1' },
            { id: '2', name: 'Design UI', status: 'In Progress', projectId: 'p1' },
            { id: '3', name: 'Setup backend', status: 'Done', projectId: 'p1' }
        ];

        this.todo = allTasks.filter(t => t.status === 'To Do');
        this.inProgress = allTasks.filter(t => t.status === 'In Progress');
        this.done = allTasks.filter(t => t.status === 'Done');
    }

    drop(event: CdkDragDrop<Task[]>, status: string) {
        if (event.previousContainer === event.container) {
            moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
        } else {
            const task = event.previousContainer.data[event.previousIndex];
            task.status = status as "To Do" | "In Progress" | "Done";
            transferArrayItem(
                event.previousContainer.data,
                event.container.data,
                event.previousIndex,
                event.currentIndex
            );
        }
    }
    getList(status: string): Task[] {
        switch (status) {
            case 'To Do': return this.todo;
            case 'In Progress': return this.inProgress;
            case 'Done': return this.done;
            default: return [];
        }
    }

}

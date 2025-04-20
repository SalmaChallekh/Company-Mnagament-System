// project-detail.component.ts
import { Component, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabViewModule } from 'primeng/tabview';
import { TimelineModule } from 'primeng/timeline';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
//import { TaskListComponent } from './task-list.component';
//import { TeamAssignmentComponent } from './team-assignment.component';
import { Project, Task, Team } from '../project-management/project-management.component';

@Component({
    selector: 'app-project-detail',
    standalone: true,
    imports: [
        CommonModule,
        TabViewModule,
        TimelineModule,
        CardModule,
        TagModule,
        ButtonModule,
        //TaskListComponent,
        //TeamAssignmentComponent
    ],
    template: `
    <div class="grid">
      <div class="col-12 md:col-8">
        <div class="card">
          <div class="flex justify-content-between align-items-center mb-4">
            <h2>{{project().name}}</h2>
            <p-tag [value]="project().status"
                  [severity]="getSeverity(project().status)"></p-tag>
          </div>

          <p>{{project().description}}</p>

          <p-tabView class="mt-4">
            <p-tabPanel header="Tasks">
              <app-task-list [tasks]="project().tasks"
                            (taskUpdated)="onTaskUpdated($event)">
              </app-task-list>
            </p-tabPanel>
            <p-tabPanel header="Team">
              <app-team-assignment
                [projectId]="project().id"
                [teams]="project().teams"
                (teamUpdated)="onTeamUpdated($event)">
              </app-team-assignment>
            </p-tabPanel>
            <p-tabPanel header="Timeline">
              <p-timeline [value]="milestones" align="alternate">
                <ng-template pTemplate="content" let-milestone>
                  <h5>{{milestone.name}}</h5>
                  <p>{{milestone.date | date}}</p>
                </ng-template>
              </p-timeline>
            </p-tabPanel>
          </p-tabView>
        </div>
      </div>

      <div class="col-12 md:col-4">
        <div class="card">
          <h4>Project Details</h4>
          <div class="grid mt-3">
            <div class="col-6 font-bold">Start Date:</div>
            <div class="col-6">{{project().startDate | date}}</div>

            <div class="col-6 font-bold">End Date:</div>
            <div class="col-6">{{project().endDate | date}}</div>

            <div class="col-6 font-bold">Teams:</div>
            <div class="col-6">{{project().teams.length}}</div>

            <div class="col-6 font-bold">Tasks:</div>
            <div class="col-6">{{project().tasks.length}}</div>
          </div>

          <h4 class="mt-4">Quick Actions</h4>
          <div class="flex flex-column gap-2 mt-3">
            <button pButton label="Add Task" icon="pi pi-plus"
                   (click)="openNewTask()"></button>
            <button pButton label="Edit Project" icon="pi pi-pencil"
                   (click)="editProject()"></button>
          </div>
        </div>
      </div>
    </div>
  `,
    styles: [`
    .card {
      padding: 1.5rem;
      border-radius: 6px;
      background: var(--surface-card);
      box-shadow: var(--card-shadow);
      margin-bottom: 1rem;
    }
  `]
})
export class ProjectDetailComponent {
    project = signal<Project>(this.emptyProject());
    milestones = signal<any[]>([]);

    @Input() set projectId(id: string) {
        // Load project details when ID changes
        this.loadProjectDetails(id);
    }

    emptyProject(): Project {
        return {
            id: '',
            name: '',
            description: '',
            startDate: new Date(),
            endDate: new Date(),
            status: 'PLANNING',
            teams: [],
            tasks: []
        };
    }

    loadProjectDetails(id: string) {
        const demoProject: Project = {  // Explicitly type the object
            id: '1',
            name: 'Website Redesign',
            description: 'Complete redesign of company website',
            startDate: new Date(2023, 10, 1),
            endDate: new Date(2023, 11, 31),
            status: 'IN_PROGRESS',  // Now this matches the Project interface
            teams: [
                { id: '1', name: 'Development Team', members: [] }
            ],
            tasks: [
                {
                    id: '1',
                    title: 'Design UI Mockups',
                    description: 'Create mockups for the new dashboard',
                    status: 'IN_PROGRESS',
                    priority: 'HIGH',
                    dueDate: new Date(2023, 11, 15),
                    assignedTo: [],
                    projectId: '1'
                }
            ]
        };
        this.project.set(demoProject);
        this.generateMilestones();
    }

    generateMilestones() {
        this.milestones.set([
            { name: 'Project Kickoff', date: this.project().startDate },
            { name: 'Design Phase Complete', date: new Date(2023, 10, 15) },
            { name: 'Development Complete', date: new Date(2023, 11, 15) },
            { name: 'Project Delivery', date: this.project().endDate }
        ]);
    }

    onTaskUpdated(updatedTask: Task) {
        // Handle task updates
    }

    onTeamUpdated(updatedTeams: Team[]) {
        // Handle team updates
    }

    openNewTask() {
        // Open task dialog
    }

    editProject() {
        // Open project edit dialog
    }

    getSeverity(status: string) {
        switch (status) {
            case 'COMPLETED': return 'success';
            case 'IN_PROGRESS': return 'info';
            case 'ON_HOLD': return 'warning';
            case 'PLANNING': return 'secondary';
            default: return 'danger';
        }
    }
}

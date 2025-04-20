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

export interface Employee {
    id: string;
    name: string;
    email: string;
    role: string;
    department: string;
    status: 'ACTIVE' | 'INACTIVE';
}

export interface Team {
    id: string;
    name: string;
    members: Employee[];
}

export interface Task {
    projectId: string;
    id: string;
    title: string;
    description: string;
    status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'BLOCKED';
    priority: 'LOW' | 'MEDIUM' | 'HIGH';
    dueDate: Date;
    assignedTo: Employee[];
}

export interface Project {
    id: string;
    name: string;
    description: string;
    startDate: Date;
    endDate: Date;
    status: 'PLANNING' | 'IN_PROGRESS' | 'ON_HOLD' | 'COMPLETED';
    teams: Team[];
    tasks: Task[];
}
@Component({
    selector: 'app-project-management',
    imports: [CommonModule,
        FormsModule,
        // PrimeNG Modules
        TableModule,
        TagModule,
        ButtonModule,
        ToolbarModule,
        DialogModule,
        InputTextModule,
        InputTextModule,
        CalendarModule,
        DropdownModule,
        MultiSelectModule,
        ToastModule,
        CardModule,
        ConfirmDialogModule],
    templateUrl: './project-management.component.html',
    styleUrl: './project-management.component.scss'
})
export class ProjectManagementComponent {
    projects = signal<Project[]>([]);
    employees = signal<Employee[]>([]);
    teams = signal<Team[]>([]);

    selectedProjects: Project[] = [];
    selectedTasks: Task[] = [];

    projectDialog: boolean = false;
    taskDialog: boolean = false;
    teamDialog: boolean = false;

    project: Project = this.emptyProject();
    task: Task = this.emptyTask();
    team: Team = this.emptyTeam();

    statusOptions = [
        { label: 'Planning', value: 'PLANNING' },
        { label: 'In Progress', value: 'IN_PROGRESS' },
        { label: 'On Hold', value: 'ON_HOLD' },
        { label: 'Completed', value: 'COMPLETED' }
    ];

    taskStatusOptions = [
        { label: 'Not Started', value: 'NOT_STARTED' },
        { label: 'In Progress', value: 'IN_PROGRESS' },
        { label: 'Completed', value: 'COMPLETED' },
        { label: 'Blocked', value: 'BLOCKED' }
    ];

    priorityOptions = [
        { label: 'Low', value: 'LOW' },
        { label: 'Medium', value: 'MEDIUM' },
        { label: 'High', value: 'HIGH' }
    ];

    ngOnInit(): void {
        this.loadDemoData();
    }

    loadDemoData() {
        // Sample employees
        const demoEmployees: Employee[] = [
            { id: '1', name: 'John Doe', email: 'john@example.com', role: 'Developer', department: 'IT', status: 'ACTIVE' },
            { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'Designer', department: 'Creative', status: 'ACTIVE' },
            { id: '3', name: 'Mike Johnson', email: 'mike@example.com', role: 'Manager', department: 'Operations', status: 'ACTIVE' }
        ];
        this.employees.set(demoEmployees);

        // Sample teams
        const demoTasks: Task[] = [
            {
                id: '1',
                title: 'Design UI Mockups',
                description: 'Create mockups for the new dashboard',
                status: 'IN_PROGRESS',
                priority: 'HIGH',
                dueDate: new Date(2023, 11, 15),
                assignedTo: [demoEmployees[1]],
                projectId: ''
            }
        ];

        const demoTeams: Team[] = [
            { id: '1', name: 'Development Team', members: [demoEmployees[0], demoEmployees[2]] }
        ];
        this.teams.set(demoTeams);

        // Sample projects
        const demoProjects: Project[] = [
            {
                id: '1',
                name: 'Website Redesign',
                description: 'Complete redesign of company website',
                startDate: new Date(2023, 10, 1),
                endDate: new Date(2023, 11, 31),
                status: 'IN_PROGRESS',
                teams: demoTeams,
                tasks: demoTasks
            }
        ];
        this.projects.set(demoProjects);
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

    emptyTask(): Task {
        return {
            id: '',
            title: '',
            description: '',
            status: 'NOT_STARTED',
            priority: 'MEDIUM',
            dueDate: new Date(),
            assignedTo: [],
            projectId: '',
        };
    }

    emptyTeam(): Team {
        return {
            id: '',
            name: '',
            members: []
        };
    }

    openNewProject() {
        this.project = this.emptyProject();
        this.projectDialog = true;
    }

    openNewTask(project: Project) {
        this.task = this.emptyTask();
        this.task.projectId = project.id;
        this.taskDialog = true;
    }

    openNewTeam() {
        this.team = this.emptyTeam();
        this.teamDialog = true;
    }

    saveProject() {
        // Implementation for saving project
    }

    saveTask() {
        // Implementation for saving task
    }

    saveTeam() {
        // Implementation for saving team
    }

    deleteProject(project: Project) {
        // Implementation for deleting project
    }

    deleteTask(task: Task) {
        // Implementation for deleting task
    }

    deleteTeam(team: Team) {
        // Implementation for deleting team
    }

    hideDialog() {
        this.projectDialog = false;
        this.taskDialog = false;
        this.teamDialog = false;
    }
    editProject(project: Project) {
        this.project = { ...project };
        this.projectDialog = true;
    }
    getSeverity(status: string) {
        switch (status) {
            case 'COMPLETED':
                return 'success';
            case 'IN_PROGRESS':
                return 'info';
            case 'ON_HOLD':
                return 'warn';
            case 'PLANNING':
                return 'secondary';
            default:
                return 'danger';
        }
    }
}

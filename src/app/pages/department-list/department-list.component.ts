import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// PrimeNG Modules
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { TagModule } from 'primeng/tag';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

// Interface
interface Department {
    id: string;
    name: string;
    managerId: string;
}

interface Employee {
    id: string;
    name: string;
    departmentId: string;
}

@Component({
    selector: 'app-department-list',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ToolbarModule,
        ButtonModule,
        TableModule,
        DialogModule,
        TagModule,
        ConfirmDialogModule
    ],
    template: `
    <div class="card">
      <p-toolbar>
        <ng-template pTemplate="left">
          <h4>Departments</h4>
        </ng-template>
        <ng-template pTemplate="right">
          <p-button label="New Department" icon="pi pi-plus"
                  (click)="openNew()"></p-button>
        </ng-template>
      </p-toolbar>

      <p-confirmDialog></p-confirmDialog>

      <p-table [value]="departments" [paginator]="true" [rows]="10">
        <ng-template pTemplate="header">
          <tr>
            <th>Name</th>
            <th>Manager</th>
            <th>Employee Count</th>
            <th>Actions</th>
          </tr>
        </ng-template>
        <ng-template pTemplate="body" let-dept>
          <tr>
            <td>{{dept.name}}</td>
            <td>{{getManagerName(dept.managerId)}}</td>
            <td>{{getEmployeeCount(dept.id)}}</td>
            <td>
              <button pButton icon="pi pi-pencil"
                    (click)="editDepartment(dept)"></button>
              <button pButton icon="pi pi-trash" severity="danger"
                    (click)="deleteDepartment(dept)"></button>
            </td>
          </tr>
        </ng-template>
      </p-table>
    </div>

    <p-dialog [(visible)]="dialogVisible" header="Department Details">
      <!-- Dialog content here -->
    </p-dialog>
  `,
    styles: [`
    .card {
      padding: 2rem;
      box-shadow: var(--card-shadow);
      border-radius: 6px;
      margin-bottom: 2rem;
      background: var(--surface-card);
    }
  `],
    providers: [ConfirmationService] // Add ConfirmationService to providers
})
export class DepartmentListComponent {
    departments: Department[] = [
        { id: '1', name: 'Engineering', managerId: '101' },
        { id: '2', name: 'Marketing', managerId: '102' }
    ];

    employees: Employee[] = [
        { id: '101', name: 'John Doe', departmentId: '1' },
        { id: '102', name: 'Jane Smith', departmentId: '2' },
        { id: '103', name: 'Mike Johnson', departmentId: '1' }
    ];

    dialogVisible = false;

    constructor(private confirmationService: ConfirmationService) { }

    openNew() {
        this.dialogVisible = true;
    }

    getManagerName(managerId: string): string {
        const manager = this.employees.find(emp => emp.id === managerId);
        return manager ? manager.name : 'Not assigned';
    }

    getEmployeeCount(departmentId: string): number {
        return this.employees.filter(emp => emp.departmentId === departmentId).length;
    }

    editDepartment(dept: Department) {
        console.log('Editing department:', dept);
        this.dialogVisible = true;
    }

    deleteDepartment(dept: Department) {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete this department?',
            header: 'Confirm Deletion',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.departments = this.departments.filter(d => d.id !== dept.id);
            }
        });
    }
}

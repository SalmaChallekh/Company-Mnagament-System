// user-management.component.ts
import { Component, OnInit, signal, ViewChild } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table, TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { TagModule } from 'primeng/tag';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DropdownModule } from 'primeng/dropdown';
import { finalize } from 'rxjs';
import { CreateUserRequest, User, UserService } from '../../services/user.service';

interface Column {
    field: string;
    header: string;
    customExportHeader?: string;
}

interface ExportColumn {
    title: string;
    dataKey: string;
}

interface Department {
    id: number;
    name: string;
}

interface RoleOption {
    label: string;
    value: string;
}

@Component({
    selector: 'app-user-management',
    standalone: true,
    imports: [
        CommonModule,
        TableModule,
        FormsModule,
        ButtonModule,
        RippleModule,
        ToastModule,
        ToolbarModule,
        InputTextModule,
        DialogModule,
        TagModule,
        InputIconModule,
        IconFieldModule,
        ConfirmDialogModule,
        DropdownModule,
    ],
    template: `
    <p-toolbar styleClass="mb-6">
  <ng-template #start>
    <p-button label="New User" icon="pi pi-plus" severity="secondary" class="mr-2" (onClick)="openNew()" />
  </ng-template>
  <ng-template #end>
    <p-button label="Export" icon="pi pi-upload" severity="secondary" (onClick)="exportCSV()" />
  </ng-template>
</p-toolbar>

<p-table
  #dt
  [value]="users()"
  [rows]="10"
  [columns]="cols"
  [paginator]="true"
  [globalFilterFields]="['email', 'role', 'departmentName']"
  [tableStyle]="{ 'min-width': '75rem' }"
  [(selection)]="selectedUsers"
  [rowHover]="true"
  dataKey="id"
  currentPageReportTemplate="Showing {first} to {last} of {totalRecords} users"
  [showCurrentPageReport]="true"
  [rowsPerPageOptions]="[10, 20, 30]"
  [loading]="loading()"
>
  <ng-template #caption>
    <div class="flex items-center justify-between">
      <h5 class="m-0">Manage Users</h5>
      <p-iconfield>
        <p-inputicon styleClass="pi pi-search" />
        <input pInputText type="text" (input)="onGlobalFilter(dt, $event)" placeholder="Search..." />
      </p-iconfield>
    </div>
  </ng-template>

  <ng-template #header>
    <tr>
      <th style="width: 3rem">
        <p-tableHeaderCheckbox />
      </th>
      <th pSortableColumn="email" style="min-width:16rem">
        Email <p-sortIcon field="email" />
      </th>
      <th pSortableColumn="departmentName" style="min-width:10rem">
        Department <p-sortIcon field="departmentName" />
      </th>
      <th pSortableColumn="role" style="min-width:10rem">
        Role <p-sortIcon field="role" />
      </th>
      <th pSortableColumn="enabled" style="min-width:10rem">
        Status <p-sortIcon field="enabled" />
      </th>
      <th style="min-width: 12rem"></th>
    </tr>
  </ng-template>

  <ng-template #body let-user>
    <tr>
      <td>
        <p-tableCheckbox [value]="user" />
      </td>
      <td>{{ user.email }}</td>
      <td>{{ getDepartmentName(user.departmentId) }}</td>
      <td>{{ user.role }}</td>
      <td>
        <p-tag [value]="getEnabledLabel(user.enabled)" [severity]="getSeverity(user.enabled)" />
      </td>
      <td>
        <p-button icon="pi pi-pencil" class="mr-2" [rounded]="true" [outlined]="true" (click)="editUser(user)" />
        <p-button icon="pi pi-trash" severity="danger" [rounded]="true" [outlined]="true" (click)="deleteUser(user)" />
      </td>
    </tr>
  </ng-template>

  <ng-template #emptymessage>
    <tr>
      <td colspan="6">No users found</td>
    </tr>
  </ng-template>
</p-table>

<p-dialog [(visible)]="userDialog" [style]="{ width: '550px' }" header="User Details" [modal]="true">
  <ng-template #content>
    <!-- Centering wrapper -->
    <div class="flex justify-center items-center min-h-[300px]">
      <!-- Form content -->
      <div class="flex flex-col gap-6 w-full max-w-md">
        <div>
          <label for="email" class="block font-bold mb-3">Email</label>
          <input type="email" pInputText id="email" [(ngModel)]="user.email" required class="w-full" />
        </div>

        <div>
          <label for="department" class="block font-bold mb-3">Department</label>
          <p-dropdown
            [options]="departmentOptions"
            [(ngModel)]="user.departmentId"
            optionLabel="name"
            optionValue="id"
            placeholder="Select Department"
            inputId="department"
            appendTo="body"
            [autoZIndex]="true"
            [baseZIndex]="1000"
            class="w-full"
          ></p-dropdown>
        </div>

        <div *ngIf="roles?.length">
          <label for="role" class="block font-bold mb-3">Role</label>
          <p-dropdown
            [options]="roles"
            [(ngModel)]="user.role"
            placeholder="Select Role"
            inputId="role"
            optionLabel="label"
            optionValue="value"
            appendTo="body"
            [autoZIndex]="true"
            [baseZIndex]="1000"
            class="w-full"
          ></p-dropdown>
        </div>
      </div>
    </div>
  </ng-template>

  <ng-template #footer>
    <p-button label="Cancel" icon="pi pi-times" text (click)="hideDialog()" />
    <p-button label="Save" icon="pi pi-check" (click)="saveUser()" />
  </ng-template>
</p-dialog>


<p-confirmDialog [style]="{ width: '450px' }"></p-confirmDialog>

    `,
    providers: [MessageService, ConfirmationService],
})
export class UserManagementComponent implements OnInit {
    userDialog = false;
    users = signal<User[]>([]);
    loading = signal(true);
    user: User = {
        id: 0,
        email: '',
        departmentId: 0,
        role: '',
        enabled: 0,
    };
    selectedUsers: User[] | null = null;
    submitted = false;
    departments: any[] = [];
    cols: Column[] = [
        { field: 'email', header: 'Email' },
        { field: 'departmentName', header: 'Department' },
        { field: 'role', header: 'Role' },
        { field: 'enabled', header: 'Status' },
    ];

    @ViewChild('dt') dt!: Table;

    constructor(
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private userService: UserService
    ) { }
    roles: RoleOption[] = [];
    departmentOptions: Department[] = [];
    ngOnInit() {
        this.loadUsers();
        this.fetchRoles();
        this.loadDepartments();
    }

    loadDepartments() {
        this.userService.getAllDepartments().subscribe({
            next: (res) => {
                this.departmentOptions = res;
                this.departments = res; // keep this if you use getDepartmentName()
            },
            error: () => this.showError('Failed to fetch departments')
        });
    }

    loadUsers() {
        this.loading.set(true);
        this.userService
            .getUsers()
            .pipe(finalize(() => this.loading.set(false)))
            .subscribe({
                next: (users) => this.users.set(users),
                error: () => this.showError('Failed to load users'),
            });
    }


    fetchRoles() {
        this.userService.getRoles().subscribe({
            next: (res) => {
                console.log('✅ Roles loaded from backend:', res);
                this.roles = res;
            },
            error: (err) => {
                console.error('❌ Failed to load roles', err);
            }
        });
    }


    fetchDepartments() {
        this.userService.getAllDepartments().subscribe({
            next: (res) => (this.departments = res),
            error: () => this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to fetch departments',
                life: 3000
            })
        });
    }
    getDepartmentName(id: number) {
        const dept = this.departments.find(d => d.id === id);
        return dept ? dept.name : 'Unknown';
    }

    exportCSV() {
        this.dt.exportCSV();
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    openNew() {
        this.user = {
            id: 0,
            email: '',
            departmentId: 0,
            role: '',
            enabled: 0,
        };
        this.submitted = false;
        this.userDialog = true;
        this.fetchDepartments();
    }

    editUser(user: User) {
        this.user = { ...user };
        this.userDialog = true;
    }

    hideDialog() {
        this.userDialog = false;
        this.submitted = false;
    }
    deleteUser(user: User) {
    this.confirmationService.confirm({
        message: `Are you sure you want to delete ${user.email}?`,
        header: 'Confirm',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
            if (user.id) {
                this.userService.deleteUser(user.id).subscribe({
                    next: () => {
                        this.showSuccess('User deleted successfully');
                        this.loadUsers();
                    },
                    error: () => this.showError('Failed to delete user'),
                });
            }
        },
    });
}


    // deleteUser(user: User) {
    //     this.confirmationService.confirm({
    //         message: `Are you sure you want to delete ${user.email}?`,
    //         header: 'Confirm',
    //         icon: 'pi pi-exclamation-triangle',
    //         accept: () => {
    //             this.users.set(this.users().filter((u) => u.id !== user.id));
    //             this.showSuccess('User deleted successfully');
    //             // Optionally, call backend delete API here
    //         },
    //     });
    // }

    getSeverity(enabled: boolean | number): 'success' | 'danger' | 'info' | undefined {
        if (enabled === true || enabled === 1) return 'success';
        if (enabled === false || enabled === 0) return 'danger';
        return 'info';
    }

    getEnabledLabel(enabled: boolean | number): string {
        if (enabled === true || enabled === 1) return 'Active';
        if (enabled === false || enabled === 0) return 'Inactive';
        return 'Unknown';
    }
    saveUser() {
    this.submitted = true;

    if (!this.user.email.trim()) {
        this.showError('Email is required.');
        return;
    }
    if (!this.user.role) {
        this.showError('Role is required.');
        return;
    }
    if (!this.user.departmentId || this.user.departmentId === 0) {
        this.showError('Department is required.');
        return;
    }

    const request: CreateUserRequest = {
        email: this.user.email.trim(),
        role: this.user.role,
        departmentId: this.user.departmentId,
    };

    if (this.user.id && this.user.id !== 0) {
        // Update user
        this.userService.updateUser(this.user.id, request).subscribe({
            next: () => {
                this.showSuccess('User updated successfully');
                this.userDialog = false;
                this.loadUsers();
            },
            error: () => this.showError('Failed to update user'),
        });
    } else {
        // Create new user
        this.userService.createUser(request).subscribe({
            next: () => {
                this.showSuccess('User created successfully');
                this.userDialog = false;
                this.loadUsers();
            },
            error: () => this.showError('Failed to create user'),
        });
    }
}


    // saveUser() {
    //     this.submitted = true;
    //     if (!this.user.email.trim()) {
    //         this.showError('Email is required.');
    //         return;
    //     }
    //     if (!this.user.role) {
    //         this.showError('Role is required.');
    //         return;
    //     }
    //     if (!this.user.departmentId || this.user.departmentId === 0) {
    //         this.showError('Department is required.');
    //         return;
    //     }
    //     const request: CreateUserRequest = {
    //         email: this.user.email.trim(),
    //         role: this.user.role,
    //         departmentId: this.user.departmentId,
    //     };
    //     this.userService.createUser(request).subscribe({
    //         next: (response) => {
    //             this.showSuccess('User saved successfully');
    //             this.userDialog = false;
    //             this.loadUsers();
    //         },
    //         error: () => this.showError('Failed to save user'),
    //     });
    // }

    private showSuccess(detail: string) {
        this.messageService.add({ severity: 'success', summary: 'Success', detail, life: 3000 });
    }

    private showError(detail: string) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail, life: 5000 });
    }
}

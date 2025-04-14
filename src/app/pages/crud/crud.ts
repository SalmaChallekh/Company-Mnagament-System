import { Component, OnInit, signal, ViewChild } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table, TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { RatingModule } from 'primeng/rating';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputNumberModule } from 'primeng/inputnumber';
import { DialogModule } from 'primeng/dialog';
import { TagModule } from 'primeng/tag';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { Product, ProductService } from '../service/product.service';

interface User {
    id?: string;
    name?: string;
    email?: string;
    role?: string;
    status?: string;
}

interface Column {
    field: string;
    header: string;
    customExportHeader?: string;
}

@Component({
    selector: 'app-crud',
    standalone: true,
    imports: [
        CommonModule,
        TableModule,
        FormsModule,
        ButtonModule,
        RippleModule,
        ToastModule,
        ToolbarModule,
        RatingModule,
        InputTextModule,
        TextareaModule,
        SelectModule,
        RadioButtonModule,
        InputNumberModule,
        DialogModule,
        TagModule,
        InputIconModule,
        IconFieldModule,
        ConfirmDialogModule
    ],
    template: `
<p-toolbar class="mb-4">
    <ng-template #start>
        <p-button label="New User" icon="pi pi-user-plus" (onClick)="openNew()" />
        
    </ng-template>
</p-toolbar>

<p-table #dt [value]="users()" [(selection)]="selectedUsers" dataKey="id" [paginator]="true" [rows]="10" [globalFilterFields]="['name', 'email']">
    <ng-template pTemplate="header">
        <tr>
            <th><p-tableHeaderCheckbox></p-tableHeaderCheckbox></th>
            <th pSortableColumn="name">Name <p-sortIcon field="name"></p-sortIcon></th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th>Actions</th>
        </tr>
    </ng-template>
    <ng-template pTemplate="body" let-user>
        <tr>
            <td><p-tableCheckbox [value]="user"></p-tableCheckbox></td>
            <td>{{ user.name }}</td>
            <td>{{ user.email }}</td>
            <td>{{ user.role }}</td>
            <td>{{ user.status }}</td>
            <td>
                <p-button icon="pi pi-pencil" class="mr-2" (click)="editUser(user)" />
                <p-button icon="pi pi-trash" severity="danger" (click)="deleteUser(user)" />
            </td>
        </tr>
    </ng-template>
</p-table>

<p-dialog [(visible)]="userDialog" header="User Details" [modal]="true" [style]="{ width: '450px' }">
    <div class="p-fluid" *ngIf="user">
        <div class="field">
            <label>Name</label>
            <input pInputText [(ngModel)]="user.name" required />
        </div>
        <div class="field">
            <label>Email</label>
            <input pInputText [(ngModel)]="user.email" required />
        </div>
        <div class="field">
            <label>Role</label>
            <p-select [(ngModel)]="user.role" [options]="roles"></p-select>
        </div>
        <div class="field">
            <label>Status</label>
            <p-select [(ngModel)]="user.status" [options]="statuses"></p-select>
        </div>
    </div>
    <ng-template #footer>
        <p-button label="Cancel" icon="pi pi-times" text (click)="hideDialog()" />
        <p-button label="Save" icon="pi pi-check" (click)="saveUser()" />
    </ng-template>
</p-dialog>

<p-confirmdialog></p-confirmdialog>
`,
    providers: [MessageService, ProductService, ConfirmationService]
})
export class Crud implements OnInit {
    userDialog: boolean = false;
    users = signal<User[]>([]);
    user!: User;
    selectedUsers!: User[] | null;
    submitted: boolean = false;
    roles = ['Admin', 'Editor', 'Viewer'];
    statuses = ['Active', 'Inactive'];
    cols!: Column[];

    @ViewChild('dt') dt!: Table;

    constructor(
        private messageService: MessageService,
        private confirmationService: ConfirmationService
    ) {}

    exportCSV() {
        this.dt.exportCSV();
    }

    ngOnInit() {
        this.loadUsers();
        this.cols = [
            { field: 'name', header: 'Name' },
            { field: 'email', header: 'Email' },
            { field: 'role', header: 'Role' },
            { field: 'status', header: 'Status' }
        ];
    }

    loadUsers() {
        this.users.set([
            { id: '1', name: 'Alice Smith', email: 'alice@example.com', role: 'Admin', status: 'Active' },
            { id: '2', name: 'Bob Jones', email: 'bob@example.com', role: 'Editor', status: 'Inactive' }
        ]);
    }

    openNew() {
        this.user = {};
        this.submitted = false;
        this.userDialog = true;
    }

    editUser(user: User) {
        this.user = { ...user };
        this.userDialog = true;
    }

    deleteSelectedUsers() {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete the selected users?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.users.set(this.users().filter((val) => !this.selectedUsers?.includes(val)));
                this.selectedUsers = null;
                this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Users Deleted', life: 3000 });
            }
        });
    }

    deleteUser(user: User) {
        this.confirmationService.confirm({
            message: `Are you sure you want to delete ${user.name}?`,
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.users.set(this.users().filter((val) => val.id !== user.id));
                this.messageService.add({ severity: 'success', summary: 'Success', detail: 'User Deleted', life: 3000 });
            }
        });
    }

    hideDialog() {
        this.userDialog = false;
        this.submitted = false;
    }

    saveUser() {
        this.submitted = true;
        let _users = this.users();

        if (this.user.name?.trim() && this.user.email?.trim()) {
            if (this.user.id) {
                _users[this.findIndexById(this.user.id)] = this.user;
                this.users.set([..._users]);
                this.messageService.add({ severity: 'success', summary: 'Success', detail: 'User Updated', life: 3000 });
            } else {
                this.user.id = this.createId();
                this.users.set([..._users, this.user]);
                this.messageService.add({ severity: 'success', summary: 'Success', detail: 'User Created', life: 3000 });
            }

            this.userDialog = false;
            this.user = {};
        }
    }

    findIndexById(id: string): number {
        return this.users().findIndex((u) => u.id === id);
    }

    createId(): string {
        return Math.random().toString(36).substring(2, 7);
    }
}

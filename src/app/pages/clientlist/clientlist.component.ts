import { Component, OnInit, ViewChild } from '@angular/core';
import { ClientService } from '../../services/client.service';
import { NgModule } from '@angular/core';


// PrimeNG Modules
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { Table, TableModule } from 'primeng/table';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextarea } from 'primeng/inputtextarea';
import { TagModule } from 'primeng/tag';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { InputIconModule } from 'primeng/inputicon';
import { ToastModule } from 'primeng/toast';
import { IconFieldModule } from 'primeng/iconfield';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
export interface Client {
    id?: string;
    fullName: string;
    phone: number;
    email: string;
    companyName: string;
    address: string;
    industry: string;
    createdAt?: string;
    interactionLogs?: InteractionLog[];
}

export interface InteractionLog {
    date: string;
    notes: string;
}

@Component({
    selector: 'app-clientlist',
    imports: [
        CommonModule,
        FormsModule,
        ToolbarModule,
        ButtonModule,
        DialogModule,
        TableModule,
        CalendarModule,
        DropdownModule,
        InputTextModule,
        InputTextModule,
ConfirmDialogModule,
        TagModule, ToastModule, InputIconModule, IconFieldModule],
    templateUrl: './clientlist.component.html',
    styleUrl: './clientlist.component.scss',
    providers: [ConfirmationService, MessageService]
})
export class ClientlistComponent implements OnInit {
    clients: Client[] = [];
    clientDialog: boolean = false;

    client: Client = this.getEmptyClient();
    submitted = false;
    constructor(private clientService: ClientService, private messageService: MessageService,
        private confirmationService: ConfirmationService) { }

    ngOnInit(): void {
        this.loadClients();
    }

    loadClients() {
        this.clientService.getAllClients().subscribe({
            next: (data) => this.clients = data,
            error: (err) => console.error('Failed to load clients', err)
        });
    }

    openNewClient() {
        this.client = this.getEmptyClient();
        this.clientDialog = true;
    }

    hideDialog() {
        this.clientDialog = false;
    }

    saveClient() {
        this.submitted = true;
        const isNew = !this.client.id;

        const action$ = isNew
            ? this.clientService.createClient(this.client)
            : this.clientService.updateClient(this.client.id!, this.client);

        action$.subscribe({
            next: () => {
                this.messageService.add({
                    severity: 'success',
                    summary: isNew ? 'Client Created' : 'Client Updated',
                    detail: isNew ? 'New client added' : 'Client updated successfully',
                    life: 3000
                });
                this.clientDialog = false;
                this.loadClients();
            },
            error: err => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to save client',
                    life: 3000
                });
            }
        });
    }
    editClient(client: Client) {
        this.client = { ...client };
        this.clientDialog = true;
    }
    deleteClient(client: Client) {
        console.log('Clicked delete on:', client);
        if (!client.id) {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Client ID is missing',
                life: 3000
            });
            return;
        }

        this.confirmationService.confirm({
            message: `Are you sure you want to delete ${client.fullName}?`,
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.clientService.deleteClient(client.id!).subscribe({
                    next: () => {
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Deleted',
                            detail: 'Client deleted',
                            life: 3000
                        });
                        this.loadClients();
                    },
                    error: () => {
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: 'Deletion failed',
                        });
                    }
                });
            }
        });
    }


    viewClient(client: Client) {
        console.log('View client:', client);
    }

    printClient(client: Client) {
        console.log('Print client:', client);
    }

    private getEmptyClient(): Client {
        return {
            fullName: '',
            phone: 0,
            email: '',
            companyName: '',
            address: '',
            industry: '',
            interactionLogs: []
        };
    }
    @ViewChild('dt') dt!: Table;
    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }
}

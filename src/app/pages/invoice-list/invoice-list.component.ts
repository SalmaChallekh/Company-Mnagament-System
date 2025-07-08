import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { Table, TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { InvoicesService } from '../../services/invoices.service';
import { CalendarModule } from 'primeng/calendar';
import { CardModule } from 'primeng/card';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextarea } from 'primeng/inputtextarea';
import { MultiSelectModule } from 'primeng/multiselect';
import { ProgressBarModule } from 'primeng/progressbar';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';


interface Invoice {
    id?: string;
    invoiceDate: Date;
    dueDate: Date;
    totalAmount: number;
    status: 'PAID' | 'PENDING' | 'OVERDUE';
    items: string;
}

@Component({
    selector: 'app-invoice-list',
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
        InputTextarea,
        CalendarModule,
        DropdownModule,
        MultiSelectModule,
        ToastModule,
        CardModule,
        ConfirmDialogModule,
        ProgressBarModule,
        IconFieldModule,
        InputIconModule
    ],
    templateUrl: './invoice-list.component.html',
    styleUrls: ['./invoice-list.component.scss'],
    providers: [MessageService, ConfirmationService]
})
export class InvoiceListComponent implements OnInit {
    invoices: Invoice[] = [];
    invoiceDialog: boolean = false;

    invoice: Invoice = {
        id: '',
        invoiceDate: new Date(),
        dueDate: new Date(),
        totalAmount: 0,
        status: 'PENDING',
        items: ''
    };

    statusOptions = [
        { label: 'Paid', value: 'PAID' },
        { label: 'Pending', value: 'PENDING' },
        { label: 'Overdue', value: 'OVERDUE' }
    ];

    constructor(private invoiceService: InvoicesService, private confirmationService: ConfirmationService,
        private messageService: MessageService) { }

    ngOnInit(): void {
        this.loadInvoices();
    }

    loadInvoices() {
        this.invoiceService.getAllInvoices().subscribe({
            next: (data) => this.invoices = data,
            error: (err) => console.error('Failed to load invoices', err)
        });
    }

    openNewInvoice() {
        this.invoice = {
            id: '',
            invoiceDate: new Date(),
            dueDate: new Date(),
            totalAmount: 0,
            status: 'PENDING',
            items: ''
        };
        this.invoiceDialog = true;
    }

    editInvoice(invoice: Invoice) {
        this.invoice = { ...invoice }; // clone pour éviter de modifier la table directement
        this.invoiceDialog = true;
    }

    deleteInvoice(invoice: Invoice) {
        this.confirmationService.confirm({
            message: `Are you sure you want to delete this invoice ?`,
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',

            accept: () => {
                this.invoiceService.deleteInvoice(invoice).subscribe({

                    next: () => {
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Successful',
                            detail: 'Invoice Deleted',
                            life: 3000
                        });
                        this.loadInvoices();
                    },
                    error: (error) => {
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: error.error?.message || 'Failed to delete invoice'
                        });
                    }
                });
            }
        });
    }
    saveInvoice() {
        if (this.invoice.id) {
            // Update
            this.invoiceService.updateInvoice(this.invoice).subscribe({
                next: () => {
                    this.loadInvoices();
                    this.invoiceDialog = false;
                },
                error: err => console.error('Error updating invoice', err)
            });
        } else {
            // Create — create a new object without `id`
            const { id, ...invoicePayload } = this.invoice;

            this.invoiceService.createInvoice(invoicePayload).subscribe({
                next: (createdInvoice) => {
                    console.log('Created invoice:', createdInvoice);
                    this.loadInvoices();
                    this.invoiceDialog = false;
                },
                error: err => console.error('Error creating invoice', err)
            });
        }
    }

    // saveInvoice() {
    //     const invoicePayload = { ...this.invoice };

    //     // If it's a new invoice, remove the empty `id` field
    //     if (!invoicePayload.id) {
    //         delete invoicePayload.id;
    //     }
    //     if (this.invoice.id) {
    //         // Update
    //         this.invoiceService.updateInvoice(this.invoice).subscribe({
    //             next: () => {
    //                 this.messageService.add({
    //                     severity: 'success',
    //                     summary: 'Updated',
    //                     detail: 'Invoice updated',
    //                     life: 3000
    //                 });
    //                 this.loadInvoices();
    //                 this.invoiceDialog = false;
    //             },
    //             error: err => console.error('Error updating invoice', err)
    //         });
    //     } else {
    //         // Create
    //         console.log('Invoice being sent:', this.invoice);

    //         this.invoiceService.createInvoice(this.invoice).subscribe({
    //             next: (createdInvoice) => {
    //                 console.log('Created invoice from backend:', createdInvoice); // ✅ DEBUG
    //                 this.messageService.add({
    //                     severity: 'success',
    //                     summary: 'Created',
    //                     detail: `Invoice #${createdInvoice.id} created`,
    //                     life: 3000
    //                 });

    //                 this.loadInvoices(); // ✅ Reload with real ID
    //                 this.invoiceDialog = false;
    //             },
    //             error: err => console.error('Error creating invoice', err)
    //         });
    //     }
    // }


    // saveInvoice() {
    //     if (this.invoice.id) {
    //         // Update
    //         this.invoiceService.updateInvoice(this.invoice).subscribe({
    //             next: () => {
    //                 this.loadInvoices();
    //                 this.invoiceDialog = false;
    //             },
    //             error: err => console.error('Error updating invoice', err)
    //         });
    //     } else {
    //         // Create
    //         this.invoiceService.createInvoice(this.invoice).subscribe({
    //             next: () => {
    //                 this.loadInvoices();
    //                 this.invoiceDialog = false;
    //             },
    //             error: err => console.error('Error creating invoice', err)
    //         });
    //     }
    // }

    hideDialog() {
        this.invoiceDialog = false;
    }

    viewInvoice(invoice: Invoice) {
        console.log('View invoice:', invoice);
    }

    printInvoice(invoice: Invoice) {
        console.log('Print invoice:', invoice);
    }

    getStatusSeverity(status: string): 'success' | 'warn' | 'danger' | undefined {
        switch (status) {
            case 'PAID':
                return 'success';
            case 'PENDING':
                return 'warn';
            case 'OVERDUE':
                return 'danger';
            default:
                return undefined;
        }
    }

    onGlobalFilter(table: any, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }
}

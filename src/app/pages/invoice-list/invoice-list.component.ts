import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
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

interface Invoice {
    id: string;
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
    styleUrls: ['./invoice-list.component.scss']
})
export class InvoiceListComponent {
    invoices: Invoice[] = [];
    constructor(private invoiceService: InvoicesService) { }
    ngOnInit(): void {
        this.loadInvoices();
    }
    loadInvoices() {
        this.invoiceService.getAllInvoices().subscribe({
            next: (data) => this.invoices = data,
            error: (err) => console.error('Failed to load invoices', err)
        });
    }
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

    hideDialog() {
        this.invoiceDialog = false;
    }

    saveInvoice() {
        this.invoiceService.createInvoice(this.invoice).subscribe({
            next: () => {
                this.loadInvoices();
                this.invoiceDialog = false;
            },
            error: err => console.error('Error creating invoice', err)
        });
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
}

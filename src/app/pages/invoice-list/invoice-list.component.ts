import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';

interface Invoice {
    id: string;
    number: string;
    clientName: string;
    date: Date;
    amount: number;
    status: 'PAID' | 'PENDING' | 'OVERDUE';
}

@Component({
    selector: 'app-invoice-list',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ToolbarModule,
        ButtonModule,
        TableModule,
        TagModule
    ],
    template: `
    <div class="card">
      <p-toolbar>
        <ng-template pTemplate="left">
          <h4>Invoices</h4>
        </ng-template>
        <ng-template pTemplate="right">
          <p-button label="New Invoice" icon="pi pi-plus"
                   (click)="createInvoice()"></p-button>
        </ng-template>
      </p-toolbar>

      <p-table [value]="invoices" [paginator]="true" [rows]="10">
        <ng-template pTemplate="header">
          <tr>
            <th>Number</th>
            <th>Client</th>
            <th>Date</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </ng-template>
        <ng-template pTemplate="body" let-invoice>
          <tr>
            <td>{{invoice.number}}</td>
            <td>{{invoice.clientName}}</td>
            <td>{{invoice.date | date}}</td>
            <td>{{invoice.amount | currency}}</td>
            <td>
              <p-tag [value]="invoice.status"
                    [severity]="getStatusSeverity(invoice.status)">
              </p-tag>
            </td>
            <td>
              <button pButton icon="pi pi-eye"
                     (click)="viewInvoice(invoice)"></button>
              <button pButton icon="pi pi-print"
                     (click)="printInvoice(invoice)"></button>
            </td>
          </tr>
        </ng-template>
      </p-table>
    </div>
  `,
    styleUrls: ['./invoice-list.component.scss']
})
export class InvoiceListComponent {
    invoices: Invoice[] = [
        {
            id: '1',
            number: 'INV-001',
            clientName: 'Acme Corp',
            date: new Date(),
            amount: 1250.50,
            status: 'PAID'
        },
        {
            id: '2',
            number: 'INV-002',
            clientName: 'Globex',
            date: new Date(),
            amount: 3250.75,
            status: 'PENDING'
        }
    ];

    createInvoice() {
        console.log('Create invoice clicked');
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

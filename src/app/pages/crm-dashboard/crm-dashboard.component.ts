import { Component, OnInit } from '@angular/core';
import { ClientService } from '../../services/client.service';
import { InvoiceService } from '../../services/invoice.service';
import { VendorService } from '../../services/vendor.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-crm-dashboard',
  imports: [CommonModule,
    FormsModule,],
  templateUrl: './crm-dashboard.component.html',
  styleUrl: './crm-dashboard.component.scss'
})
export class CrmDashboardComponent implements OnInit {
  totalClients = 0;
  totalInvoices = 0;
  totalVendors = 0;

  constructor(
    private clientService: ClientService,
    private invoiceService: InvoiceService,
    private vendorService: VendorService
  ) {}

  ngOnInit(): void {
    this.clientService.getAllClients().subscribe(data => this.totalClients = data.length);
    this.invoiceService.getAllInvoices().subscribe(data => this.totalInvoices = data.length);
    this.vendorService.getAllVendors().subscribe(data => this.totalVendors = data.length);
  }
}

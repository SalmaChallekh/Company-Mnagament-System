import { Component, OnInit, ViewChild } from '@angular/core';
import { Vendor } from '../../services/vendor.service';
import { CommonModule } from '@angular/common';
import { Table, TableModule } from 'primeng/table';
import { FormsModule } from '@angular/forms';
import { VendorService } from '../../services/vendor.service';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
    selector: 'app-vendorl-ist',
    imports: [CommonModule, TableModule, FormsModule,
        TableModule,
        DialogModule,
        ButtonModule,
        InputTextModule, CommonModule,
        FormsModule,
        ToolbarModule,
        ButtonModule,
        DialogModule,
        TableModule,
        CalendarModule,
        DropdownModule,
        InputTextModule,
        InputTextModule, ConfirmDialogModule,
        TagModule, ToastModule, InputIconModule, IconFieldModule],
    templateUrl: './vendorl-ist.component.html',
    styleUrl: './vendorl-ist.component.scss',
    providers: [
         MessageService,
        ConfirmationService, // nécessaire pour utiliser la confirmation
    ],
})
export class VendorListComponent implements OnInit {
    ngOnInit(): void {
        this.loadVendors();
    }
    vendors: Vendor[] = [];
    // VENDORS
    vendorDialog: boolean = false;
    vendor: Vendor = {
        name: '',
        email: '',
        phone: 0,
        address: '',
        category: '',
        issueLogs: [],
        ratings: []
    };
    constructor(
        private vendorService: VendorService,private messageService: MessageService,
                private confirmationService: ConfirmationService
    ) { }
    hideDialog() {
        this.vendorDialog = false;
    }
    loadVendors() {
        this.vendorService.getAllVendors().subscribe({
            next: data => this.vendors = data,
            error: err => console.error('Failed to load vendors', err)
        });
    }
    openNewVendor() {
        this.vendor = {
            name: '',
            email: '',
            phone: 0,
            address: '',
            category: ''
        };
        this.vendorDialog = true;
    }
    saveVendor() {
        const action = this.vendor.id
            ? this.vendorService.updateVendor(this.vendor.id, this.vendor)
            : this.vendorService.createVendor(this.vendor);
        action.subscribe({
            next: () => {
                this.loadVendors();
                this.vendorDialog = false;
            },
            error: err => console.error('Error saving vendor', err)
        });
    }
    editVendor(v: Vendor) {
        this.vendor = { ...v };
        this.vendorDialog = true;
    }
    deleteVendor(vendor: Vendor) {
        if (!vendor.id) {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Vendor ID is missing',
                life: 3000
            });
            return;
        }

        this.confirmationService.confirm({
            message: `Are you sure you want to delete ${vendor.name}?`,
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.vendorService.deleteVendor(vendor.id!).subscribe({
                    next: () => {
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Deleted',
                            detail: 'Vendor deleted',
                            life: 3000
                        });
                        this.loadVendors();
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
    getAverageRating(ratings: number[]): number {
        if (!ratings || ratings.length === 0) return 0;
        const sum = ratings.reduce((a, b) => a + b, 0);
        return +(sum / ratings.length).toFixed(1);
    }
    @ViewChild('dt') dt!: Table;
    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }
}



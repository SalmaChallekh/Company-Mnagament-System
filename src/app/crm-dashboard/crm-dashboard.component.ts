import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { TableModule } from 'primeng/table';
import { TimelineModule } from 'primeng/timeline';
import { CrmDashboardService } from '../services/crm-dashboard.service';
@Component({
    selector: 'app-crm-dashboard',
    templateUrl: './crm-dashboard.component.html',
    standalone: true,
    imports: [TimelineModule, CardModule, CalendarModule, FormsModule, CommonModule,
        ChartModule, TableModule,],
})
export class CrmDashboardComponent implements OnInit {
    selectedDate: Date = new Date();

    stats: { label: string; value: any; subtext: string }[] = [];
    interactions: any[] = [];
    meetings: any[] = [];
    contacts: any[] = [];

    pipelineData: any = {
        labels: [],
        datasets: []
    };

    pipelineOptions: any = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            }
        }
    };
    constructor(private dashboardService: CrmDashboardService) { }
    ngOnInit() {
        this.dashboardService.getStats().subscribe(data => {
            this.stats = [
                { label: 'Total Clients', value: data.clients.total, subtext: '+5 this week' },
                { label: 'Vendors', value: data.vendors.total, subtext: '+2 new' },
                { label: 'Interactions', value: data.interactions.total, subtext: 'Past 30 days' },
                { label: 'Deals Closed', value: data.deals.total, subtext: 'This month' }
            ];
        });

        this.dashboardService.getRecentInteractions().subscribe(data => {
            this.interactions = data;
        });

        this.dashboardService.getUpcomingMeetings().subscribe(data => {
            this.meetings = data;
        });

        this.dashboardService.getContacts().subscribe(data => {
            this.contacts = data;
        });

        this.dashboardService.getPipelineData().subscribe(data => {
            this.pipelineData = {
                labels: data.stages,
                datasets: [{
                    label: 'Deals',
                    backgroundColor: '#f472b6',
                    data: data.values
                }]
            };
        });
    }

    // selectedDate: Date = new Date();

    // stats = [
    //     { label: 'Total Clients', value: '128', subtext: '+5 this week' },
    //     { label: 'Vendors', value: '34', subtext: '+2 new' },
    //     { label: 'Interactions', value: '243', subtext: 'Past 30 days' },
    //     { label: 'Deals Closed', value: '18', subtext: 'This month' }
    // ];

    // interactions = [
    //     { name: 'Acme Corp', message: 'Requested updated proposal.', date: '1h ago' },
    //     { name: 'Beta Ltd', message: 'Scheduled meeting for Thursday.', date: 'Yesterday' },
    //     { name: 'Zeta Partners', message: 'Inquired about invoice status.', date: '2 days ago' }
    // ];

    // meetings = [
    //     { subject: 'Client: Q2 Review', time: 'Tomorrow 10 AM' },
    //     { subject: 'Vendor Call: Supplies', time: 'Friday 3 PM' },
    //     { subject: 'Strategy Session', time: 'Next Monday 9 AM' }
    // ];

    // contacts = [
    //     { name: 'Alice Smith', type: 'Client', email: 'alice@domain.com', status: 'Active' },
    //     { name: 'VendorX Ltd', type: 'Vendor', email: 'contact@vendorx.com', status: 'Active' },
    //     { name: 'Bob Johnson', type: 'Client', email: 'bob@domain.com', status: 'Inactive' },
    //     { name: 'Delta Supplies', type: 'Vendor', email: 'sales@delta.com', status: 'Active' }
    // ];

    // pipelineData = {
    //     labels: ['Prospects', 'Negotiation', 'Proposal Sent', 'Won'],
    //     datasets: [
    //         {
    //             label: 'Deals',
    //             backgroundColor: '#f472b6',
    //             data: [40, 22, 18, 12]
    //         }
    //     ]
    // };

    // pipelineOptions = {
    //     responsive: true,
    //     maintainAspectRatio: false,
    //     plugins: {
    //         legend: {
    //             display: false
    //         }
    //     }
    // };
}

import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { ChartModule } from 'primeng/chart';

interface Report {
    id: string;
    title: string;
    type: 'PAYROLL' | 'ATTENDANCE' | 'LEAVE' | 'TAX';
    period: string;
    generatedDate: Date;
    downloadCount: number;
}

@Component({
    selector: 'app-reports',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        TableModule,
        ButtonModule,
        CardModule,
        DropdownModule,
        CalendarModule,
        ChartModule
    ],
    templateUrl: './reports.component.html',
    styleUrls: ['./reports.component.scss']
})
export class ReportsComponent {
    reports = signal<Report[]>([]);
    selectedReportType: string = 'PAYROLL';
    dateRange: Date[] = [new Date(), new Date()];
    chartData: any;
    chartOptions: any;

    reportTypes = [
        { label: 'Payroll Reports', value: 'PAYROLL' },
        { label: 'Attendance Reports', value: 'ATTENDANCE' },
        { label: 'Leave Reports', value: 'LEAVE' },
        { label: 'Tax Reports', value: 'TAX' }
    ];

    constructor() {
        this.initializeChart();
        this.loadSampleData();
    }

    initializeChart() {
        this.chartData = {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [
                {
                    label: 'Reports Generated',
                    data: [12, 19, 15, 25, 18, 22],
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                }
            ]
        };

        this.chartOptions = {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        };
    }

    loadSampleData() {
        const sampleData: Report[] = [
            {
                id: '1',
                title: 'Monthly Payroll June 2023',
                type: 'PAYROLL',
                period: 'June 2023',
                generatedDate: new Date(2023, 5, 30),
                downloadCount: 24
            },
            {
                id: '2',
                title: 'Attendance Summary Q2 2023',
                type: 'ATTENDANCE',
                period: 'Q2 2023',
                generatedDate: new Date(2023, 6, 15),
                downloadCount: 18
            },
            {
                id: '3',
                title: 'Leave Balance Report',
                type: 'LEAVE',
                period: 'June 2023',
                generatedDate: new Date(2023, 5, 28),
                downloadCount: 32
            }
        ];
        this.reports.set(sampleData);
    }

    generateReport() {
        const newReport: Report = {
            id: Math.random().toString(36).substring(2, 9),
            title: `${this.selectedReportType} Report - ${this.getPeriodLabel()}`,
            type: this.selectedReportType as any,
            period: this.getPeriodLabel(),
            generatedDate: new Date(),
            downloadCount: 0
        };

        this.reports.set([newReport, ...this.reports()]);
    }

    getPeriodLabel(): string {
        if (this.dateRange[0] && this.dateRange[1]) {
            if (this.dateRange[0].getMonth() === this.dateRange[1].getMonth()) {
                return this.dateRange[0].toLocaleString('default', { month: 'long', year: 'numeric' });
            }
            return `${this.dateRange[0].toLocaleString('default', { month: 'short' })} - ${this.dateRange[1].toLocaleString('default', { month: 'short', year: 'numeric' })}`;
        }
        return 'Custom Period';
    }

    downloadReport(report: Report) {
        // In a real app, this would trigger a file download
        report.downloadCount++;
        this.reports.set([...this.reports()]);
    }
}

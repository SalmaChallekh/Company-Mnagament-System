import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { ChartModule } from 'primeng/chart';
import { AttendanceService } from '../../services/attendance.service'; // adjust path if needed

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
    constructor(private reportService: AttendanceService) {
        this.initializeChart();
        //this.loadAttendanceData();
    }
    initializeChart() {
        this.chartData = {
            labels: [],
            datasets: []
        };
        this.chartOptions = {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top'
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        };
    }

    // loadAttendanceData() {
    //     const today = new Date();
    //     const year = today.getFullYear();
    //     const month = today.getMonth() + 1;

    //     this.reportService.getMonthlySummary(year, month).subscribe({
    //         next: (data) => {
    //             const attendance = data[0] || { presentDays: 0, leaveDays: 0 };
    //             this.chartData = {
    //                 labels: ['Present Days', 'Leave Days'],
    //                 datasets: [
    //                     {
    //                         label: 'Monthly Attendance',
    //                         data: [attendance.presentDays, attendance.leaveDays],
    //                         backgroundColor: ['#42A5F5', '#FFA726']
    //                     }
    //                 ]
    //             };

    //             const newReport: Report = {
    //                 id: Math.random().toString(36).substring(2, 9),
    //                 title: `Attendance Summary - ${year}-${month.toString().padStart(2, '0')}`,
    //                 type: 'ATTENDANCE',
    //                 period: `${year}-${month.toString().padStart(2, '0')}`,
    //                 generatedDate: new Date(),
    //                 downloadCount: 0
    //             };
    //             this.reports.set([newReport, ...this.reports()]);
    //         },
    //         error: (err) => {
    //             console.error('Error fetching attendance summary:', err);
    //         }
    //     });
    // }

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
        report.downloadCount++;
        this.reports.set([...this.reports()]);
    }

    exportCsv() {
        this.reportService.exportDailyCsv();
    }

    exportExcel() {
        this.reportService.exportDailyExcel();
    }
}

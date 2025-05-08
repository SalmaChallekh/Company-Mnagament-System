import { Component } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { TableModule } from 'primeng/table';
import { KnobModule } from 'primeng/knob';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';

@Component({
    standalone: true,
    imports: [
        FormsModule,
        ChartModule,
        TableModule,
        KnobModule,
        DropdownModule,
        CalendarModule,
        ButtonModule
    ],
    templateUrl: './dashboards.component.html',
    styleUrls: ['./dashboards.component.scss']
})
export class DashboardsComponent {
    date: Date = new Date();
    value: number = 85;
    departmentOptions = [
        { name: 'Human Resources', code: 'HR' },
        { name: 'Development', code: 'DEV' },
        { name: 'Sales', code: 'SALES' }
    ];
    selectedDepartment = this.departmentOptions[0];
    // Updated Employee Performance Data with all required datasets
    employeePerformanceData = {
        labels: ['January', 'February', 'March', 'April', 'May'],
        datasets: [
            {
                label: 'Average Performance',
                data: [72, 75, 78, 80, 82],
                fill: false,
                backgroundColor: 'rgba(245, 158, 11, 0.2)', // amber-500
                borderColor: '#f59e0b', // amber-500
                tension: 0.4
            },
            {
                label: 'Top Performers',
                data: [85, 88, 90, 92, 95],
                fill: false,
                backgroundColor: 'rgba(59, 130, 246, 0.2)', // blue-500
                borderColor: '#3b82f6', // blue-500
                tension: 0.4
            },
            {
                label: 'Department Avg',
                data: [75, 77, 79, 81, 83],
                fill: false,
                backgroundColor: 'rgba(16, 185, 129, 0.2)', // green-500
                borderColor: '#10b981', // green-500
                tension: 0.4
            },
            {
                label: 'Underperformers',
                data: [60, 62, 58, 55, 50],
                fill: false,
                backgroundColor: 'rgba(239, 68, 68, 0.2)', // red-500
                borderColor: '#ef4444', // red-500
                tension: 0.4
            }
        ]
    };
    employeePerformanceOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false // We'll use custom footer legend instead
            },
            tooltip: {
                mode: 'index',
                intersect: false
            }
        },
        scales: {
            y: {
                beginAtZero: false,
                min: 40,
                max: 100,
                ticks: {
                    callback: function (value: number) {
                        return value + '%';
                    }
                }
            }
        }
    };
    employees = [
        { id: 1, name: 'Alice Johnson', department: 'Development', position: 'Software Engineer', status: 'Active' },
        { id: 2, name: 'Bob Smith', department: 'Human Resources', position: 'HR Manager', status: 'On Leave' },
        { id: 3, name: 'Charlie Rose', department: 'Sales', position: 'Sales Executive', status: 'Active' }
    ];
    departmentDistributionData = {
        labels: ['Development', 'HR', 'Sales'],
        datasets: [{
            data: [50, 25, 25],
            backgroundColor: ["#42A5F5", "#66BB6A", "#FFA726"]
        }]
    };
    departmentDistributionOptions = {
        responsive: true,
        plugins: {
            legend: { position: 'right' },
            title: { display: true, text: 'Employee Distribution by Department' }
        }
    };
    salesOverviewData = {
        labels: ['Q1', 'Q2', 'Q3', 'Q4'],
        datasets: [
            { label: 'Product A', backgroundColor: '#42A5F5', data: [65, 59, 80, 81] },
            { label: 'Product B', backgroundColor: '#66BB6A', data: [28, 48, 40, 19] }
        ]
    };
    salesOverviewOptions = {
        responsive: true,
        plugins: {
            legend: { position: 'top' },
            title: { display: true, text: 'Quarterly Sales Comparison' }
        }
    };
    revenueBreakdownData = {
        labels: ['Subscriptions', 'One-time Purchases', 'Services'],
        datasets: [
            {
                data: [55, 30, 15],
                backgroundColor: ["#FFA726", "#42A5F5", "#66BB6A"],
                hoverBackgroundColor: ["#FFB74D", "#64B5F6", "#81C784"]
            }
        ]
    };
    revenueBreakdownOptions = {
        responsive: true,
        plugins: {
            legend: { position: 'bottom' },
            title: { display: true, text: 'Revenue Sources' }
        }
    };

    // Progress values
    targetValue: number = 75;
    completedValue: number = 80;
    salesValue: number = 65;
    trainingValue: number = 40;
    clientsValue: number = 50;

    // Method to update chart when department changes
    onDepartmentChange() {
        // You can implement logic here to update the charts based on selected department
        console.log('Department changed to:', this.selectedDepartment);
    }
}

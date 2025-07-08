import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ChartModule } from 'primeng/chart';
import { TableModule } from 'primeng/table';
import { KnobModule } from 'primeng/knob';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DashboardService } from '../../services/dashboard.service';
import { DepartmentService } from '../../services/department.service';
import { AttendanceService } from '../../services/attendance.service';

interface AttendanceLeaveSummary {
    month: string;
    presentDays: number;
    leaveDays: number;
}

@Component({
    standalone: true,
    imports: [
        FormsModule,
        ChartModule,
        TableModule,
        KnobModule,
        DropdownModule,
        CalendarModule,
        ButtonModule,
        CommonModule,
        CardModule
    ],
    templateUrl: './dashboards.component.html',
    styleUrls: ['./dashboards.component.scss']
})
export class DashboardsComponent {
    // UI/Knob Values
    targetValue = 75;
    completedValue = 45;
    salesValue = 60;
    trainingValue = 30;
    clientsValue = 90;

    topPerformers: any[] = [];
    lowPerformers: any[] = [];
    averageScore: number = 0;


    // Filters
    selectedDepartment = { name: 'Human Resources', code: 'HR' };
    departmentOptions = [
        { name: 'Human Resources', code: 'HR' },
        { name: 'Development', code: 'DEV' },
        { name: 'Sales', code: 'SALES' }
    ];
    selectedDate: Date = new Date();

    // Dashboard Stats
    activeProjects = 0;
    activeProjectsGrowth: number | null = null;
    completedTasks = 0;
    completedTasksGrowth: number | null = null;
    totalUsers = 0;
    userGrowth = 0;
    totalClients = 0;
    clientsGrowth = 0;
    average = 0;
    distLabels: string[] = [];
    distData: number[] = [];
    deptLabels: string[] = [];
    deptData: number[] = [];
    barChartData: any;         // declare bar chart data
    pieChartData: any;         // declare pie chart data
    barChartOptions: any;
    // Chart Data
    departmentDistributionData: any = { labels: [], datasets: [] };
    departmentDistributionOptions: any;

    attendanceData: any;
    attendanceOptions: any;

    financialBreakdownData: any = {
        labels: ['Net Salaries', 'Deductions', 'Bonuses'],
        datasets: [{
            data: [50000, 10000, 5000],
            backgroundColor: ['#66BB6A', '#EF5350', '#FFA726'],
            hoverBackgroundColor: ['#81C784', '#E57373', '#FFB74D']
        }]
    };
    financialBreakdownOptions: any = {
        responsive: true,
        plugins: {
            legend: { position: 'bottom' },
            title: { display: true, text: 'Payroll Expense Breakdown' }
        }
    };

    employees: any[] = [];

    constructor(
        private dashboardService: DashboardService,
        private departmentService: DepartmentService,
        private attendanceService: AttendanceService,
        private http: HttpClient,
        private predictionService: DashboardService
    ) { }
    form = {
        yearsAtCompany: 0,
        monthlySalary: 5000,
        overtimeHours: 0,
        promotions: 0,
        employeeSatisfactionScore: 2.0,
    };

    prediction: number | null = null;


    submit() {
        this.predictionService.predictPerformance(this.form).subscribe({
            next: (res) => (this.prediction = res.prediction),
            error: (err) => console.error(err),
        });
    }

    ngOnInit(): void {
        this.loadDashboardData();
        this.loadDepartmentDistribution();
        this.loadEmployeesWithAttendance();
        this.loadFinancialBreakdown();
        this.loadAttendanceLeaveSummary();
        // Example static data (replace with real API call)
        const performanceData = {
            months: ["5"],
            averagePerformance: [4.85],
            topPerformers: [14.85],
            departmentAvg: [7.85],
            underperformers: [-5.15]
        };

        this.updateEmployeePerformanceChart(performanceData);
        console.log(this.employeePerformanceData);

    }
    updateEmployeePerformanceChart(data: {
        months: string[],
        averagePerformance: number[],
        topPerformers: number[],
        departmentAvg: number[],
        underperformers: number[]
    }) {
        // Optionally, convert month numbers to readable labels (e.g., "May")
        const monthLabels = data.months.map(m => {
            const monthNum = parseInt(m, 10);
            return new Date(0, monthNum - 1).toLocaleString('default', { month: 'short' });
        });

        this.employeePerformanceData = {
            labels: monthLabels,
            datasets: [
                {
                    label: 'Average Performance',
                    data: data.averagePerformance,
                    fill: false,
                    borderColor: '#f59e0b',
                    tension: 0.4
                },
                {
                    label: 'Top Performers',
                    data: data.topPerformers,
                    fill: false,
                    borderColor: '#3b82f6',
                    tension: 0.4
                },
                {
                    label: 'Department Avg',
                    data: data.departmentAvg,
                    fill: false,
                    borderColor: '#10b981',
                    tension: 0.4
                },
                {
                    label: 'Underperformers',
                    data: data.underperformers,
                    fill: false,
                    borderColor: '#ef4444',
                    tension: 0.4
                }
            ]
        };
        this.predictionService.getSummary().subscribe((data) => {
            this.average = data.average;

            this.barChartData = {
                labels: Object.keys(data.distribution),
                datasets: [
                    {
                        label: 'Predicted Score Count',
                        data: Object.values(data.distribution),
                        backgroundColor: '#42A5F5'
                    }
                ]
            };

            this.pieChartData = {
                labels: Object.keys(data.byDepartment),
                datasets: [
                    {
                        data: Object.values(data.byDepartment),
                        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#66BB6A', '#BA68C8']
                    }
                ]
            };

            this.barChartOptions = {
                responsive: true,
                plugins: {
                    legend: { position: 'top' },
                    title: { display: true, text: 'Prediction Score Distribution' }
                }
            };
        });
    }


    onDateChange() {
        this.loadAttendanceLeaveSummary();
        this.loadFinancialBreakdown();
    }

    onDepartmentChange() {
        console.log('Department changed to:', this.selectedDepartment);
        // Filter logic can be added here
    }

    private getHeaders(): HttpHeaders {
        const token = localStorage.getItem('token');
        return new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        });
    }

    loadDashboardData() {
        this.dashboardService.getTotalUsers().subscribe({
            next: (count) => this.totalUsers = count,
            error: (err) => console.error('Failed to load user count', err)
        });

        this.dashboardService.getActiveProjects().subscribe({
            next: res => {
                this.activeProjects = res.count;
                this.activeProjectsGrowth = res.growth;
            },
            error: err => console.error('Failed to load active projects', err)
        });

        this.dashboardService.getCompletedTasks().subscribe({
            next: res => {
                this.completedTasks = res.count;
                this.completedTasksGrowth = res.growth;
            },
            error: err => console.error('Failed to load completed tasks', err)
        });

        this.dashboardService.getTotalClients().subscribe({
            next: count => this.totalClients = count,
            error: err => console.error('Failed to load clients count', err)
        });

        this.dashboardService.getUserGrowth().subscribe({
            next: growth => this.userGrowth = growth,
            error: err => console.error('Failed to load user growth', err)
        });

        this.dashboardService.getClientsGrowth().subscribe({
            next: growth => this.clientsGrowth = growth,
            error: err => console.error('Failed to load clients growth', err)
        });
    }

    loadDepartmentDistribution() {
        this.departmentService.getDepartmentDistribution().subscribe({
            next: data => {
                this.departmentDistributionData = {
                    labels: Object.keys(data),
                    datasets: [{
                        data: Object.values(data),
                        backgroundColor: ["#42A5F5", "#66BB6A", "#FFA726", "#FFA500", "#00CED1"]
                    }]
                };
            },
            error: error => console.error('Error loading department distribution', error)
        });
    }

    private async getDepartmentName(departmentId: number): Promise<string> {
        if (!departmentId) return 'Unknown';
        try {
            const department = await this.departmentService.getDepartmentById(departmentId).toPromise();
            return department?.name || 'Unknown';
        } catch (error) {
            console.error(`Failed to load department ${departmentId}`, error);
            return 'Unknown';
        }
    }

    async loadEmployeesWithAttendance() {
        try {
            const employees = await this.attendanceService.getAllEmployees().toPromise() || [];
            const today = new Date().toISOString().split('T')[0];

            const employeePromises = employees.map(async emp => {
                try {
                    const attendanceList = await this.attendanceService.getUserAttendance(emp.id, '').toPromise();
                    const isPresentToday = attendanceList?.some(a => a.date.split('T')[0] === today);
                    const departmentName = await this.getDepartmentName(emp.departmentId);

                    return {
                        id: emp.id,
                        name: emp.username,
                        department: departmentName,
                        position: emp.role || 'Unknown',
                        status: isPresentToday ? 'Active' : 'Absent'
                    };
                } catch {
                    const departmentName = await this.getDepartmentName(emp.departmentId);
                    return {
                        id: emp.id,
                        name: emp.username,
                        department: departmentName,
                        position: emp.role || 'Unknown',
                        status: 'Absent'
                    };
                }
            });

            this.employees = await Promise.all(employeePromises);
        } catch (error) {
            console.error('Error loading employees with attendance:', error);
        }
    }

    loadFinancialBreakdown() {
        const formattedDate = this.selectedDate.toISOString().split('T')[0];
        this.http.get<{ netSalaries: number, totalDeductions: number, totalBonuses: number }>(
            `http://localhost:4004/api/finance/breakdown?month=${formattedDate}`,
            { headers: this.getHeaders() }
        ).subscribe({
            next: data => {
                this.financialBreakdownData = {
                    labels: ['Net Salaries', 'Deductions', 'Bonuses'],
                    datasets: [{
                        data: [data.netSalaries, data.totalDeductions, data.totalBonuses],
                        backgroundColor: ['#66BB6A', '#EF5350', '#FFA726'],
                        hoverBackgroundColor: ['#81C784', '#E57373', '#FFB74D']
                    }]
                };
            },
            error: err => console.error('Failed to load financial breakdown', err)
        });
    }

    loadAttendanceLeaveSummary() {
        const year = this.selectedDate.getFullYear();
        const month = this.selectedDate.getMonth() + 1;

        this.dashboardService.getMonthlyAttendanceLeaveSummary(year, month).subscribe({
            next: (data: AttendanceLeaveSummary[]) => {
                this.attendanceData = {
                    labels: data.map(d => d.month),
                    datasets: [
                        {
                            label: 'Present Days',
                            backgroundColor: '#42A5F5',
                            data: data.map(d => d.presentDays)
                        },
                        {
                            label: 'Leave Days',
                            backgroundColor: '#EF5350',
                            data: data.map(d => d.leaveDays)
                        }
                    ]
                };

                this.attendanceOptions = {
                    responsive: true,
                    plugins: {
                        legend: { labels: { color: '#495057' } }
                    },
                    scales: {
                        x: { ticks: { color: '#495057' }, grid: { color: '#ebedef' } },
                        y: { ticks: { color: '#495057' }, grid: { color: '#ebedef' } }
                    }
                };
            },
            error: err => console.error('Failed to load attendance summary', err)
        });
    }

    // Static Chart Data (replace with dynamic if available)
    employeePerformanceData = {
        labels: ['January', 'February', 'March', 'April', 'May'],
        datasets: [
            {
                label: 'Average Performance',
                data: [72, 75, 78, 80, 82],
                fill: false,
                borderColor: '#f59e0b',
                tension: 0.4
            },
            {
                label: 'Top Performers',
                data: [85, 88, 90, 92, 95],
                fill: false,
                borderColor: '#3b82f6',
                tension: 0.4
            },
            {
                label: 'Department Avg',
                data: [75, 77, 79, 81, 83],
                fill: false,
                borderColor: '#10b981',
                tension: 0.4
            },
            {
                label: 'Underperformers',
                data: [60, 62, 58, 55, 50],
                fill: false,
                borderColor: '#ef4444',
                tension: 0.4
            }
        ]
    };

    employeePerformanceOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: { mode: 'index', intersect: false }
        },
        scales: {
            y: {
                min: 40,
                max: 100,
                ticks: {
                    callback: (value: number) => value + '%'
                }
            }
        }
    };

    // Misc Charts (sales, donut, polar area)
    salesOverviewData = {
        labels: ['January', 'February', 'March', 'April', 'May', 'June'],
        datasets: [{
            label: 'Sales',
            data: [65, 59, 80, 81, 56, 55],
            borderColor: '#388e3c',
            backgroundColor: '#4caf50',
            fill: false,
            tension: 0.4
        }]
    };

    salesOverviewOptions = {
        responsive: true,
        plugins: {
            legend: { display: false },
            tooltip: { mode: 'index', intersect: false }
        }
    };

    donutChartData = {
        labels: ['Active', 'Inactive', 'Pending'],
        datasets: [{
            data: [300, 50, 100],
            backgroundColor: ['#42A5F5', '#66BB6A', '#FFA726'],
            hoverBackgroundColor: ['#64B5F6', '#81C784', '#FFB74D']
        }]
    };

    donutChartOptions = {
        responsive: true,
        plugins: { legend: { position: 'bottom' } }
    };

    polarAreaChartData = {
        labels: ['Sales', 'Marketing', 'Development', 'Customer Support', 'R&D'],
        datasets: [{
            data: [11, 16, 7, 3, 14],
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
            hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF']
        }]
    };

    polarAreaChartOptions = {
        responsive: true,
        plugins: { legend: { position: 'right' } }
    };
}

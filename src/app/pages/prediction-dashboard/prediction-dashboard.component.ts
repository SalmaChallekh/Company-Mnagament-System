import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../services/dashboard.service';
import { ChartModule } from 'primeng/chart';
import { CardModule } from 'primeng/card';

@Component({
    selector: 'app-prediction-dashboard',
    imports: [ChartModule,CardModule,
    ],
    templateUrl: './prediction-dashboard.component.html',
    styleUrl: './prediction-dashboard.component.scss'
})
export class PredictionDashboardComponent implements OnInit {
    average = 0;
    distLabels: string[] = [];
    distData: number[] = [];
    deptLabels: string[] = [];
    deptData: number[] = [];
    barChartData: any;         // declare bar chart data
    pieChartData: any;         // declare pie chart data
    barChartOptions: any;
    constructor(private predictionService: DashboardService) { }

    ngOnInit(): void {
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
}

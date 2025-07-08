import { Component } from '@angular/core';
import { DashboardService } from '../../services/dashboard.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-prediction',
    imports: [CommonModule,
            FormsModule ],
    templateUrl: './prediction.component.html',
    styleUrl: './prediction.component.scss'
})
export class PredictionComponent {
    form = {
        yearsAtCompany: 0,
        monthlySalary: 5000,
        overtimeHours: 0,
        promotions: 0,
        employeeSatisfactionScore: 2.0,
    };

    prediction: number | null = null;

    constructor(private predictionService: DashboardService) { }

    submit() {
        this.predictionService.predictPerformance(this.form).subscribe({
            next: (res) => (this.prediction = res.prediction),
            error: (err) => console.error(err),
        });
    }
}

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// PrimeNG Modules
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';

@Component({
    selector: 'app-attendance-calendar',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ToolbarModule,
        ButtonModule,
        CalendarModule
    ],
    template: `
    <div class="card">
      <p-toolbar>
        <ng-template pTemplate="left">
          <h4>Attendance Calendar</h4>
        </ng-template>
        <ng-template pTemplate="right">
          <p-button label="Export" icon="pi pi-download"></p-button>
        </ng-template>
      </p-toolbar>

      <p-calendar [(ngModel)]="date" [inline]="true"
                 [showWeek]="true" [showButtonBar]="true">
        <ng-template pTemplate="date" let-date>
          <span [ngClass]="{'present': isPresent(date),
                           'absent': isAbsent(date)}">
            {{date.day}}
          </span>
        </ng-template>
      </p-calendar>
    </div>
  `,
    styles: [`
    .present {
      color: var(--green-500);
      font-weight: bold;
    }
    .absent {
      color: var(--red-500);
      font-weight: bold;
    }
    .card {
      padding: 1rem;
      border-radius: 6px;
      background: var(--surface-card);
      box-shadow: var(--card-shadow);
    }
  `]
})
export class AttendanceCalendarComponent {
    date: Date = new Date();

    isPresent(date: Date): boolean {
        // Implement your logic to check if date is present
        // This is just sample logic - replace with your actual implementation
        return date.getDay() !== 0 && date.getDay() !== 6; // Not weekend
    }

    isAbsent(date: Date): boolean {
        // Implement your logic to check if date is absent
        // This is just sample logic - replace with your actual implementation
        return date.getDate() % 7 === 0; // Sample: every 7th day is absent
    }
}

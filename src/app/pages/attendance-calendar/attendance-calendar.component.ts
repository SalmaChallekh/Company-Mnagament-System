import { Component, OnInit } from '@angular/core';
import { AttendanceService } from '../../services/attendance.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { ToolbarModule } from 'primeng/toolbar';
import { DropdownModule } from 'primeng/dropdown';

export interface Attendance {
    employeeId: number;
    date: string;
    checkIn?: string;
    checkOut?: string;
    status: 'PRESENT' | 'LATE' | 'ABSENT';
}

@Component({
    selector: 'app-attendance-calendar',
    templateUrl: './attendance-calendar.component.html',
    styleUrls: ['./attendance-calendar.component.scss'],
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ToolbarModule,
        ButtonModule,
        CalendarModule,
        DropdownModule
    ]
})
export class AttendanceCalendarComponent implements OnInit {
    date: Date = new Date();
    attendanceMap = new Map<string, string>();
    daysInMonth: Date[] = [];
    allAttendance: Attendance[] = []; // all records from backend
    selectedEmployeeId!: number;
    employees: { id: number; name: string }[] = [];

    constructor(private attendanceService: AttendanceService) { }

    ngOnInit(): void {
        this.fetchEmployees();
        this.generateDaysInMonth();
    }

    fetchEmployees() {
        this.attendanceService.getAllEmployees().subscribe(data => {
            this.employees = data
            .filter(emp => emp.enabled)
            .map(emp => ({
                id: emp.id,
                name: emp.username
            }));
        });
    }
    onDateChange(selectedDate: Date) {
        this.date = selectedDate;
        this.generateDaysInMonth();
        this.filterAttendanceForMonth();
    }

    filterAttendanceForMonth() {
        this.attendanceMap.clear();
        const year = this.date.getFullYear();
        const month = this.date.getMonth() + 1; // JS months are 0-indexed

        const filtered = this.allAttendance.filter(record => {
            const [recordYear, recordMonth] = record.date.split('-').map(Number);
            return recordYear === year && recordMonth === month;
        });

        for (let record of filtered) {
            this.attendanceMap.set(record.date, record.status);
        }
    }


    onEmployeeChange() {
        const token = localStorage.getItem('token') || '';
        this.attendanceMap.clear();
        this.allAttendance = [];

        this.attendanceService.getUserAttendance(this.selectedEmployeeId, token).subscribe(data => {
            this.allAttendance = data;
            this.onDateChange(this.date); // Filter for current selected month
        });
    }

    // onEmployeeChange(): void {
    //     if (!this.selectedEmployeeId) return;

    //     const token = localStorage.getItem('token') || '';
    //     this.attendanceMap.clear();
    //     this.generateDaysInMonth();

    //     this.attendanceService
    //         .getUserAttendance(this.selectedEmployeeId, token)
    //         .subscribe(data => {
    //             for (let record of data) {
    //                 this.attendanceMap.set(record.date, record.status);
    //             }
    //         });
    // }

    generateDaysInMonth() {
        const year = this.date.getFullYear();
        const month = this.date.getMonth(); // 0-indexed
        const days = new Date(year, month + 1, 0).getDate();
        this.daysInMonth = [];

        for (let i = 1; i <= days; i++) {
            this.daysInMonth.push(new Date(year, month, i));
        }
    }

    fetchAttendanceForSelectedEmployee() {
        if (!this.selectedEmployeeId) return;

        const token = localStorage.getItem('token') || '';
        this.attendanceMap.clear();

        const year = this.date.getFullYear();
        const month = this.date.getMonth() + 1; // add 1 to match common month format

        this.attendanceService.getUserAttendanceByMonth(this.selectedEmployeeId, year, month, token).subscribe(data => {
            for (let record of data) {
                this.attendanceMap.set(record.date, record.status);
            }
        });
    }




    isPresent(date: Date): boolean {
        return this.attendanceMap.get(this.formatDate(date)) === 'PRESENT';
    }

    isAbsent(date: Date): boolean {
        return this.attendanceMap.get(this.formatDate(date)) === 'ABSENT';
    }

    formatDate(date: Date): string {
        return date.toISOString().split('T')[0];
    }
}

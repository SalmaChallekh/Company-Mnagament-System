import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Attendance } from '../pages/attendance-calendar/attendance-calendar.component';

@Injectable({ providedIn: 'root' })

export class AttendanceService {

    private apiUrl = 'http://localhost:4007/api/attendance';
    private apiUrl3 = 'http://localhost:4001/api/user?role=ROLE_EMPLOYEE';
    constructor(private http: HttpClient) { }

    getUserAttendance(employeeId: number, token: string): Observable<Attendance[]> {
        return this.http.get<Attendance[]>(`${this.apiUrl}/employee/${employeeId}`,
            { headers: this.getHeaders() });
    }
    getAllEmployees(): Observable<any[]> {
        return this.http.get<any[]>(this.apiUrl3,
            { headers: this.getHeaders() });
    }
    getUserAttendanceByMonth(employeeId: number, year: number, month: number, token: string): Observable<Attendance[]> {
        // Pass year and month as query params or URL params depending on your API design
        return this.http.get<Attendance[]>(`${this.apiUrl}/employee/${employeeId}?year=${year}&month=${month}`,
            { headers: this.getHeaders() });
    }
    getMonthlySummary(year: number, month: number): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/monthly?year=${year}&month=${month}`,{ headers: this.getHeaders() });
    }

    exportDailyCsv() {
        window.open(`${this.apiUrl}/export/daily/csv`, '_blank');
    }

    exportDailyExcel() {
        window.open(`${this.apiUrl}/export/daily/excel`, '_blank');
    }


    // Helper method for headers
    private getHeaders(): HttpHeaders {
        const token = localStorage.getItem('token');
        return new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        });
    }
}

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';



@Injectable({
    providedIn: 'root'
})

export class DashboardService {
    private apiUrl = 'http://localhost:4001/api/user';
    private apiUrl1 = 'http://localhost:4003/api';
    private apiUrl2 = 'http://localhost:4005/api';
    private baseUrl = 'http://localhost:4008/api/prediction'
    constructor(private http: HttpClient) { }

    getTotalUsers(): Observable<number> {
        return this.http.get<number>(`${this.apiUrl}/count`, {
            headers: this.getHeaders()
        })
    }
    getActiveProjects(): Observable<{ count: number; growth: number }> {
        return this.http.get<{ count: number; growth: number }>(`${this.apiUrl1}/projects/active-projects`, {
            headers: this.getHeaders()
        });
    }

    getCompletedTasks(): Observable<{ count: number; growth: number }> {
        return this.http.get<{ count: number; growth: number }>(`${this.apiUrl1}/tasks/completed-tasks`, {
            headers: this.getHeaders()
        });
    }
    getTotalClients(): Observable<number> {
        return this.http.get<{ total: number }>(`${this.apiUrl2}/client/count`, {
            headers: this.getHeaders()
        }).pipe(
            map(response => response.total)
        );
    }
    getUserGrowth(): Observable<number> {
        return this.http.get<{ growth: number }>(`${this.apiUrl}/growth`, {
            headers: this.getHeaders()
        }).pipe(
            map(response => response.growth)
        );
    }
    getClientsGrowth(): Observable<number> {
        return this.http.get<{ growth: number }>(`${this.apiUrl2}/client/growth`, {
            headers: this.getHeaders()
        }).pipe(
            map(response => response.growth)
        );
    }
    getMonthlyAttendanceLeaveSummary(year?: number, month?: number): Observable<any> {
        let url = `http://localhost:4007/api/attendance/monthly`;
        const params: any = {};

        if (year) params.year = year;
        if (month) params.month = month;

        // Construct query string if params exist
        const queryString = new URLSearchParams(params).toString();
        if (queryString) {
            url += `?${queryString}`;
        }

        return this.http.get(url, {
            headers: this.getHeaders()
        });
    }
    getEmployeePerformance() {
        return this.http.get<any>('http://localhost:4008/api/evaluations/dashboard', {
            headers: this.getHeaders()
        });
    }
    predictPerformance(data: any) {
        return this.http.post<{ prediction: number }>(this.baseUrl, data, { headers: this.getHeaders() });
    }
    getSummary() {
        return this.http.get<any>('http://localhost:4008/api/prediction/summary', { headers: this.getHeaders() });
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

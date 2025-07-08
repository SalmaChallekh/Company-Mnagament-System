import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Payroll {
    id: number;
    employeeId: number;
    date: Date;
    baseSalary: number;
    bonuses: number;
    deductions: number;
    totalSalary: number;
    status: 'PENDING' | 'PROCESSED' | 'FAILED';
}


@Injectable({
    providedIn: 'root'
})
export class PayrollService {
    private apiUrl = 'http://localhost:4004/api/payroll';

    constructor(private http: HttpClient) { }

    getPayrolls(): Observable<Payroll[]> {
        return this.http.get<Payroll[]>(this.apiUrl, { headers: this.getHeaders() });
    }

    createPayroll(payroll: Payroll): Observable<Payroll> {
        return this.http.post<Payroll>(`${this.apiUrl}/generate`, payroll, { headers: this.getHeaders() });
    }

    updatePayroll(id: number, payroll: Payroll): Observable<Payroll> {
        return this.http.put<Payroll>(`${this.apiUrl}/${payroll.id}`, payroll);
    }

    deletePayroll(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
    exportCsv(month: string): Observable<Blob> {
        return this.http.get(`${this.apiUrl}/export/csv`, {
            params: { month },
            responseType: 'blob', // IMPORTANT : récupérer un Blob (fichier binaire)
            headers: this.getHeaders()
        });
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


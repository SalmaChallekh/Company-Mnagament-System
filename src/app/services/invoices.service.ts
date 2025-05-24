import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class InvoicesService {
    private apiUrl = 'http://localhost:4005/api/finance/invoices';
    constructor(private http: HttpClient) { }

    // Create a new task in a project
    createInvoice(invoice: any): Observable<any> {
        return this.http.post(`${this.apiUrl}/create`, invoice, {
            headers: this.getHeaders()
        });
    }

    // Get all tasks across all projects
    getAllInvoices(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/getAll`, {
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

    // Get all tasks for a specific project
    // getTasksByProjectId(projectId: string): Observable<any[]> {
    //     return this.http.get<any[]>(`${this.apiUrl}/${projectId}/tasks`, {
    //         headers: this.getHeaders()
    //     });
    // }


    // Update an existing task
    // updateTask(taskId: string, task: any): Observable<any> {
    //     return this.http.put(`${this.apiUrl}/tasks/${taskId}`, task, {
    //         headers: this.getHeaders()
    //     });
    // }

    // Delete a task
    // deleteTask(taskId: string): Observable<any> {
    //     return this.http.delete(`${this.apiUrl}/tasks/${taskId}`, {
    //         headers: this.getHeaders()
    //     });
    // }

    // Get task by ID
    // getTaskById(taskId: string): Observable<any> {
    //     return this.http.get<any>(`${this.apiUrl}/tasks/${taskId}`, {
    //         headers: this.getHeaders()
    //     });
    // }



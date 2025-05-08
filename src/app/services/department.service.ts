import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Department, DepartmentRequest, DepartmentResponse } from '../pages/department-list/department-list.component';


@Injectable({ providedIn: 'root' })
export class DepartmentService {
    private apiUrl = 'http://localhost:4002/api/admin/departments';

    constructor(private http: HttpClient) { }

    private getHeaders(): HttpHeaders {
        const token = localStorage.getItem('token');
        return new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        });
    }

    getAllDepartments(): Observable<Department[]> {
        return this.http.get<Department[]>(`${this.apiUrl}/getAll`, { headers: this.getHeaders() });
    }

    getDepartmentById(id: number): Observable<Department> {
        return this.http.get<Department>(`${this.apiUrl}/getById/${id}`, { headers: this.getHeaders() });
    }

    createDepartment(request: DepartmentRequest): Observable<Department> {
        return this.http.post<Department>(`${this.apiUrl}/create`, request, { headers: this.getHeaders() });
    }

    updateDepartment(id: number, request: DepartmentRequest): Observable<Department> {
        return this.http.put<Department>(`${this.apiUrl}/update/${id}`, request, { headers: this.getHeaders() });
    }

    deleteDepartment(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/delete/${id}`, { headers: this.getHeaders() });
    }

    departmentExists(id: number): Observable<boolean> {
        return this.http.get<boolean>(`${this.apiUrl}/exists/${id}`, { headers: this.getHeaders() });
    }

    getPublicInfo(id: number): Observable<DepartmentResponse> {
        return this.http.get<DepartmentResponse>(`${this.apiUrl}/public/${id}`, { headers: this.getHeaders() });
    }
}

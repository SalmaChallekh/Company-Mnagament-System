import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import moment from 'moment';

@Injectable({
    providedIn: 'root'
})
export class ProjectService {
    private apiUrl = 'http://localhost:4003/api/projects';
    private apiUrl2 = 'http://localhost:4002/api/admin/departments';
    private apiUrl3 = 'http://localhost:4001/api/user?role=ROLE_MANAGER';
    private baseUrl='http://localhost:4003/api/'
    constructor(private http: HttpClient) { }

    private getAuthHeaders(): HttpHeaders {
        const token = localStorage.getItem('token');
        if (!token) {
            console.warn('No authentication token found');
        }
        return new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });
    }

    private handleError(error: HttpErrorResponse) {
        console.error('API Error:', error);
        let errorMessage = 'An unknown error occurred';

        if (error.error instanceof ErrorEvent) {
            // Client-side error
            errorMessage = `Error: ${error.error.message}`;
        } else {
            // Server-side error
            errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
            if (error.error && error.error.message) {
                errorMessage = error.error.message;
            }
        }
        return throwError(() => new Error(errorMessage));
    }

    getAllProjects(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/getAll`, {
            headers: this.getAuthHeaders()
        }).pipe(
            catchError(this.handleError)
        );
    }

    getAllDepartments(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl2}/getAll`, {
            headers: this.getAuthHeaders()
        }).pipe(
            catchError(this.handleError)
        );
    }

    getAllManagers(): Observable<any[]> {
        return this.http.get<any[]>(this.apiUrl3, {
            headers: this.getAuthHeaders()
        }).pipe(
            catchError(this.handleError)
        );
    }

    createProject(project: any): Observable<any> {
        const formattedProject = {
            ...project,
            startDate: moment(project.startDate).format('YYYY-MM-DD'),
            endDate: moment(project.endDate).format('YYYY-MM-DD')
        };
        return this.http.post(`${this.apiUrl}/create`, formattedProject, {
            headers: this.getAuthHeaders()
        }).pipe(
            catchError(this.handleError)
        );
    }

    getProjectById(id: string): Observable<any> {
        return this.http.get(`${this.apiUrl}/getById/${id}`);
    }


    addTaskToProject(projectId: string, task: any): Observable<any> {
        return this.http.post(`${this.apiUrl}/${projectId}/tasks`, task);
    }

    getTasksByProjectId(projectId: string): Observable<any[]> {
        return this.http.get<any[]>(`${this.baseUrl}/tasks/${projectId}`);
    }

    deleteProject(id: string): Observable<any> {
        return this.http.delete(`${this.apiUrl}/delete/${id}`,{
            headers: new HttpHeaders({
                Authorization: `Bearer ${localStorage.getItem('token')}`
            })
        });
    }


    updateProject(project: any): Observable<any> {
        const formattedProject = {
            ...project,
            startDate: moment(project.startDate).format('YYYY-MM-DD'),
            endDate: moment(project.endDate).format('YYYY-MM-DD')
        };

        return this.http.put(`${this.apiUrl}/${project.id}`, formattedProject, {
            headers: new HttpHeaders({
                Authorization: `Bearer ${localStorage.getItem('token')}`
            })
        });
    }
}



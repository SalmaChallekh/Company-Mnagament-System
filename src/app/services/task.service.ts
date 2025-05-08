import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class TaskService {
    private apiUrl = 'http://localhost:4003/api/projects';

    constructor(private http: HttpClient) { }

    addTaskToProject(projectId: string, task: any): Observable<any> {
        return this.http.post(`${this.apiUrl}/${projectId}/tasks`, task, {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            })
        });
    }

    getTasksByProjectId(projectId: string): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/${projectId}/tasks`, {
            headers: new HttpHeaders({
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            })
        });
    }
}

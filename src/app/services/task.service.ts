import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
export interface Task {
    id: string;
    name: string;
    description?: string;
    status: 'To Do' | 'In Progress' | 'Done';
    priority?: string;
    assignedTo?: string;
    projectId: string;
}
@Injectable({
    providedIn: 'root'
})
export class TaskService {
    private apiUrl = 'http://localhost:4003/api';

    constructor(private http: HttpClient) { }

    // Create a new task in a project
    createTask(task: any): Observable<any> {
        return this.http.post(`${this.apiUrl}/tasks/create`, task, {
            headers: this.getHeaders()
        });
    }



    // Get all tasks for a specific project
    getTasksByProjectId(projectId: string): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/${projectId}/tasks`, {
            headers: this.getHeaders()
        });
    }

    // Get all tasks across all projects
    getAllTasks(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/tasks/getAll`, {
            headers: this.getHeaders()
        });
    }

    // Update an existing task
    updateTask(taskId: string, task: any): Observable<any> {
        return this.http.put(`${this.apiUrl}/tasks/${taskId}`, task, {
            headers: this.getHeaders()
        });
    }

    // Delete a task
    deleteTask(taskId: string): Observable<any> {
        return this.http.delete(`${this.apiUrl}/tasks/delete/${taskId}`, {
            headers: this.getHeaders()
        });
    }

    // Get task by ID
    getTaskById(taskId: string): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/tasks/${taskId}`, {
            headers: this.getHeaders()
        });
    }
    getTasksByProject(projectId: string): Observable<Task[]> {
        return this.http.get<Task[]>(`${this.apiUrl}/by-project/${projectId}`);
    }

    updateTaskStatus(taskId: string, status: string): Observable<Task> {
        return this.http.put<Task>(`${this.apiUrl}/${taskId}/status`, { status });
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

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import moment from 'moment';
@Injectable({
    providedIn: 'root'
})
export class ProjectService {
    private apiUrl = 'http://localhost:4003/api/projects';

    constructor(private http: HttpClient) { }

    createProject(project: any): Observable<any> {
        const formattedProject = {
            ...project,
            startDate: moment(project.startDate).format('YYYY-MM-DD'),
            endDate: moment(project.endDate).format('YYYY-MM-DD')
        };
        return this.http.post(`${this.apiUrl}/create`, formattedProject, {
            headers: new HttpHeaders({
                Authorization: `Bearer ${localStorage.getItem('token')}`
            })
        });
    }

    getProjectById(id: string): Observable<any> {
        return this.http.get(`${this.apiUrl}/getById/${id}`);
    }

    // getAllProjects(): Observable<any[]> {
    //     return this.http.get<any[]>(`${this.apiUrl}/getAll`);
    // }
    getAllProjects(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/getAll`, {
            headers: new HttpHeaders({
                Authorization: `Bearer ${localStorage.getItem('token')}`
            })
        });
    }

    addTaskToProject(projectId: string, task: any): Observable<any> {
        return this.http.post(`${this.apiUrl}/${projectId}/tasks`, task);
    }

    getTasksByProjectId(projectId: string): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/${projectId}/tasks`);
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

    // updateProject(project: any): Observable<any> {
    //     return this.http.put(`${this.apiUrl}/${project.id}`, project, {
    //         headers: new HttpHeaders({
    //             Authorization: `Bearer ${localStorage.getItem('token')}`
    //         })
    //     });
    // }

    // updateProject(project: any): Observable<any> {
    //     return this.http.put(`${this.apiUrl}/${project.id}`, project,{
    //     });
    // }
}



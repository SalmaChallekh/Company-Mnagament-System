import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class CrmDashboardService {
    constructor(private http: HttpClient) { }

    getStats() {
        return forkJoin({
            clients: this.http.get<{ total: number }>('/api/client/count'),
            vendors: this.http.get<{ total: number }>('/api/vendor/count'),
            interactions: this.http.get<{ total: number }>('/api/interaction/count'),
            deals: this.http.get<{ total: number }>('/api/deals/closed/count'),
        });
    }

    getRecentInteractions(): Observable<any[]> {
        return this.http.get<any[]>('/api/interaction/recent');
    }

    getUpcomingMeetings(): Observable<any[]> {
        return this.http.get<any[]>('/api/meetings/upcoming');
    }

    getContacts(): Observable<any[]> {
        return this.http.get<any[]>('/api/contacts/all');
    }

    getPipelineData(): Observable<any> {
        return this.http.get<any>('/api/pipeline/stats');
    }
}

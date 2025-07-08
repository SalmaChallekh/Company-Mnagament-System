import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
export interface InteractionLog {
    type: string;
    message: string;
    date: string;
}

export interface Client {
    id: string;
    fullName: string;
    phone: number;
    email: string;
    companyName: string;
    address: string;
    industry: string;
    createdAt: string;
    interactionLogs?: InteractionLog[];
}
export interface Invoice {
    id: string;
    invoiceDate: string;
    dueDate: string;
    totalAmount: number;
    status: string;
    items: string;
    clientId: string;
}
export interface ClientDashboard {
    client: Client;
    totalInvoices: number;
    paidInvoices: number;
    unpaidInvoices: number;
    lastInteraction: InteractionLog;
}


@Injectable({ providedIn: 'root' })
export class ClientService {
    private baseUrl = 'http://localhost:4005/api/client';

    constructor(private http: HttpClient) { }

    getAllClients() {
        return this.http.get<any[]>(`${this.baseUrl}/getAll`,{
            headers: this.getHeaders()});
    }

    deleteClient(id: string) {
        return this.http.delete(`${this.baseUrl}/delete/${id}`,{
            headers: this.getHeaders()});
    }

    getClientById(id: string) {
        return this.http.get<any>(`${this.baseUrl}/${id}`,{headers: this.getHeaders()});
    }

    createClient(client: any) {
        return this.http.post(`${this.baseUrl}/create`, client,{headers: this.getHeaders()});
    }

    updateClient(id: string, client: any) {
        return this.http.put(`${this.baseUrl}/update/${id}`, client,{headers: this.getHeaders()});
    }


    addClient(client: any) {
        return this.http.post(this.baseUrl, client,{headers: this.getHeaders()});
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


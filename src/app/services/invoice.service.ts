import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class InvoiceService {

    private apiUrl = 'http://localhost:4005/api/finance/invoices';

    constructor(private http: HttpClient) { }

    getAllInvoices() {
        return this.http.get<any[]>(`${this.apiUrl}/getAll`, {
            headers: this.getHeaders()});
    }

    getInvoiceById(id: number) {
        return this.http.get(`${this.apiUrl}/${id}`, {
            headers: this.getHeaders()});
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

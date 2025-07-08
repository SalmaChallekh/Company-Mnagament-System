import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
export interface Vendor {
    id?: string;
    name: string;
    email: string;
    phone: number;
    address: string;
    category: string;
    issueLogs?: any[];
    ratings?: number[];
}
@Injectable({
    providedIn: 'root'
})
export class VendorService {

    private apiUrl = 'http://localhost:4005/api/vendor';

    constructor(private http: HttpClient) { }

    // getAllVendors() {
    //     return this.http.get<any[]>(`${this.apiUrl}/getAll`, { headers: this.getHeaders() });
    // }
    getAllVendors(): Observable<Vendor[]> {
        return this.http.get<Vendor[]>(`${this.apiUrl}/getAll`,{ headers: this.getHeaders() });
    }
    createVendor(vendor: Vendor): Observable<Vendor> {
        return this.http.post<Vendor>(`${this.apiUrl}/create`, vendor,{headers: this.getHeaders()});
    }
    updateVendor(id: string, vendor: Vendor): Observable<Vendor> {
        return this.http.put<Vendor>(`${this.apiUrl}/update/${id}`, vendor,{headers: this.getHeaders()});
    }

    deleteVendor(id: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/delete/${id}`,{headers: this.getHeaders()});
    }

    getVendorById(id: string): Observable<Vendor> {
        return this.http.get<Vendor>(`${this.apiUrl}/getById/${id}`,{headers: this.getHeaders()});
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

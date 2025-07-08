import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { WebcamImage, WebcamModule } from 'ngx-webcam';
import { Observable, Subject } from 'rxjs';
import { FileUploadModule } from 'primeng/fileupload';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ToastModule } from 'primeng/toast';
import { MessageModule } from 'primeng/message';
import { MessageService } from 'primeng/api';

@Component({
    selector: 'app-attendance-checkin',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        HttpClientModule,
        WebcamModule,
        FileUploadModule,
        ButtonModule,
        CardModule,
        ToastModule,
        MessageModule,
    ],
    templateUrl: './attendance-checkin.component.html',
    styleUrl: './attendance-checkin.component.scss',
    providers: [MessageService]
})
export class AttendanceCheckinComponent {
    selectedFile?: File;
    webcamImage: WebcamImage | null = null;
    private trigger: Subject<void> = new Subject<void>();
    responseMessage = '';

    constructor(private http: HttpClient, private messageService: MessageService) { }

    ngOnInit(): void {
        console.log('AttendanceCheckinComponent loaded');
    }

    get triggerObservable(): Observable<void> {
        return this.trigger.asObservable();
    }

    triggerSnapshot(): void {
        this.trigger.next();
    }

    handleImage(webcamImage: WebcamImage): void {
        this.webcamImage = webcamImage;
    }

    sendImage(): void {
        if (!this.webcamImage) return;

        const token = localStorage.getItem('token');
        const headers = new HttpHeaders({
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        });

        const payload = { image: this.webcamImage.imageAsBase64 };

        this.http
            .post('http://localhost:4007/api/attendance/camera-checkin', payload, {
                headers,
                responseType: 'text'
            })
            .subscribe({
                next: (res) => {
                    this.responseMessage = res;
                    this.messageService.add({ severity: 'success', summary: 'Check-In', detail: res });
                },
                error: (err) => {
                    const errorMsg = err?.error || err?.message || err?.statusText || 'Unknown error';
                    this.responseMessage = 'Error during check-in: ' + errorMsg;
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: this.responseMessage });
                }
            });
    }

    onFileSelected(event: any): void {
        this.selectedFile = event.target?.files?.[0] ?? event.files?.[0];
    }

    async upload(): Promise<void> {
        if (!this.selectedFile) {
            this.messageService.add({ severity: 'warn', summary: 'No file selected', detail: 'Please choose an image first.' });
            return;
        }

        try {
            const base64 = await this.convertFileToBase64(this.selectedFile);
            const cleanBase64 = base64.replace(/^data:image\/(png|jpeg|jpg);base64,/, '');

            const payload = { image: cleanBase64 };
            const token = localStorage.getItem('token');

            const headers = new HttpHeaders({
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            });

            this.http
                .post('http://localhost:4007/api/attendance/camera-checkin', payload, {
                    headers,
                    responseType: 'text'
                })
                .subscribe({
                    next: (res) => {
                        this.responseMessage = res;
                        this.messageService.add({ severity: 'success', summary: 'Check-In', detail: res });
                    },
                    error: (err) => {
                        const errorMsg = err?.error || err?.message || err?.statusText || 'Unknown error';
                        this.responseMessage = 'Error during check-in: ' + errorMsg;
                        this.messageService.add({ severity: 'error', summary: 'Error', detail: this.responseMessage });
                    }
                });
        } catch (error) {
            this.responseMessage = 'Failed to convert file: ' + error;
            this.messageService.add({ severity: 'error', summary: 'Conversion Error', detail: this.responseMessage });
        }
    }

    private convertFileToBase64(file: File): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                typeof reader.result === 'string' ? resolve(reader.result) : reject('Invalid file format');
            };
            reader.onerror = (error) => reject(error);
        });
    }
}

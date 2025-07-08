import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { WebcamImage, WebcamModule } from 'ngx-webcam';
import { Subject, Observable } from 'rxjs';

@Component({
    selector: 'app-webcam-check-in',
    standalone: true,
    imports: [CommonModule,
        WebcamModule
    ],
    templateUrl: './webcam-check-in.component.html',
    styleUrl: './webcam-check-in.component.scss'
})
export class WebcamCheckInComponent {
    trigger$ = new Subject<void>();
    webcamImage: WebcamImage | null = null;
    imagePreview: string | null = null;
    message = '';

    constructor(private http: HttpClient) { }

    triggerSnapshot(): void {
        this.trigger$.next();
    }

    handleImage(webcamImage: WebcamImage): void {
        this.webcamImage = webcamImage;
        this.imagePreview = webcamImage.imageAsDataUrl;
    }

    uploadImage(): void {
        if (!this.webcamImage) return;

        const blob = this.dataURItoBlob(this.webcamImage.imageAsDataUrl);
        const formData = new FormData();
        formData.append('image', blob, 'checkin.jpg');

        this.http.post('http://localhost:4007/api/attendance/check-in', formData, { responseType: 'text' })
            .subscribe({
                next: res => this.message = '✅ ' + res,
                error: err => this.message = '❌ ' + err.error
            });
    }

    dataURItoBlob(dataURI: string): Blob {
        const byteString = atob(dataURI.split(',')[1]);
        const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);

        for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }

        return new Blob([ab], { type: mimeString });
    }



    // webcamImage: WebcamImage | null = null;
    // trigger: Subject<void> = new Subject<void>();

    // constructor(private http: HttpClient) { }

    // get triggerObservable(): Observable<void> {
    //     return this.trigger.asObservable();
    // }

    // triggerSnapshot(): void {
    //     this.trigger.next();
    // }

    // handleImage(webcamImage: WebcamImage): void {
    //     this.webcamImage = webcamImage;
    //     this.sendToAiService(webcamImage.imageAsBase64);
    // }

    // sendToAiService(base64Image: string): void {
    //     this.http.post<any>('http://127.0.0.1:5000/verify', { image: base64Image })
    //         .subscribe(response => {
    //             if (response.present) {
    //                 this.markAttendance();
    //             } else {
    //                 alert('❌ Face not recognized.');
    //             }
    //         }, error => {
    //             console.error('AI error:', error);
    //         });
    // }

    // markAttendance(): void {
    //     const employeeId = 1; // Replace with actual logic
    //     this.http.post('http://localhost:8081/api/attendance/check-in', { employeeId })
    //         .subscribe(() => alert('✅ Attendance marked!'));
    // }
}

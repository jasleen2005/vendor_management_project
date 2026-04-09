// email.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EmailService {
  private apiUrl = 'http://localhost:8000/send-email/';  // Replace with your Django API URL

  constructor(private http: HttpClient) {}

  sendEmail(subject: string, message: string, recipientEmail: string): Observable<any> {
    const emailData = { subject, message, recipient_email: recipientEmail };

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.post(this.apiUrl, JSON.stringify(emailData), { headers });
  }
}

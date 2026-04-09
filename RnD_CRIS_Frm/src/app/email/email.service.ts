
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  private apiUrl = 'http://localhost:8000/api/send-email/'; // Change as per your backend URL

  constructor(private http: HttpClient) {}

  sendEmail(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }
}

// src/app/services/vendor.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';       //to broadcast message

interface VendorResponse {
  id: string;
  [key: string]: any;
}

interface Zone {
  code: string;
  name: string;
}

interface State {
  code: string;
  name: string;
}

interface Division {
  code: string;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class VendorService {
  private apiUrl = 'http://localhost:8000/api';

  // to broadcast message - start
  private broadcastSubject = new BehaviorSubject<string>(''); // Holds the current broadcast message
  broadcastMessage$ = this.broadcastSubject.asObservable(); // Observable to be subscribed by components
  // to broadcast message - end

  constructor(private http: HttpClient) {}


  // Start broadcasting a message
  startBroadcast(message: string) {
    this.broadcastSubject.next(message); // Emit the message to subscribers
  }

  // Stop broadcasting
  stopBroadcast() {
    this.broadcastSubject.next(''); // Clear the broadcast message
  }



  getZones(): Observable<Zone[]> {
    // return this.http.get<Zone[]>('/api/zone/');
   return this.http.get<Zone[]>(`${this.apiUrl}/zone/`);
  }


  getStates(): Observable<State[]> {
    return this.http.get<State[]>(`${this.apiUrl}/state/`);
  }

  getSubscriberCodes(): Observable<string[]> {
    return this.http.get<any[]>(`${this.apiUrl}/subscribers`).pipe(
      map(subscribers => subscribers.map(subscriber => subscriber.subscriber_id))
    );
  }

  getDivisions(zone: string): Observable<Division[]> {
    return this.http.get<Division[]>(`${this.apiUrl}/division/?zone=${zone}`);
  }

  submitVendorForm(formData: FormData): Observable<VendorResponse> {
    return this.http.post<VendorResponse>(`${this.apiUrl}/vendor/`, formData);
  }

  submitSubscriberForm(subFormData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/subscribers/`, subFormData);
  }

  // vendor.service.ts
createSubscriber(data: any) {
  return this.http.post<any>('http://localhost:8000/api/subscribers/', data);
}


}



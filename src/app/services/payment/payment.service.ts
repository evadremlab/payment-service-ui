import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable()
export class PaymentService {
  constructor(private http: HttpClient) {
  }

  getCaptureContext(bearerToken: string, hostUrl: string): Observable<object> {
    const data = { microformHostUrl: hostUrl };
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${bearerToken}` });
    const url = `${environment.paymentServiceRoot}${environment.getCaptureContext}`;
    return this.http.post(url, data, { headers });
  }

  addPaymentMethod(bearerToken: string, data: any): Observable<object> {
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${bearerToken}` });
    const url = `${environment.paymentServiceRoot}${environment.addPaymentMethod}`;
    return this.http.post(url, data, { headers });
  }

  getUserProfile(bearerToken: string): Observable<object> {
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${bearerToken}` });
    const url = `${environment.paymentServiceRoot}${environment.getUserProfile}`;
    return this.http.get(url, { headers });
  }
}

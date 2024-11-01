import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable()
export class PaymentService {
  constructor(private http: HttpClient) {
  }

  getCaptureContext(token: string, hostUrl: string): Observable<object> {
    const data = { microformHostUrl: hostUrl };
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    const url = `${environment.paymentServiceRoot}${environment.getCaptureContext}`;

    return this.http.post(url, data, { headers });
  }

  addPaymentMethod(token: string, transientToken: string): Observable<object> {
    const data = { nonce: transientToken };
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    const url = `${environment.paymentServiceRoot}${environment.addPaymentMethod}`;
    
    return this.http.post(url, data, { headers });
  }
}

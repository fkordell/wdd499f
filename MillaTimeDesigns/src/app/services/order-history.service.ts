import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OrderHistoryService {
  private apiUrl = 'http://localhost:5000/api/orders'; // Replace with your backend endpoint

  constructor(private http: HttpClient) {}

  getOrderHistory(email: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${email}`);
  }
}

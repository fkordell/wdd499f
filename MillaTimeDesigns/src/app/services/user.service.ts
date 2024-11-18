import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs'; 
import { catchError } from 'rxjs/operators';
import { UserContact } from '../models/user-contact.model';

@Injectable({
  providedIn: 'root',
})
export class UserContactService {
  private apiUrl = 'https://your-backend-api.com/contact';
  
  constructor(private http: HttpClient) {}

  checkUserExists(email: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/users/exists?email=${email}`)
      .pipe(
        catchError(() => of(false)) 
      );
  }
  sendPromoEmail(email: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/users/send-promo`, { email });
  }
  submitUserContactInfo(userContactInfo: UserContact): Observable<any> {
    return this.http.post<any>(this.apiUrl, userContactInfo);
  }
}

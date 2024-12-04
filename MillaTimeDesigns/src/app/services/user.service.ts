import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs'; 
import { catchError } from 'rxjs/operators';
import { UserContact } from '../models/user-contact.model';

@Injectable({
  providedIn: 'root',
})
export class UserContactService {
  private apiUrl = 'http://localhost:5000/api/users';
  private queriesApiUrl = 'http://localhost:5000/api/queries'
  
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

  getUserProfile(email: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/profile/${email}`).pipe(
      catchError((err) => {
        console.error('Error fetching user profile:', err);
        return of(null); 
      })
    );
  }
  updateUserProfile(profileData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/update`, profileData)
  }

  submitQuery(queryData: any): Observable<any> {
    return this.http.post(`${this.queriesApiUrl}/submit`, queryData).pipe(
      catchError((err) => {
        console.error('Error submitting query:', err);
        return of(null); 
      })
    );
  }
}


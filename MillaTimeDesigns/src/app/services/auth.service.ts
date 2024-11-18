import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '@auth0/auth0-angular';

@Injectable({
  providedIn: 'root',
})
export class AppAuthService {
  constructor(private auth: AuthService, private http: HttpClient) {}

  login(): void {
    this.auth.loginWithRedirect();
  }

  logout(): void {
    this.auth.logout({ logoutParams: { returnTo: window.location.origin } });
  }

  get isAuthenticated$() {
    return this.auth.isAuthenticated$;
  }

  get user$() {
    return this.auth.user$;
  }

  createUser(email: string, password: string, name?: string): void {
    this.http.post('http://localhost:5000/api/users/create', {
      email,
      password,
      name,
    }).subscribe({
      next: (response) => {
        console.log('User successfully created:', response);
      },
      error: (error) => {
        console.error('Error creating user:', error);
      },
    });
  }
}

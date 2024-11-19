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
  handlePostLogin(): void {
    this.user$.subscribe(user => {
      if (user && user.email) {
        const newUser = {
          email: user.email,
          name: user.name || user.nickname || '',
          authProvider: user.sub?.split('|')[0] || 'local', 
        };

        this.http.post('http://localhost:5000/api/users/create', newUser)
          .subscribe({
            next: (response) => {
              console.log('User successfully created or exists:', response);
            },
            error: (error) => {
              console.error('Error creating user:', error);
            },
          });
      }
    });
  }
}

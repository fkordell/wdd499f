import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '@auth0/auth0-angular';
import { loadStripe } from '@stripe/stripe-js';
import { Router } from '@angular/router';
import { CartService } from './cart.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root',
})
export class AppAuthService {
  constructor(private auth: AuthService, private http: HttpClient, private cartService: CartService, private snackBar: MatSnackBar, private router: Router) {}

  login(redirectAfterLogin?: string): void {
    this.auth.loginWithRedirect({
      appState: { target: redirectAfterLogin || '/landing' },
    });
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
    this.auth.appState$.subscribe((state) => {
      const target = state?.target || '/landing';
      console.log('Post-login target:', target);
      if (target === '/cart') {
        this.router.navigate(['/cart']).then(() => {
          this.snackBar.open('your are now logged in. You can proceed to checkout.', 'Close', {
            duration: 3000
          })
        })
      } else {
        this.router.navigate(['/landing']);
      }
    });

    this.user$.subscribe((user) => {
      if (user && user.email) {
        const newUser = {
          email: user.email,
          name: user.name || user.nickname || '',
          authProvider: user.sub?.split('|')[0] || 'local',
        };

        this.http.post('http://localhost:5000/api/users/create', newUser).subscribe({
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
  addPaymentMethod(paymentMethodId: string) {
    return this.user$.pipe(
      switchMap((user) => {
        if (user && user.email) {
          return this.http.post('http://localhost:5000/api/stripe/add-payment-method', {
            userEmail: user.email,
            paymentMethodId,
          });
        }
        throw new Error('User not authenticated');
      })
    );
  }

  fetchPaymentMethods() {
    return this.user$.pipe(
      switchMap((user) => {
        if (user && user.email) {
          return this.http.get(`http://localhost:5000/api/stripe/payment-methods/${user.email}`);
        }
        return of([]); 
      })
    );
  }
  removePaymentMethod(paymentMethodId: string) {
    return this.user$.pipe(
      switchMap((user) => {
        if (user && user.email) {
          return this.http.delete('http://localhost:5000/api/stripe/remove-payment-method', {
            body: {
              userEmail: user.email,
              paymentMethodId,
            },
          });
        }
        throw new Error('User not authenticated');
      })
    );
  }
}


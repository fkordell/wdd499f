import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { AppAuthService } from '../../../../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-billing-payment',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule],
  templateUrl: './billing-payment.component.html' 
})
export class BillingPaymentComponent implements OnInit {
  savedCards: Array<any> = [];
  isLoading = true;

  constructor(private authService: AppAuthService, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.fetchSavedCards();
  }

  fetchSavedCards(): void {
    this.isLoading = true;
    this.authService.fetchPaymentMethods().subscribe({
      next: (methods: any) => {
        if (methods.paymentMethods) {
          this.savedCards = methods.paymentMethods;
          console.log('Payment methods fetched:', this.savedCards);
        } else {
          this.snackBar.open('No payment methods found.', 'Close', { duration: 3000 });
        }
        this.isLoading = false;
      },
      error: (error: any) => {
        if (error.status === 404) {
          this.snackBar.open('User not found or no payment methods saved.', 'Close', { duration: 3000 });
        } else {
          this.snackBar.open('Failed to fetch payment methods. Please try again.', 'Close', { duration: 3000 });
        }
        console.error('Error fetching payment methods:', error);
        this.isLoading = false;
      },
    });
  }
  addPaymentMethod(): void {
    const paymentMethodId = prompt('Enter the Payment Method ID');
    if (paymentMethodId) {
      this.authService.addPaymentMethod(paymentMethodId).subscribe({
        next: () => {
          this.snackBar.open('Payment method added successfully!', 'Close', { duration: 3000 });
          this.fetchSavedCards(); 
        },
        error: (error) => {
          console.error('Error adding payment method:', error);
          this.snackBar.open('Failed to add payment method. Please try again.', 'Close', {
            duration: 3000,
          });
        },
      });
    }
  }
  removeCard(cardId: string): void {
    this.authService.removePaymentMethod(cardId).subscribe({
      next: () => {
        this.snackBar.open('Payment method removed successfully!', 'Close', { duration: 3000 });
        this.savedCards = this.savedCards.filter((card) => card.id !== cardId);
      },
      error: (error) => {
        console.error('Error removing payment method:', error);
        let errorMessage = 'Failed to remove payment method. Please try again.';
        if (error.status === 400) {
          errorMessage = 'Invalid payment method or it is not attached to the customer.';
        } else if (error.status === 404) {
          errorMessage = 'User or payment method not found.';
        }
        this.snackBar.open(errorMessage, 'Close', { duration: 3000 });
      },
    });
  }
  
}


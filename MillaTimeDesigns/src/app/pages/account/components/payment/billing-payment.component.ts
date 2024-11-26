import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-billing-payment',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule],
  templateUrl: './billing-payment.component.html' 
})
export class BillingPaymentComponent {
  savedCards = [
    { id: '1', brand: 'Visa', last4: '1234'},
    { id: '2', brand: 'MasterCard', last4: '5678'}
  ]

  addPaymentMethod() {

  }

  removeCard(cardId: string) {
    this.savedCards = this.savedCards.filter(card => card.id  !== cardId)
  }

}

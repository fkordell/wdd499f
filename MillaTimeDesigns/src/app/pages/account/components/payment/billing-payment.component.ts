import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-billing-payment',
  standalone: true,
  imports: [CommonModule],
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

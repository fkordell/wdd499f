import { Component } from '@angular/core';

@Component({
  selector: 'app-billing-payment',
  standalone: true,
  imports: [],
  templateUrl: './billing-payment.component.html' 
})
export class BillingPaymentComponent {
  savedCards = [
    { id: '1', brand: 'Visa', last4: '1234'},
    { id: '2', brand: 'MasterCard', last4: '5678'}
  ]

  addPayment() {

  }

  removeCard(cardId: string) {
    this.savedCards = this.savedCards.filter(card => card.id  !== cardId)
  }

}

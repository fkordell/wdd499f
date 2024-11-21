import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-order-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-history.component.html', 
})
export class OrderHistoryComponent {
  orders = [
    { id: '001', date: new Date(), total: 49.99 },
    { id: '002',  date: new Date(), total: 89.99 },
  ];

  viewOrder(orderId: string) {
    // Navigate to detailed order page or show a modal with order details
  }
}

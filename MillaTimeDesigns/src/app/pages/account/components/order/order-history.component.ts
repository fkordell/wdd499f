import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-order-history',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule],
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

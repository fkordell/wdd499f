import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AppAuthService } from '../../../../services/auth.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { OrderDetailsComponent } from './components/order-details.component';

@Component({
  selector: 'app-order-history',
  standalone: true,
  templateUrl: './order-history.component.html',
  imports: [MatIconModule, RouterModule, CommonModule, MatDialogModule],
})
export class OrderHistoryComponent implements OnInit {
  orders: any[] = [];
  loading = true;

  constructor(private http: HttpClient, private authService:AppAuthService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.fetchOrderHistory();
  }
  fetchOrderHistory(): void {
    this.authService.user$.subscribe((user) => {
      if (user && user.email) {
        const email = user.email;
        this.http.get<any>(`http://localhost:5000/api/orders/${email}`).subscribe({
          next: (response) => {
            this.orders = response.purchaseHistory || [];
            this.loading = false;
          },
          error: (error) => {
            console.error('Error fetching order history:', error);
            this.loading = false;
          },
        });
      } else {
        console.error('User not authenticated. Unable to fetch order history.');
        this.loading = false;
      }
    });
  }

  viewOrder(order: any): void {
    this.dialog.open(OrderDetailsComponent, {
      width: '500px',
      data: order,
    });
  }
}

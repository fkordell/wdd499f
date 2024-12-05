import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-order-details',
  standalone: true,
  imports: [MatDialogModule, CommonModule],
  template: `
    <h2 mat-dialog-title>Order Details</h2>
    <mat-dialog-content>
      <p><strong>Order ID:</strong> {{ data._id }}</p>
      <p><strong>Date:</strong> {{ data.date | date }}</p>
      <p><strong>Total:</strong> {{ data.total | currency }}</p>
      <p><strong>Items:</strong></p>
      <ul>
        <li *ngFor="let item of data.items" class="flex items-center gap-4 mb-4">
          <img [src]="item.image" alt="{{ item.name }}" class="w-16 h-16 object-cover rounded">
          <div>
            <p>{{ item.name }}</p>
            <p>Quantity: {{ item.quantity }}</p>
            <p>Price: {{ item.price | currency }}</p>
          </div>
        </li>
      </ul>
    </mat-dialog-content>
    <mat-dialog-actions>
      <button mat-button mat-dialog-close>Close</button>
    </mat-dialog-actions>
  `,
  styles: [
    `
      mat-dialog-content ul {
        padding: 0;
        list-style-type: none;
      }
    `,
  ],
})
export class OrderDetailsComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<OrderDetailsComponent>
  ) {}
}

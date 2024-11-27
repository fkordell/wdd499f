import { Component, OnInit } from '@angular/core';
import { Cart, CartItem } from '../../models/cart.model';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { CartService } from '../../services/cart.service';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { loadStripe } from '@stripe/stripe-js';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { OptCheckoutSigninComponent } from './components/opt-checkout-signin/opt-checkout-signin.component';
import { AppAuthService } from '../../services/auth.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [MatCardModule, MatTableModule, CommonModule, MatIconModule, RouterModule],
  templateUrl: './cart.component.html' 
})
export class CartComponent implements OnInit {
    cart: Cart = { items: [{
      product: 'https://via.placeholder.com/150',
      name:  'snickers',
      price: 150,
      quantity: 1,
      id: 1,
    }] };
    dataSource: Array<CartItem> = [];
    displayedColumns: Array<string> = [
      'product',
      'name',
      'price',
      'quantity',
      'total',
      'action',
    ];
 
    constructor(private cartService: CartService, private http: HttpClient, private authService: AppAuthService, private dialog: MatDialog) {}

    ngOnInit(): void {
      this.cartService.cart.subscribe((_cart: Cart) => {
        this.cart = _cart;
        this.dataSource = this.cart.items;
      })
    }
    getTotal(items: Array<CartItem>): number {
      return this.cartService.getTotal(items);
    }
    onClearCart(): void {
      this.cartService.clearCart();
    }
    onRemoveFromCart(item: CartItem): void {
      this.cartService.removeFromCart(item);
    }
    onAddQuantity(item: CartItem): void {
      this.cartService.addToCart(item);
    }
    onRemoveQuantity(item: CartItem): void {
      this.cartService.removeItemFromCart(item);
    }
    onCheckout(): void {
      this.authService.isAuthenticated$.subscribe((isAuthenticated) => {
        if (isAuthenticated) {
          this.proceedToStripe();
        } else {
          const dialogRef = this.dialog.open(OptCheckoutSigninComponent);
          dialogRef.afterClosed().subscribe((proceed) => {
            if (proceed) {
              this.proceedToStripe();
            }
          });
        }
      });
    }
    private proceedToStripe(): void {
      this.http.post('http://localhost:5000/api/stripe/create-checkout-session', {
        items: this.cart.items,
      }).subscribe({
        next: async (res: any) => {
          const stripe = await loadStripe('pk_test_51QNeEV09UI8uypIvvz0vr0k6FQ1r7qszfcSWWjh42QZALzNE40pT5HaU7qpYM4d3HhqYAIvMEbIDhhPgcOtYQiEX00spRc7Pvt');
          stripe?.redirectToCheckout({ sessionId: res.id });
        },
        error: (error) => {
          console.error('Checkout failed:', error);
        },
      });
    }
}

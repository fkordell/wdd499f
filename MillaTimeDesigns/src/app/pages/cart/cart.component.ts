import { Component, OnInit } from '@angular/core';
import { Cart, CartItem } from '../../models/cart.model';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { CartService } from '../../services/cart.service';
import { RouterModule } from '@angular/router';

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
 

    constructor(private cartService: CartService) {}

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
}

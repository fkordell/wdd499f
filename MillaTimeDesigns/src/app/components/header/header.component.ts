import { Component, Input, OnInit } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Cart, CartItem } from '../../models/cart.model';
import { CartService } from '../../services/cart.service';
import { AppAuthService } from '../../services/auth.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    MatToolbarModule, 
    MatIconModule, 
    MatBadgeModule,
    MatButtonModule,
    MatMenuModule,
    CommonModule,
    RouterModule,
   ],
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit{
  private _cart: Cart = { items: [] };
  itemsQuantity = 0;
  isAuthenticated$!: Observable<boolean>;

  @Input()
  get cart(): Cart {
    return this._cart;
  }

  set cart(cart: Cart) {
    this._cart = cart;

    this.itemsQuantity = cart.items
    .map((item) => item.quantity)
    .reduce((prev, current) => prev + current, 0)
  }

  constructor(private cartService: CartService, private authService: AppAuthService) {}

  ngOnInit(): void {
    this.isAuthenticated$ = this.authService.isAuthenticated$;
    this.isAuthenticated$.subscribe(isLoggedIn => {
      console.log('User is authenticated:', isLoggedIn);
    });
  }

  getTotal(items: Array<CartItem>): number {
    return this.cartService.getTotal(items);
  }

  onClearCart() {
    this.cartService.clearCart();
  }

  login(): void {
    this.authService.login();
  }

  onLogout() {
    this.authService.logout();
  }

}

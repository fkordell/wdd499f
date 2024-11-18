import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from "./components/header/header.component";
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { CartService } from './services/cart.service';
import { StoreService } from './services/store.service';
import { Cart } from './models/cart.model';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, MatSnackBarModule],
  template: `
  <app-header [cart]="cart"></app-header>
  <router-outlet></router-outlet>
  `,
  styles: [],
})
export class AppComponent implements OnInit {
  cart: Cart  = { items: [] };

  constructor(private cartService: CartService, private storeService: StoreService) {}

  ngOnInit(): void {
    this.cartService.cart.subscribe((_cart) => {
      this.cart = _cart;
    })
  }
}

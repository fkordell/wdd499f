import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from "./components/header/header.component";
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { CartService } from './services/cart.service';
import { StoreService } from './services/store.service';
import { Cart } from './models/cart.model';
import { AppAuthService } from './services/auth.service';
import { FooterComponent } from "./components/footer/footer.component";


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, MatSnackBarModule, FooterComponent],
  template: `
  <app-header [cart]="cart"></app-header>
  <router-outlet></router-outlet>
  <app-footer></app-footer>
  `,
  styles: [],
})
export class AppComponent implements OnInit {
  cart: Cart  = { items: [] };

  constructor(private cartService: CartService, private storeService: StoreService, private authService: AppAuthService) {}

  ngOnInit(): void {
    this.cartService.cart.subscribe((_cart) => {
      this.cart = _cart;
    });
    this.authService.handlePostLogin();
  }
}

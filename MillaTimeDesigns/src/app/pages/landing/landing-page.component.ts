import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StoreService } from '../../services/store.service';
import { CartService } from '../../services/cart.service';
import { Product } from '../../models/product.model';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '@auth0/auth0-angular'; 
import { UserContactService } from '../../services/user.service'; 
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';


@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    RouterModule,
    ReactiveFormsModule
  ],
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent implements OnInit, OnDestroy {
  featuredProducts: Array<Product> | undefined;
  gridCols: number = 4;
  private breakPointSubscription!: Subscription;
  productSubscription: Subscription | undefined;
  emailForm: FormGroup;

  constructor(
    private storeService: StoreService,
    private cartService: CartService,
    private fb: FormBuilder,
    private userService: UserContactService, 
    private authService: AuthService,
    private breakPointObserver: BreakpointObserver  
  ) {
    this.emailForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit(): void {
    this.breakPointSubscription = this.breakPointObserver
      .observe([Breakpoints.Medium, Breakpoints.Large])
      .pipe(
        map((result) => {
          console.log('Breakpoint result:', result.breakpoints);
          if (result.breakpoints[Breakpoints.Medium]) {
            console.log('Medium breakpoint');
            this.gridCols = 4;
          } else if (result.breakpoints[Breakpoints.Large]) {
            console.log('Large breakpoint');
            this.gridCols = 3;
          } else {
            console.log('Default breakpoint');
            this.gridCols = 4;
          }
          return this.gridCols;
        })
      )
      .subscribe((count) => {
        this.loadFeaturedProducts(count);
      });
  }

  loadFeaturedProducts(count: number): void {
    this.productSubscription = this.storeService.getAllProducts('20', 'desc').subscribe((products) => {
      this.featuredProducts = this.getRandomProducts(products, count);
    });
  }

  getRandomProducts(products: Array<Product>, count: number): Array<Product> {
    const shuffled = [...products].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  onAddToCart(product: Product): void {
    this.cartService.addToCart({
      product: product.image,
      name: product.title,
      price: product.price,
      quantity: 1,
      id: product.id
    });
  }

  onSubmit(): void {
    const email = this.emailForm.get('email')?.value;
    if (this.emailForm.valid) {
      this.userService.checkUserExists(email).subscribe(
        (userExists) => {
          if (userExists) {
            this.userService.sendPromoEmail(email).subscribe(() => {
              alert('A promo code has been sent to your email!');
              this.emailForm.reset();
            });
          } else {
            this.authService.loginWithRedirect();
          }
        },
        (error) => {
          console.error('Error checking user existence:', error);
        }
      );
    }
  }

  ngOnDestroy(): void {
    if (this.productSubscription) {
      this.productSubscription.unsubscribe();
    }
    if(this.breakPointSubscription) {
      this.breakPointSubscription.unsubscribe();
    }
  }
}

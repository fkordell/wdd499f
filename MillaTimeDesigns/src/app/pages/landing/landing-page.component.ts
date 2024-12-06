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
  testimonials = [
    {
      message: "I absolutely love the laser-cut designs! The precision and detail are unmatched. Highly recommend Millatime Designs.",
      name: "Emily R.",
      rating: 5
    },
    {
      message: "I purchased a custom engraved gift, and it was stunning. The craftsmanship is top-notch, and delivery was on time.",
      name: "Michael T.",
      rating: 4
    },
    {
      message: "Beautiful, high-quality products! Their customer service is also excellent. I had a great experience.",
      name: "Sophia L.",
      rating: 5
    },
    {
      message: "The sustainable materials used in their products make me feel good about my purchases. Amazing work!",
      name: "James K.",
      rating: 4
    },
    {
      message: "Millatime Designs exceeded my expectations! The product looks even better in person than on the website.",
      name: "Olivia W.",
      rating: 5
    },
    {
      message: "I requested a custom order for my business, and they delivered exactly what I needed. Incredible service!",
      name: "David B.",
      rating: 5
    },
    {
      message: "Their unique designs make for perfect gifts. I've already placed multiple orders and will be back for more.",
      name: "Isabella M.",
      rating: 4
    },
    {
      message: "The attention to detail is extraordinary! The laser engraving is clean and sharp. Highly recommended!",
      name: "Lucas H.",
      rating: 5
    },
    {
      message: "Fantastic quality and quick turnaround time. Millatime Designs is now my go-to for custom gifts.",
      name: "Charlotte D.",
      rating: 4
    },
    {
      message: "I've received so many compliments on the custom sign I ordered. Thank you for creating something so special!",
      name: "Ethan A.",
      rating: 5
    },
  ];

  displayedTestimonials: any[] = [];
  displayLimit: number = 3;
  
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
    this.loadMoreTestimonials();
    this.breakPointSubscription = this.breakPointObserver
      .observe([Breakpoints.Medium, Breakpoints.Large])
      .pipe(
        map((result) => {
          console.log('Breakpoint result:', result.breakpoints);
          if (result.breakpoints[Breakpoints.Medium]) {
            console.log('Medium breakpoint');
            this.displayedTestimonials = this.getRandomTestimonials(4);
            this.gridCols = 4;
          } else if (result.breakpoints[Breakpoints.Large]) {
            console.log('Large breakpoint');
            this.displayedTestimonials = this.getRandomTestimonials(3);
            this.gridCols = 3;
          } else {
            console.log('Default breakpoint');
            this.displayedTestimonials = this.getRandomTestimonials(3);
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

  loadMoreTestimonials(): void {
    const currentCount = this.displayedTestimonials.length;
    const nextTestimonials = this.testimonials.slice(currentCount, currentCount + this.displayLimit);
    this.displayedTestimonials = [...this.displayedTestimonials, ...nextTestimonials];
  }

  getRandomProducts(products: Array<Product>, count: number): Array<Product> {
    const shuffled = [...products].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  getRandomTestimonials(count: number): any[] {
    const shuffled = [...this.testimonials].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count)
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

import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { ProductsHeaderComponent } from "./components/products-header/products-header.component";
import { FiltersComponent } from './components/filters/filters.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { ProductBoxComponent} from './components/product-box/product-box.component'
import { CartService } from '../../services/cart.service';
import { Product } from '../../models/product.model';
import { Subscription } from 'rxjs';
import { StoreService } from '../../services/store.service';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

const ROWS_HEIGHT: { [id: number]: number } = {1: 400, 3: 335, 4: 350}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatSidenavModule, ProductsHeaderComponent, FiltersComponent, MatGridListModule, ProductBoxComponent, CommonModule, MatIconModule],
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit, OnDestroy{
  isFilterOpen = false;
  cols = 3;
  rowHeight = ROWS_HEIGHT[this.cols];
  category: string | undefined;
  priceRange: { min: number; max: number } | undefined;
  products: Array<Product> | undefined;
  filteredProducts: Array<Product> | undefined;
  sort = 'desc';
  count = '12';
  productSubscription: Subscription | undefined;

  constructor(private cartService: CartService, private storeService: StoreService) {}

  ngOnInit(): void {
    this.getProducts();
  }

  getProducts(): void {
    this.productSubscription = this.storeService.getAllProducts(this.count, this.sort, this.category)
    .subscribe((_products) => {
      this.products = _products;
      this.applyFilters();
    })
  }

  applyFilters(): void {
    this.filteredProducts = this.products?.filter((product) => {
      const inCategory = this.category ? product.category === this.category : true;
      const inPriceRange = this.priceRange
      ? product.price >= this.priceRange.min && product.price <= this.priceRange.max : true;
      return inCategory && inPriceRange;
    })
    console.log('Filtered products:', this.filteredProducts)
  }

  onColumnsCountChange(colsNum: number): void {
    this.cols = colsNum;
    this.rowHeight = ROWS_HEIGHT[this.cols];
  }

  toggleFilter() {
    this.isFilterOpen = !this.isFilterOpen;
  }

  onShowCategory(newCategory: string): void {
    this.category = newCategory;
    this.getProducts();
  }

  onShowPriceRange(priceRange: { min: number; max: number }): void {
    this.priceRange = priceRange;
    console.log('Applying price filter:', this.priceRange)
    this.applyFilters();
  }

  onAddToCart(product: Product): void{
    this.cartService.addToCart({
      product: product.image,
      name: product.title,
      price: product.price,
      quantity: 1,
      id: product.id
    })
  }

  onItemsCountChange(count: number): void {
    this.count = count.toString();
    this.getProducts();
  }

  onSortChange(newSort: string): void {
    this.sort = newSort;
    this.getProducts();
  }

  ngOnDestroy(): void {
    if(this.productSubscription) {
      this.productSubscription.unsubscribe();
    }
  }

}

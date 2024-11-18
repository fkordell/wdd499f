import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatListModule } from '@angular/material/list';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { StoreService } from '../../../../services/store.service';



@Component({
  selector: 'app-filters',
  standalone: true,
  imports: [MatExpansionModule, MatListModule, CommonModule],
  templateUrl: './filters.component.html',
})
export class FiltersComponent implements OnInit, OnDestroy {
  @Output() showCategory = new EventEmitter<string>();
  @Output() showPriceRange = new EventEmitter<{ min: number; max: number }>();
  categories: string[] | undefined;
  prices = [
    { label: 'Under $50', min: 0, max: 50 },
    { label: '$50 - $100', min: 50, max: 100 },
    { label: '$100 - $200', min: 100, max: 200 },
    { label: 'Above $200', min: 200, max: Infinity }
  ]
  categoriesSubscription: Subscription | undefined;

  constructor(private storeService: StoreService) {}

  ngOnInit(): void {
    this.categoriesSubscription = this.storeService
    .getAllCategories()
    .subscribe((response: Array<string>) => {
      this.categories = response;
    })
  }

  onShowCategory(category: string): void {
    this.showCategory.emit(category);
  }

  onShowPriceRange(priceRange: { min: number; max: number }): void {
    console.log('Selected price range:', priceRange)
    this.showPriceRange.emit(priceRange);
  }

  ngOnDestroy(): void {
    if (this.categoriesSubscription) {
      this.categoriesSubscription?.unsubscribe();
    }
  }

  



}

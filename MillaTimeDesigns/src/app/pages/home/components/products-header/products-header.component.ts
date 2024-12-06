import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIcon } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { StoreService } from '../../../../services/store.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-products-header',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    MatMenuModule,
    MatIcon,
    CommonModule
  ],
  templateUrl: './products-header.component.html'
})
export class ProductsHeaderComponent implements OnInit {
  @Output() columnsCountChange = new EventEmitter<number>();
  @Output() itemsCountChange = new EventEmitter<number>();
  @Output() sortChange = new EventEmitter<string>();
  @Output() categoryChange = new EventEmitter<string>();
  @Output() priceRangeChange = new EventEmitter<{ min: number; max: number }>();
  sort = 'desc';
  category = 'all categories';
  price = 'all prices';
  itemsShowCount = 12
  categories: string[] = [];
  prices = [
    { label: 'Under $50', min: 0, max: 50 },
    { label: '$50 - $100', min: 50, max: 100 },
    { label: '$100 - $200', min: 100, max: 200 },
    { label: 'Above $200', min: 200, max: Infinity },
  ];
  infinityValue = Infinity;

  private categoriesSubscription!: Subscription;

  constructor(private storeService: StoreService) {}

  ngOnInit(): void {
    this.categoriesSubscription = this.storeService
    .getAllCategories()
    .subscribe((response: string[]) => {
      this.categories = response;
    })
  }

  onSortUpdated(newSort: string): void {
    this.sort =  newSort;
    this.sortChange.emit(newSort);
  }

  onCategoryUpdated(newCategory: string): void {
    this.category = newCategory || 'all';
    this.categoryChange.emit(newCategory);
  }

  onPriceRangeUpdated(priceRange: { label: string; min: number; max: number }): void {
    this.price = priceRange.label || 'all'; 
    this.priceRangeChange.emit({ min: priceRange.min, max: priceRange.max }); 
  }

  onItemsUpdated(count: number): void {
    this.itemsShowCount = count;
    this.itemsCountChange.emit(count);
  }

  onColumnsUpdated(colsNum: number): void  {
    this.columnsCountChange.emit(colsNum);
  }
}

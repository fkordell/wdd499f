import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Product } from '../../../../models/product.model';
import { ModalComponent } from '../modal/modal.component';

@Component({
  selector: 'app-product-box',
  standalone: true,
  imports: [MatCardModule, CommonModule, MatIconModule, MatDialogModule, ModalComponent],
  templateUrl: './product-box.component.html',
})
export class ProductBoxComponent implements OnInit {
  @Input() fullWidthMode = false;
  @Input() product: Product | undefined;
  @Output() addToCart = new EventEmitter();

  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {}

  onAddToCart(): void {
    this.addToCart.emit(this.product);
  }

  openProductModal(): void {
    if (!this.product) return;

    console.log('Opening modal with product:', this.product)
    this.dialog.open(ModalComponent, {
      data: this.product, 
      width: '600px',
      disableClose: false 
    });
  }
}

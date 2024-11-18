import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Product } from '../../../../models/product.model';
import { CartService } from '../../../../services/cart.service';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [MatIconModule, CommonModule],
  templateUrl: './modal.component.html'
})
export class ModalComponent  {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Product,
    private dialogRef: MatDialogRef<ModalComponent>,
    private cartService: CartService
  ) {}

  addToCart(): void {
    this.cartService.addToCart({
      product: this.data.image,
      name: this.data.title,
      price: this.data.price,
      quantity: 1,
      id: this.data.id
    });
    this.dialogRef.close(); 
  }

  ngOnDestroy(): void {
    console.log('Modal destroyed');
  }
}

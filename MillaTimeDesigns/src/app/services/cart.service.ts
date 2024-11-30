import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Cart, CartItem } from '../models/cart.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient } from '@angular/common/http';



@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartKey = 'cart';
  cart = new BehaviorSubject<Cart>(this.loadCart());

  constructor(private _snackBar: MatSnackBar,  private http: HttpClient) { }

  private saveCart(): void {
    localStorage.setItem(this.cartKey, JSON.stringify(this.cart.value));
  }

  private loadCart(): Cart {
    const savedCart = localStorage.getItem(this.cartKey);
    return savedCart ? JSON.parse(savedCart) : { items: [] };
  }

  addToCart(item: CartItem): void {
    const items = [...this.cart.value.items];

    const itemInCart = items.find((_item) => _item.id === item.id);
    if (itemInCart) {
      itemInCart.quantity += 1;
    } else {
      items.push(item);
    }

    this.cart.next({ items });
    this.saveCart();
    this._snackBar.open('1 item added to cart.', 'Ok', { duration: 3000 });
  }

  removeItemFromCart(item: CartItem): void {
    let itemFormRemoval: CartItem | undefined;
    let filteredItems = this.cart.value.items.map((_item) => {
      if (_item.id === item.id) {
        _item.quantity--;

        if (_item.quantity === 0) {
          itemFormRemoval = _item;
        }
      }
      return _item;
    })

    if (itemFormRemoval)  {
      filteredItems = this.removeFromCart(itemFormRemoval, false)
    }

    this.cart.next({ items: filteredItems });
    this.saveCart();
    this._snackBar.open('1 item removed from cart', 'Ok', { duration: 3000 })
  }

  savePurchaseHistory(userId: string): void {
    const purchase = {
      userId,
      items: this.cart.value.items,
      total: this.getTotal(this.cart.value.items),
      date: new Date().toISOString(),
    };

    this.http.post('/api/purchase-history', purchase).subscribe({
      next: () => {
        this.clearCart();
        this._snackBar.open('Purchase completed and history saved!', 'Ok', { duration: 3000 });
      },
      error: () => {
        this._snackBar.open('Failed to save your purchase history.', 'Retry', { duration: 3000 });
      }
    })
  }

  getTotal(items: Array<CartItem>): number {
    return items.map((item) => item.price * item.quantity)
    .reduce((prev, current) => prev + current, 0)
  }

  clearCart(): void{
    this.cart.next({ items: [] });
    this.saveCart();
    this._snackBar.open('Cart is cleared', 'Ok', {duration: 3000});
  }

  removeFromCart(item: CartItem, update = true): Array<CartItem> {
    const filteredItems = this.cart.value.items.filter((_item) => 
    _item.id !== item.id
    );

  if (update) {
    this.cart.next({ items: filteredItems });
    this.saveCart();
    this._snackBar.open('1 item removed from cart,', 'Ok', { duration: 3000 })
  }

  return filteredItems;
  }


}

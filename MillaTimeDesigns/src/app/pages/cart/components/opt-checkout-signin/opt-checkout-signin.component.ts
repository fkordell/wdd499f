import { Component } from '@angular/core';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { AppAuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-opt-checkout-signin',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title>Login Required</h2>
    <mat-dialog-content>
      <p>If you want to save your order information, please log in or create an account.</p>
    </mat-dialog-content>
    <mat-dialog-actions>
      <button mat-button (click)="login()">Login</button>
      <button mat-button color="primary" (click)="proceed()">Proceed Anyway</button>
    </mat-dialog-actions>
  `,
})
export class OptCheckoutSigninComponent {
  constructor(
    private dialogRef: MatDialogRef<OptCheckoutSigninComponent>,
    private authService: AppAuthService
  ) {}

  login(): void {
    this.authService.login('/cart'); 
    this.dialogRef.close(false); 
  }

  proceed(): void {
    this.dialogRef.close(true); 
  }
}

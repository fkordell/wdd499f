import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AppAuthService } from '../services/auth.service';
import { Observable } from 'rxjs';
import { map, take, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AppAuthService, private router: Router) {}

  canActivate(): Observable<boolean> {
    return this.authService.isAuthenticated$.pipe(
      take(1), 
      map((isAuthenticated) => {
        if (!isAuthenticated) {
          this.router.navigate(['/home']);
          return false;
        }
        return true;
      })
    );
  }
}

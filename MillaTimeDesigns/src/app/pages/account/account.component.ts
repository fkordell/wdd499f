import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { RouterModule } from '@angular/router';
import { UserContactService } from '../../services/user.service'
import { AppAuthService } from '../../services/auth.service';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [MatIconModule, RouterModule, MatCardModule],
  templateUrl: 'account.component.html' 
})
export class AccountComponent implements OnInit {
  userProfile: any;

  constructor(
    private userService: UserContactService,
    private authService: AppAuthService
  ) {}

  ngOnInit(): void {
    this.authService.user$.subscribe((user) => {
      if (user?.email) {
        this.userService.getUserProfile(user.email).subscribe({
          next: (profile) => {
            this.userProfile = profile;
            console.log('User profile fetched:', profile);
          },
          error: (err) => {
            console.error('Error fetching user profile:', err);
          },
        });
      }
    });
  }
}

import { Component, OnInit } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule, FormGroup, FormBuilder } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { UserContactService } from '../../../../services/user.service';
import { AppAuthService } from '../../../../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatButtonModule, ReactiveFormsModule, RouterModule, MatIconModule, MatSelectModule, CommonModule],
  templateUrl: './profile.component.html'
})
export class ProfileComponent implements OnInit {
  profileForm!: FormGroup; 
  states = [
    { name: 'Alabama', code: 'AL' },
    { name: 'Alaska', code: 'AK' },
    { name: 'Arizona', code: 'AZ' },
    { name: 'Arkansas', code: 'AR' },
    { name: 'California', code: 'CA' },
    { name: 'Colorado', code: 'CO' },
    { name: 'Connecticut', code: 'CT' },
    { name: 'Delaware', code: 'DE' },
    { name: 'Florida', code: 'FL' },
    { name: 'Georgia', code: 'GA' },
    { name: 'Hawaii', code: 'HI' },
    { name: 'Idaho', code: 'ID' },
    { name: 'Illinois', code: 'IL' },
    { name: 'Indiana', code: 'IN' },
    { name: 'Iowa', code: 'IA' },
    { name: 'Kansas', code: 'KS' },
    { name: 'Kentucky', code: 'KY' },
    { name: 'Louisiana', code: 'LA' },
    { name: 'Maine', code: 'ME' },
    { name: 'Maryland', code: 'MD' },
    { name: 'Massachusetts', code: 'MA' },
    { name: 'Michigan', code: 'MI' },
    { name: 'Minnesota', code: 'MN' },
    { name: 'Mississippi', code: 'MS' },
    { name: 'Missouri', code: 'MO' },
    { name: 'Montana', code: 'MT' },
    { name: 'Nebraska', code: 'NE' },
    { name: 'Nevada', code: 'NV' },
    { name: 'New Hampshire', code: 'NH' },
    { name: 'New Jersey', code: 'NJ' },
    { name: 'New Mexico', code: 'NM' },
    { name: 'New York', code: 'NY' },
    { name: 'North Carolina', code: 'NC' },
    { name: 'North Dakota', code: 'ND' },
    { name: 'Ohio', code: 'OH' },
    { name: 'Oklahoma', code: 'OK' },
    { name: 'Oregon', code: 'OR' },
    { name: 'Pennsylvania', code: 'PA' },
    { name: 'Rhode Island', code: 'RI' },
    { name: 'South Carolina', code: 'SC' },
    { name: 'South Dakota', code: 'SD' },
    { name: 'Tennessee', code: 'TN' },
    { name: 'Texas', code: 'TX' },
    { name: 'Utah', code: 'UT' },
    { name: 'Vermont', code: 'VT' },
    { name: 'Virginia', code: 'VA' },
    { name: 'Washington', code: 'WA' },
    { name: 'West Virginia', code: 'WV' },
    { name: 'Wisconsin', code: 'WI' },
    { name: 'Wyoming', code: 'WY' },
  ];

  constructor(
    private fb: FormBuilder,
    private userSerivce: UserContactService,
    private authService: AppAuthService,
    private snackBar: MatSnackBar
    ) {}

  ngOnInit(): void {
    console.log(this.states)
    this.profileForm = this.fb.group({
      name: [''],
      email: [''],
      phone: [''],
      address: this.fb.group({
        line1: [''],
        city: [''],
        state: [''],
        country: [''],
      }),
    });
    this.authService.user$.subscribe((user) => {
      if (user?.email) {
        this.userSerivce.getUserProfile(user.email).subscribe({
          next: (profile: any) => {
            if (profile) {
              this.profileForm.patchValue({
                name: profile.name || '',
                email: profile.email || '',
                phone: profile.phone || '',
                address: {
                  line1: profile.address?.line1 || '',
                  city: profile.address?.city || '',
                  state: profile.address?.state || '',
                  country: profile.address?.country,
                },
              });
            }
          },
          error: (err) => {
            console.error('Error fetching user profile:', err);
            this.snackBar.open('Failed to fetch profile data.', 'Close', { duration: 3000 });
          },
        });
      }
    });
  }

  saveProfile(): void {
    if (this.profileForm.valid) {
      const updatedProfile = this.profileForm.value;
      this.userSerivce.updateUserProfile(updatedProfile).subscribe({
        next: () => {
          this.snackBar.open('Profile updated successfully!', 'Close', { duration: 3000 });
        },
        error: (err) => {
          console.error('Error updating profile', err);
          this.snackBar.open('Failed to updated profile.', 'Close', { duration: 3000 });
        }
      })
    }
  }
}


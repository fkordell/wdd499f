import { Component, OnInit } from '@angular/core';
import { UserContact } from '../../models/user-contact.model';
import { UserContactService } from '../../services/user.service';
import { CompanyContactService } from '../../services/company.service';
import { CompanyContact } from '../../models/company-contact.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { AppAuthService } from '../../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-contact-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatCardModule,
    MatListModule,
    MatDividerModule
  ],
  templateUrl: './contact-form.component.html',
})
export class ContactFormComponent implements OnInit {
  companyContact!: CompanyContact;
  contactForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private userContactService: UserContactService,
    private companyContactService: CompanyContactService,
    private authService: AppAuthService,
    private snackBar: MatSnackBar
  ) {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [
        '',
        [
          Validators.required,
          Validators.pattern(
            /^(\+?\d{1,4}[\s-])?(\(?\d{3}\)?[\s-]?)?[\d\s-]{7,10}$/ 
          ),
        ],
      ],
      subject: ['', [Validators.required]],
      message: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.companyContact = this.companyContactService.getCompanyContact();

    this.authService.user$.subscribe((user) => {
      if (user?.email) {
        this.userContactService.getUserProfile(user.email).subscribe({
          next: (profile: any) => {
            if (profile) {
              this.contactForm.patchValue({
                name: profile.name || '',
                email: profile.email || '',
                phone: profile.phone || '',
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

  get name() {
    return this.contactForm.get('name');
  }

  get email() {
    return this.contactForm.get('email');
  }

  get phone() {
    return this.contactForm.get('phone');
  }

  get subject() {
    return this.contactForm.get('subject');
  }

  get message() {
    return this.contactForm.get('message');
  }

  onSubmit(): void {
    if (this.contactForm.valid) {
      const queryData = this.contactForm.value;
      this.userContactService.submitQuery(queryData).subscribe({
        next: () => {
          this.snackBar.open('Query submitted successfully!', 'Close', { duration: 3000 });
          this.contactForm.reset();
        },
        error: (err) => {
          console.error('Error submitting query:', err);
          this.snackBar.open('Failed to submit query. Please try again later.', 'Close', { duration: 3000 });
        },
      });
    } else {
      this.snackBar.open('Please fill out all required fields.', 'Close', { duration: 3000 });
    }
  }
  
}

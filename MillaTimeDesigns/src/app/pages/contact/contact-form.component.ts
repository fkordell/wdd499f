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
    private companyContactService: CompanyContactService
  ) {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      subject: [''],
      message: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.companyContact = this.companyContactService.getCompanyContact();
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
      const userContactInfo: UserContact = this.contactForm.value;
      this.userContactService.submitUserContactInfo(userContactInfo).subscribe(
        (response) => {
          console.log('Form Submitted:', response);
          this.contactForm.reset();
          alert('Thank you for contacting us!');
        },
        (error) => {
          console.error('Submission error:', error);
          alert('There was an error submitting your message. Please try again later.');
        }
      );
    } else {
      alert('Please fill out all required fields.');
    }
  }
}

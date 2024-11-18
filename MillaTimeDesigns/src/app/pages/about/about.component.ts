import { Component, OnInit } from '@angular/core';
import { CompanyContactService } from '../../services/company.service';
import { CompanyContact } from '../../models/company-contact.model';
import { CommonModule } from '@angular/common';
import { ContactFormComponent } from '../contact/contact-form.component';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [
    CommonModule,
    ContactFormComponent,
    MatCardModule,
    MatListModule,
    MatDividerModule
  ],
  templateUrl: './about.component.html',
})
export class AboutComponent implements OnInit {
  companyContact!: CompanyContact;

  constructor(private companyContactService: CompanyContactService) {}

  ngOnInit(): void {
    this.companyContact = this.companyContactService.getCompanyContact();
  }
}

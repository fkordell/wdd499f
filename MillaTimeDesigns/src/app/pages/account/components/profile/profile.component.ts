import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [],
  templateUrl: './profile.component.html'
})
export class ProfileComponent {
  profileForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.profileForm  = this.fb.group({
      name: [''],
      email: [''],
      address: ['']
    });
  }

  saveProfile() {
    console.log(this.profileForm.value)
  }
}

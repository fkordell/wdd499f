import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [MatIconModule, RouterModule],
  templateUrl: 'account.component.html' 
})
export class AccountComponent {

}

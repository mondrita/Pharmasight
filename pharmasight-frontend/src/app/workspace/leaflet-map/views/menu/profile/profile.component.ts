import { Component } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  employee = {
    name: 'Tahsin',
    id: '1',
    designation: 'Software Engineer Intern',
    workstation: 'CH10',
    phoneNumber: '01515294388',
    profilePic: 'assets/images/cat.jpeg',
  };

  constructor(private router: Router) {}

  navigateBack() {
    this.router.navigate(['/workspace']);
  }
}

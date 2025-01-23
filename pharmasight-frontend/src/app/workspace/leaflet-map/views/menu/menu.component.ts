import { Component, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import {CommonModule} from "@angular/common";
import {ConfirmationModalComponent} from "./confirmation-modal/confirmation-modal.component";

@Component({
  selector: 'app-menu',
  standalone: true,
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
  imports: [CommonModule,ConfirmationModalComponent],
})
export class MenuComponent {
  isDropdownOpen = false;
  isModalVisible = false;

  constructor(private router: Router) {}

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  navigateToProfile() {
    this.isDropdownOpen = false;
    this.router.navigate(['/profile']);
  }

  navigateToPrivacyPolicy() {
    this.isDropdownOpen = false;
    this.router.navigate(['/privacy-policy']);
  }

  showSignOutModal() {
    console.log('Opening modal...');
    this.isDropdownOpen = false;
    this.isModalVisible = true;
    console.log('Modal visible:', this.isModalVisible);
  }

  hideModal() {
    this.isModalVisible = false;
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/auth/signin']);
  }
}

import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
// import { VendorService } from '../services/vendor.service';

import { HttpClient } from '@angular/common/http';

//added to restrict back/forward navigation

@Component({
  // selector: 'app-landing-page',
  selector: 'app-crisadmin',
  templateUrl: './crisadmin.component.html',
  styleUrls: ['./crisadmin.component.css']
})
export class CrisadminComponent {
  
  constructor( private router: Router, private location: Location, private http: HttpClient) {}
  message: string = '';
  isBroadcasting: boolean = false;
  currentUser: { username: string; role: string } | null = null;
  dropdownOpen: boolean = false;


  ngOnInit() {
  const token = localStorage.getItem('access_token'); // NEW

  this.http.get('http://localhost:8000/api/current_user/', {
    headers: token ? { Authorization: `Bearer ${token}` } : {}  // NEW
  }).subscribe({
    next: (data: any) => {
      console.log('Current user fetched:', data); // debug
      this.currentUser = data;
      localStorage.setItem('currentUser', JSON.stringify(data));
    },
    error: (err) => {
      console.error('Error fetching current user:', err);
      this.currentUser = null;
    }
  });
 } 

  toggleDropdown(event: Event): void {
    event.stopPropagation(); // prevents document listener from immediately closing it
    this.dropdownOpen = !this.dropdownOpen;
  }

   // Close dropdown when clicking outside
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;
    const clickedInsideLogo = target.closest('.icon-image');
    const clickedInsideDropdown = target.closest('.dropdown-menu');

    if (!clickedInsideLogo && !clickedInsideDropdown) {
      this.dropdownOpen = false;
    }
  }


  startBroadcast() {
  const inputMessage = prompt('Enter broadcast message:');
  if (inputMessage) {
    this.http.post('http://localhost:8000/api/active-message/', { message: inputMessage })
      .subscribe(() => {
        this.message = inputMessage;
        this.isBroadcasting = true;
      });
  }
}

stopBroadcast() {
  this.http.delete('http://localhost:8000/api/active-message/')
    .subscribe(() => {
      this.message = '';
      this.isBroadcasting = false;
    });
}

  // Logout function
  onLogout() {
    // Clear the login state (remove from localStorage)
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUser');
    
    this.router.navigate(['/login']).then(() => {
      // this.router.navigate(['/crisadmin']).then(() => {
      // Use the location service to replace the current history entry,
      // so the user cannot navigate back to the landing page.
      // this.location.replaceState('/crisadmin');
      this.location.replaceState('/login');
    });
  }

createUser() {
  // You can either:
  // 1. Navigate to a separate user creation form.
  this.router.navigate(['/create-user']);
  
  // 2. Or open a modal to enter user details.
  alert('Navigate to user creation form');
}



}

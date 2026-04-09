import { Component,HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
//added to restrict back/forward navigation

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent {
   broadcastMessage: string = '';
   currentUser: { username: string; role: string } | null = null;
   dropdownOpen: boolean = false;

  // constructor(private router: Router) {}
  constructor(private router: Router, private location: Location,private http: HttpClient) {}

  
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

  // Logout function
  onLogout() {
    // Clear the login state (remove from localStorage)
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUser');
    this.router.navigate(['/login']).then(() => {
      // Use the location service to replace the current history entry,
      // so the user cannot navigate back to the landing page.
      this.location.replaceState('/login');
    });

    // Redirect to the login page
    // this.router.navigate(['/login']);  comment for restrict back/forward navigation
}

ngOnInit(): void {
    // Get active broadcast message from Django
    this.http.get<{ message: string }>('http://localhost:8000/api/active-message/')
      .subscribe(data => {
        this.broadcastMessage = data.message;
      });

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
}

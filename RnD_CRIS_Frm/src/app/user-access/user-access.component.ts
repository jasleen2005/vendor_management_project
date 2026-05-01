// user-access.ts 
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

// Interface matching Django newuser model
export interface newuser {
  id: number;
  name: string;
  role: string;
  created_at: string;
  status: string;
  
}

@Component({
  selector: 'app-user-access',
  templateUrl: './user-access.component.html',
  styleUrls: ['./user-access.component.css']
})
export class UserAccessComponent implements OnInit {
  users: newuser[] = [];
  filteredUsers: newuser[] = [];
  filter: string = '';

  private BASE_URL = 'https://vendor-management-project-2-0c08.onrender.com';
  constructor(private router: Router, private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchUsers();
  }

  fetchUsers() {
     this.http
      .get<{ status: string; users: newuser[] }>(
        `${this.BASE_URL}/new-user-details/`
      )
    // this.http.get<{ status: string; users: newuser[] }>('http://localhost:8000/new-user-details/')
      .subscribe({
        next: (data) => {
          console.log('Users from API:', data);
          this.users = data.users;             // correct variable
          this.filteredUsers = [...this.users]; // copy for filtering
        },
        error: (err) => {
          console.error('Error fetching users:', err);
        }
      });
  }

  applyFilter() {
    const filterValue = this.filter.toLowerCase();
    this.filteredUsers = this.users.filter(u =>
      u.name.toLowerCase().includes(filterValue)
    );
  }

  sortUsers() {
    this.filteredUsers.sort((a, b) => a.name.localeCompare(b.name));
  }

  approveUser(user: any) {
  // this.http.post(`http://localhost:8000/api/users/${user.id}/approve/`, {}).subscribe(() => {
    this.http.post(
      `${this.BASE_URL}/api/users/${user.id}/approve/`,
      {}
    ).subscribe(() => {
    user.status = "Approved";
  });
}
  
  rejectUser(user: any) {
     this.http.post(
      `${this.BASE_URL}/api/users/${user.id}/reject/`,
      {}
    ).subscribe(() => {
  // this.http.post(`http://localhost:8000/api/users/${user.id}/reject/`, {}).subscribe(() => {
    user.status = "Rejected";
  });
}

}




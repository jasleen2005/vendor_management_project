import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.css']
})

@Injectable({
  providedIn: 'root'
})

export class CreateUserComponent {

  username: string = '';
  password: string = '';
  role: string = '';

  private apiUrl = 'http://localhost:8000/';

  constructor(private router: Router,private http: HttpClient) {}
    
  onCreateUser() {
    // Logic to create a new user
    // You can send the user details to your server or local storage
    // console.log(`Creating user: ${this.username}, Role: ${this.role}`);

    // // Optionally, navigate back to admin page or show success message
    // this.router.navigate(['/crisadmin']);
    const userData = {
      name: this.username, 
      role: this.role,
      password: this.password 
    };

    this.http.post(this.apiUrl + 'create-user/', userData).subscribe({            
      next: (res: any) => {
        console.log('User created successfully:', res); 
        alert('User created successfully!');
        this.loadUsers(); // reload list after creating
        this.username = '';
        this.role = '';
      },
      error: (err) => {
        console.error('Error creating user:', err);
        alert('Error creating user');
      }
    });
  }


users: any[] = [];

loadUsers() {
this.http.get(this.apiUrl + 'new-user-details/').subscribe({
      next: (res: any) => {
        // if Django returns a plain list:
        this.users = res;
        // if Django returns {users: [...]}, then use:
        // this.users = res.users;
      },
      error: (err) => {
        console.error('Error loading users:', err);
      }
    });
  }
}


// login.component.ts     
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  username: string = '';
  password: string = '';
  errorMessage: string = '';
  broadcastMessage: string = '';

  constructor(private router: Router, private http: HttpClient) {}

  ngOnInit(): void {
    // Get active broadcast message from Django
    this.http.get<{ message: string }>('http://localhost:8000/api/active-message/')
      .subscribe(data => {
        this.broadcastMessage = data.message;
      });

    const role = localStorage.getItem('role');
    const isLoggedIn = localStorage.getItem('isLoggedIn');

    if (isLoggedIn) {
      if (role === 'railway') {
        this.router.navigate(['/landing']);
      } else if (role === 'admin') {
        this.router.navigate(['/crisadmin']);
      }
    }
  }

  onLogin() {
    if (this.username === 'div_test' && this.password === 'div_test') {
      localStorage.setItem('isLoggedIn', 'true');                                   
      localStorage.setItem('userName', 'div_test');                          
      localStorage.setItem('role', 'railway');
      this.router.navigate(['/landing']);
    } else if (this.username === 'cris' && this.password === 'cris') {
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userName', 'cris');
      localStorage.setItem('role', 'admin');
      this.router.navigate(['/crisadmin']);
    } else {
      this.errorMessage = 'Invalid username or password';
    }
  }

  // below code is to login from admin created users

//     const loginData = { username: this.username, password: this.password };
//     this.http.post<any>('http://localhost:8000/api/login/', loginData)
//       .subscribe({
//         next: (res) => {
//           if (res.status === 'success') {
//             localStorage.setItem('isLoggedIn', 'true');
//             // current user 
           
//             localStorage.setItem('access_token', res.token); // NEW
            

//             localStorage.setItem("currentUser", JSON.stringify(res.user));
//             localStorage.setItem('userName', res.username);
//             localStorage.setItem('role', res.role);           
             
//             // Navigate based on role
//             if (res.role === 'admin') {
//               this.router.navigate(['/crisadmin']);
//             } else {
//               this.router.navigate(['/landing']);
//             }
//           }
//         },
//         error: (err) => {
//           this.errorMessage = err.error.message || 'Invalid username or password';
//         }
//       });
//   }  

 }

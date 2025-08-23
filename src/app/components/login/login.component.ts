import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BASE_API_URL } from '../../app.config';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  message: string = '';
  isLoggedIn: boolean = false;

  private http = inject(HttpClient);
  private baseUrl = inject(BASE_API_URL);
  private router = inject(Router);

  constructor() {
    // Check if user is already logged in (JWT exists)
    this.checkLoginStatus();
  }
  login() {
    console.log('Login');
    this.http
      .post(`${this.baseUrl}/api/login`, {
        username: this.username,
        password: this.password,
      })
      .subscribe({
        next: () => {
          this.message = 'Login successful';
          this.isLoggedIn = true;
          // ✅ Save username for dashboard
          localStorage.setItem('username', this.username);
          this.router.navigateByUrl('/dashboard');
        },
        error: () => (this.message = 'Login failed'),
      });
  }
  logout() {
    this.http.post(`${this.baseUrl}/api/logout`, {}).subscribe({
      next: () => {
        this.message = 'Logged out';
        this.isLoggedIn = false;
        this.username = '';
        this.password = '';

        // ✅ Clear username from storage
        localStorage.removeItem('username');
        this.router.navigate(['/login']);
      },
      error: () => (this.message = 'Logout failed'),
    });
  }
  private checkLoginStatus() {
    // Simulate checking if JWT cookie exists (handled by interceptor)
    this.http.get(`${this.baseUrl}/api/refresh`).subscribe({
      next: () => (this.isLoggedIn = true),
      error: () => (this.isLoggedIn = false),
    });
  }
}

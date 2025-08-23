import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  private router = inject(Router);

  username: string | null = null;

  constructor() {}

  ngOnInit(): void {
    this.username = localStorage.getItem('username'); // ✅ Get saved username
    if (!this.username) {
      this.router.navigateByUrl('/login'); // redirect if not logged in
    }
  }
  logout() {
    localStorage.removeItem('username');
    this.router.navigateByUrl('/login');
  }
}

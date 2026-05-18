import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router, RouterModule } from '@angular/router'; 
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule], 
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile implements OnInit {
  user: any = null;
  bookings: any[] = [];
  orders: any[] = [];

  constructor(
    private router: Router,
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    this.loadUserData();
    if (this.user?._id) {
      this.fetchUserActivities();
    }
  }

  loadUserData() {
    if (isPlatformBrowser(this.platformId)) {
      const data = localStorage.getItem('user');
      if (data) {
        this.user = JSON.parse(data);
      }
    }
  }

  fetchUserActivities() {
    const userId = this.user._id;

    this.http.get(`http://localhost:5000/api/bookings/user/${userId}`).subscribe({
      next: (res: any) => this.bookings = res || [],
      error: (err) => console.error(err)
    });

    this.http.get(`http://localhost:5000/api/orders/user/${userId}`).subscribe({
      next: (res: any) => this.orders = res || [],
      error: (err) => console.error(err)
    });
  }

  logout() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.clear();
      this.router.navigate(['/login']);
    }
  }

  goBack() {
    this.router.navigate(['/selection']);
  }
}
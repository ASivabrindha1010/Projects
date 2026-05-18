import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css'
})
export class AdminDashboard implements OnInit {
  recentBookings: any[] = [];
  stats: any = {
    totalProducts: 0,
    totalBookings: 0,
    totalUsers: 0
  };

  constructor(
    private router: Router, 
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      
      if (userData.role !== 'admin') {
        alert("Unauthorized Access! Please Login as Admin.");
        this.router.navigate(['/admin-login']);
        return;
      }

      this.fetchStats();
      this.fetchBookings();
    }
  }

  fetchStats() {
    this.http.get('http://localhost:5000/api/admin/stats').subscribe({
      next: (data: any) => {
        this.stats = data;
      },
      error: (err) => console.error(err)
    });
  }

  fetchBookings() {
    this.http.get<any[]>('http://localhost:5000/api/admin/all-bookings').subscribe({
      next: (data) => {
        this.recentBookings = data.map(booking => {
          return {
            ...booking,
            userName: booking.userid?.username || 'Unknown',
            serviceName: booking.serviceName,
            createdAt: booking.createdAt,
            paymentStatus: booking.paymentStatus
          };
        });
      },
      error: (err) => console.error(err)
    });
  }

  logout() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('user');
      localStorage.removeItem('admin');
      this.router.navigate(['/admin-login']);
    }
  }
}
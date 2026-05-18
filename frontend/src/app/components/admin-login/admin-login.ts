import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './admin-login.html',
  styleUrl: './admin-login.css',
})
export class AdminLogin {
  adminEmail = '';
  adminPassword = '';
  showPassword = false;

  constructor(private router: Router) {}
 
  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  onLogin() {
    if (this.adminEmail === 'admin@gmail.com' && this.adminPassword === 'admin123') {
      const adminData = {
        email: this.adminEmail,
        role: 'admin',
        isLoggedIn: true
      };

      localStorage.setItem('user', JSON.stringify(adminData));
      localStorage.setItem('admin', 'true');

      alert('Welcome Back, Admin!');
      this.router.navigate(['/admin-dashboard']);
    } else {
      alert('Invalid Admin Credentials. Please try again.');
    }
  }
}
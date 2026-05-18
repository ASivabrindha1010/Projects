import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule, HttpClientModule, CommonModule, RouterModule],
  templateUrl: './signup.html'
})
export class SignupComponent {
  showPassword = false;

  signupForm = new FormGroup({
    username: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]), 
    password: new FormControl('', [Validators.required, Validators.minLength(6)])
  });

  constructor(private http: HttpClient, private router: Router) {}

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  onSignup() {
    if (this.signupForm.valid) {
      this.http.post('http://localhost:5000/api/auth/signup', this.signupForm.value)
        .subscribe({
          next: (res: any) => {
            alert("Signup Success! Please Login.");
            this.router.navigate(['/login']);
          },
          error: (err) => {
            alert("Signup Failed: " + err.error.message);
          }
        });
    }
  }

  goToSelection() {
    this.router.navigate(['/selection']);
  }
}
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common'; 
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule, CommonModule, HttpClientModule], 
  templateUrl: './login.html', 
  styleUrl: './login.css'
})
export class LoginComponent {
  showPassword = false;

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]), 
    password: new FormControl('', [Validators.required, Validators.minLength(6)]) 
  });

  constructor(private router: Router, private http: HttpClient) {}

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  goToSignup() {
    this.router.navigate(['/signup']);
  }

  onLogin() {
    if (this.loginForm.valid) {
      this.http.post('http://localhost:5000/api/auth/login', this.loginForm.value)
        .subscribe({
          next: (res: any) => {
            localStorage.setItem('user', JSON.stringify(res.user));
            this.router.navigate(['/selection']);
          },
          error: (err) => {
            console.error(err);
            alert("Invalid Email or Password. Please try again.");
          }
        });
    } else {
      alert("Please check your details!\n- Email must be valid.\n- Password must be at least 6 characters.");
    }
  }
}
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, MatButton],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  isRegisterMode: boolean = false;
  loading: boolean = false;
  error: string | null = '';
  regSuccess: string | null = '';

  constructor(private api: ApiService, private router: Router) {}

  setMode(isRegister: boolean) {
    this.isRegisterMode = isRegister;
    this.error = null;
  }

  onSubmit() {
    if (!this.username || !this.password) {
      this.error = 'Please enter both username and password';
      return;
    }

    this.loading = true;
    this.error = '';

    if (this.isRegisterMode) {
      this.register();
    } else {
      this.login();
    }
  }

  login() {
    this.api.login({ username: this.username, password: this.password }).subscribe({
      next: (response: any) => {
        console.log('Login successful:', response.userRole);

        if (response.userRole === 2 || response.userRole === 3) {
          this.router.navigate(['/dashboard']);
        } else {
          this.router.navigate(['/main']);
        }
      },
      error: (error) => {
        console.error('Login failed:', error);
        this.error = error.error?.message || 'Login failed. Please try again.';
        this.loading = false;
      }
    });
  }

  register() {
    this.api.register({ username: this.username, password: this.password }).subscribe({
      next: () => {
        this.loading = false;
        this.isRegisterMode = false;
        this.error = '';
        this.regSuccess = 'Registration successful. Please login.';
      },
      error: (error) => {
        console.error('Registration failed:', error);
        this.error = error.error?.message || 'Registration failed. Please try again.';
        this.loading = false;
      }
    });
  }

  // onSubmit() {
  //   if (!this.username || !this.password) {
  //     this.error = 'Please enter both username and password';
  //     return;
  //   }

  //   this.loading = true;
  //   this.error = '';

  //   this.api.login({ username: this.username, password: this.password }).subscribe({
  //     next: (response: any) => {
  //       console.log('Login successful:', response.userRole);
  //       if (response.userRole === 2 || response.userRole === 3) {
  //         this.router.navigate(['/dashboard']);
  //       } else {
  //         // Navigate to home
  //         this.router.navigate(['/main']);
  //       }
  //     },
  //     error: (error) => {
  //       console.error('Login failed:', error);
  //       this.error = error.error?.message || 'Login failed. Please try again.';
  //       this.loading = false;
  //     }
  //   });
  // }
}

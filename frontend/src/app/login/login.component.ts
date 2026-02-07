import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  loading: boolean = false;
  error: string = '';

  constructor(private api: ApiService, private router: Router) {}

  onSubmit() {
    if (!this.username || !this.password) {
      this.error = 'Please enter both username and password';
      return;
    }

    this.loading = true;
    this.error = '';

    this.api.login({ username: this.username, password: this.password }).subscribe({
      next: (response: any) => {
        console.log('Login successful:', response);
        // Store token if provided
        if (response.token) {
          localStorage.setItem('authToken', response.token);
        }
        // Navigate to home
        this.router.navigate(['/home']);
      },
      error: (error) => {
        console.error('Login failed:', error);
        this.error = error.error?.message || 'Login failed. Please try again.';
        this.loading = false;
      }
    });
  }
}

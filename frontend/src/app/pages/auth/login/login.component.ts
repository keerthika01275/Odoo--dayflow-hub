import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { LoginResponse } from '../../../models/models';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;
  loading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) return;

    this.loading = true;
    this.errorMessage = '';

    this.authService.login(this.loginForm.value).subscribe({
      next: (res: LoginResponse) => {
        this.loading = false;
        const targetRoute = this.authService.getDashboardRoute();
        this.router.navigate([targetRoute]);
      },
      error: (err: any) => {
        this.loading = false;
        if (err.error && err.error.message) {
          this.errorMessage = err.error.message;
        } else {
          this.errorMessage = 'Invalid email or password. Please try again.';
        }
      }
    });
  }

  // Quick demo login fill
  fillDemoCredentials(role: 'ADMIN' | 'HR' | 'EMPLOYEE'): void {
    if (role === 'ADMIN') {
      this.loginForm.patchValue({ email: 'admin@dayflow.com', password: 'Admin@123' });
    } else if (role === 'HR') {
      this.loginForm.patchValue({ email: 'priya@dayflow.com', password: 'Priya@123' });
    } else if (role === 'EMPLOYEE') {
      this.loginForm.patchValue({ email: 'rahul@dayflow.com', password: 'Rahul@123' });
    }
  }
}

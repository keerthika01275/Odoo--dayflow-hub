import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { LoginRequest, LoginResponse, RegisterRequest } from '../models/models';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly API = 'http://localhost:8080/api/auth';
  private currentUserSubject = new BehaviorSubject<LoginResponse | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    const stored = localStorage.getItem('dayflow_user');
    if (stored) {
      this.currentUserSubject.next(JSON.parse(stored));
    }
  }

  login(request: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.API}/login`, request).pipe(
      tap(response => this.storeUser(response))
    );
  }

  register(request: RegisterRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.API}/register`, request).pipe(
      tap(response => this.storeUser(response))
    );
  }

  getMe(): Observable<LoginResponse> {
    return this.http.get<LoginResponse>(`${this.API}/me`);
  }

  logout(): void {
    localStorage.removeItem('dayflow_user');
    localStorage.removeItem('dayflow_token');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem('dayflow_token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getRole(): string | null {
    const user = this.currentUserSubject.value;
    return user ? user.role : null;
  }

  getCurrentUser(): LoginResponse | null {
    return this.currentUserSubject.value;
  }

  getDashboardRoute(): string {
    const role = this.getRole();
    switch (role) {
      case 'ADMIN': return '/admin/dashboard';
      case 'HR': return '/hr/dashboard';
      case 'EMPLOYEE': return '/employee/dashboard';
      default: return '/login';
    }
  }

  private storeUser(response: LoginResponse): void {
    localStorage.setItem('dayflow_user', JSON.stringify(response));
    localStorage.setItem('dayflow_token', response.token);
    this.currentUserSubject.next(response);
  }
}

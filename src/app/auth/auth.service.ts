import { Injectable, Signal, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { API_BASE_URL } from '../core/api/config';
import { User } from '../models/user.model';
import { UserService } from '../shared/services/user.service';

interface AuthResponse {
  access_token: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = API_BASE_URL;
  private tokenKey = 'auth_token';
  private userRole = signal<string | null>(null);
  
  constructor(private http: HttpClient, private router: Router, private userService: UserService) {}

  login(email: string, password: string) {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/login`, { email, password }).pipe(
      tap(response => {
        localStorage.setItem(this.tokenKey, response.access_token);
        this.fetchUserProfile();
      })
    );
  }

  fetchUserProfile() {
    this.http.get<User>(`${this.apiUrl}/user`).subscribe(user => {
      // Save user information in UserService
      this.userService.saveUser(user);
      console.log(user);
      this.router.navigate(['/document-control-panel']);
    });
  }

  logout() {
    this.userService.clearUser();
    localStorage.removeItem(this.tokenKey);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getUserRole(): Signal<string | null> {
    return this.userRole;
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  // registration stub to register and test different user roles
  register(fullName: string, email: string, password: string, role: string) {
    return this.http.post(`${this.apiUrl}/user/register`, {
      fullName,
      email,
      password,
      role
    });
  }
  
  
}
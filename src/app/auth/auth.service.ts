// Angular Imports
import { Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

// Config Imports
import { API_BASE_URL } from '../core/api/config';

// Model Imports
import { User } from '../models/user.interface';

// Service Imports
import { UserService } from '../shared/services/user.service';

// Interfaces
import { RegisterRequest } from '../models/register-req.interface';

interface AuthResponse {
  access_token: string;
}



@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = API_BASE_URL;
  private tokenKey = 'auth_token';
  private userRole: WritableSignal<string | null> = signal(null);
  private userLoaded: WritableSignal<boolean> = signal(false);

  constructor(
    private http: HttpClient,
    private router: Router,
    private userService: UserService
  ) {}

  /**
   * Logs in the user by sending the email and password to the API.
   * Saves the JWT token in localStorage and fetches the user profile.
   * @param email User's email
   * @param password User's password
   */
  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/login`, { email, password }).pipe(
      tap((response) => {
        localStorage.setItem(this.tokenKey, response.access_token); // Store the JWT token
        this.fetchUserProfile(); // Fetch user profile after login
      })
    );
  }

  /**
   * Fetches the user profile and saves it in the UserService.
   * Redirects the user to the document panel after successful login.
   */
  fetchUserProfile(): void {
    this.http.get<User>(`${this.apiUrl}/user`).subscribe({
      next: (user) => {
        this.userService.saveUser(user);
        this.userRole.set(user.role);
        this.userLoaded.set(true);
        this.router.navigate(['/document-panel']); // Navigate to document panel after user is loaded
      },
      error: (err) => {
        console.error('Error fetching user profile:', err);
      },
    });
  }

  /**
   * Logs out the user by clearing the user data from UserService.
   * Removes the JWT token from localStorage and redirects to the login page.
   */
  logout(): void {
    this.userRole.set(null);
    this.userService.clearUser();
    localStorage.removeItem(this.tokenKey);
    this.router.navigate(['/login']); // Redirect to login page
  }

  /**
   * Retrieves the JWT token from localStorage
   * @returns The JWT token or null if not found
   */
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  /**
   * Returns a Signal that holds the current user role.
   * @returns A Signal of user role or null
   */
  getUserRole(): Signal<string | null> {
    return this.userRole.asReadonly();
  }

  /**
   * Retrieves the user email from UserService
   * @returns The user's email or an empty string if user is not found
   */
  getUserEmail(): string {
    const user = this.userService.getUser();
    return user ? user.email : '';
  }

  /**
   * Retrieves the user ID from UserService
   * @returns The user's ID or an empty string if user is not found
   */
  getUserId(): string {
    const user = this.userService.getUser();
    return user ? user.id : '';
  }

  /**
   * Checks if the user is authenticated based on the presence of a JWT token
   * @returns True if authenticated, false otherwise
   */
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  /**
   * Method to check if user data has been successfully loaded
   * @returns A Signal indicating if user data is loaded
   */
  isUserLoaded(): Signal<boolean> {
    return this.userLoaded.asReadonly();
  }

  /**
   * Method for registering a new user
   * @param {RegisterRequest} userDetails - User data required for registration
   * @returns {Observable<User>} - Observable that emits the user data returned from the API
   */
  register(userDetails: RegisterRequest): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/user/register`, userDetails);  // POST request to register the user
  }
}

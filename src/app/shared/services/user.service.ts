import { Injectable } from '@angular/core';
import { User } from '../../models/user.model';

@Injectable({ providedIn: 'root' })
export class UserService {
  private user: User | null = null;

  constructor() {
    this.loadUserFromLocalStorage();
  }

  // Load user from localStorage
  loadUserFromLocalStorage(): void {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      this.user = JSON.parse(storedUser);
    }
  }

  // Save user data
  saveUser(user: User): void {
    this.user = user;
    localStorage.setItem('user', JSON.stringify(user));
  }

  // Clear user data
  clearUser(): void {
    this.user = null;
    localStorage.removeItem('user');
  }

  // Get user data
  getUser(): User | null {
    return this.user;
  }

  // Get the user's full name
  getUserName(): string | null {
    return this.user?.fullName || null;
  }

  // Get the user's role
  getUserRole(): string | null {
    return this.user?.role || null;
  }
}
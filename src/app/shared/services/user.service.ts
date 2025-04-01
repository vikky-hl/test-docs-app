import { Injectable, Signal, signal, WritableSignal } from '@angular/core';

// Models
import { User } from '../../models/user.interface';

@Injectable({ providedIn: 'root' })
export class UserService {
  // Reactive user state storage
  private user: WritableSignal<User | null> = signal<User | null>(null);

  constructor() {
    this.initializeUser();
  }

  /**
   * Initializes the user state from localStorage when the service is created.
   */
  private initializeUser(): void {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const user: User = JSON.parse(storedUser);
        this.user.set(user);
      } catch (error) {
        console.error('Error parsing user from localStorage:', error);
        this.clearUser();
      }
    }
  }

  /**
   * Saves the user to both the signal state and localStorage.
   * @param user - The user object to save.
   */
  saveUser(user: User): void {
    this.user.set(user);
    this.persistUser(user);
  }

  /**
   * Updates partial user data.
   * @param partialUser - A partial user object with updated fields.
   */
  updateUser(partialUser: Partial<User>): void {
    if (this.user()) {
      const updatedUser = { ...this.user()!, ...partialUser };
      this.user.set(updatedUser);
      this.persistUser(updatedUser);
    }
  }

  /**
   * Clears the user data from both the signal state and localStorage.
   */
  clearUser(): void {
    this.user.set(null);
    localStorage.removeItem('user');
  }

  /**
   * Returns the current user object synchronously.
   * @returns The current user or null if not set.
   */
  getUser(): User | null {
    return this.user();
  }

  /**
   * Provides a readonly signal for reactive user access.
   * @returns A readonly Signal<User | null>.
   */
  getCurrentUser(): Signal<User | null> {
    return this.user.asReadonly();
  }

  /**
   * Retrieves the current user's role.
   * @returns The role as a string, or null if no user is set.
   */
  getUserRole(): string | null {
    return this.user()?.role || null;
  }

  /**
   * Retrieves the current user's email.
   * @returns The email as a string, or null if no user is set.
   */
  getUserEmail(): string | null {
    return this.user()?.email || null;
  }

  /**
   * Retrieves the current user's ID.
   * @returns The ID as a string, or null if no user is set.
   */
  getUserId(): string | null {
    return this.user()?.id || null;
  }

  /**
   * Persists the user object to localStorage.
   * @param user - The user object to save.
   */
  private persistUser(user: User): void {
    try {
      localStorage.setItem('user', JSON.stringify(user));
    } catch (error) {
      console.error('Error saving user to localStorage:', error);
    }
  }
}

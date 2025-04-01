export type UserRole = 'USER' | 'REVIEWER';

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
}
  
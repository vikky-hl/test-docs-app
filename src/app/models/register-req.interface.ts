import { User } from "./user.interface";

export interface RegisterRequest extends Omit<User, 'id'> {
  password: string;  // Password field is required during registration
}
import { UserRole } from '../models/user.model';

export interface JWTPayload {
  id: string;
  email: string;
  role: UserRole;
} 

export type UserRole = 'Admin' | 'Manager' | 'Staff';
export type UserStatus = 'Active' | 'Inactive';

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  status: UserStatus;
  lastLogin?: string;
  createdAt: string;
}

export interface UserActivity {
  id: string;
  userId: string;
  action: string;
  timestamp: string;
  ipAddress?: string;
}

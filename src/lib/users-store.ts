
import { User, UserRole, UserStatus } from '@/types/user';

class UsersStore {
  private static instance: UsersStore;
  private users: User[] = [
    {
      id: 'u1',
      name: 'System Administrator',
      email: 'admin@barakostore.com',
      role: 'Admin',
      status: 'Active',
      lastLogin: new Date(Date.now() - 3600000).toISOString(),
      createdAt: new Date(Date.now() - 31536000000).toISOString(),
    },
    {
      id: 'u2',
      name: 'Sarah Manager',
      email: 'sarah.m@barakostore.com',
      role: 'Manager',
      status: 'Active',
      lastLogin: new Date(Date.now() - 86400000).toISOString(),
      createdAt: new Date(Date.now() - 15768000000).toISOString(),
    },
    {
      id: 'u3',
      name: 'Mike Staff',
      email: 'mike.s@barakostore.com',
      role: 'Staff',
      status: 'Inactive',
      lastLogin: new Date(Date.now() - 604800000).toISOString(),
      createdAt: new Date(Date.now() - 7884000000).toISOString(),
    }
  ];

  private constructor() {}

  public static getInstance(): UsersStore {
    if (!UsersStore.instance) {
      UsersStore.instance = new UsersStore();
    }
    return UsersStore.instance;
  }

  public getAll(): User[] {
    return [...this.users].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public getById(id: string): User | undefined {
    return this.users.find(u => u.id === id);
  }

  public create(user: Omit<User, 'id' | 'createdAt' | 'lastLogin'>): User {
    const newUser: User = {
      ...user,
      id: Math.random().toString(36).substring(2, 9),
      createdAt: new Date().toISOString(),
    };
    this.users.push(newUser);
    return newUser;
  }

  public update(id: string, updates: Partial<User>): User | undefined {
    const index = this.users.findIndex(u => u.id === id);
    if (index === -1) return undefined;
    this.users[index] = { ...this.users[index], ...updates };
    return this.users[index];
  }

  public delete(id: string): boolean {
    const initialLength = this.users.length;
    this.users = this.users.filter(u => u.id !== id);
    return this.users.length < initialLength;
  }

  public bulkDelete(ids: string[]): number {
    const initialLength = this.users.length;
    this.users = this.users.filter(u => !ids.includes(u.id));
    return initialLength - this.users.length;
  }
}

export const usersStore = UsersStore.getInstance();

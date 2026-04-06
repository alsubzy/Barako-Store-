
import { User } from '@/types/user';
import { ApiResponse } from '@/types/product';

const API_BASE = '/api/users';

export const usersAPI = {
  async getAll(): Promise<ApiResponse<User[]>> {
    const res = await fetch(API_BASE);
    return res.json();
  },

  async getById(id: string): Promise<ApiResponse<User>> {
    const res = await fetch(`${API_BASE}/${id}`);
    return res.json();
  },

  async create(user: Omit<User, 'id' | 'createdAt' | 'lastLogin'>): Promise<ApiResponse<User>> {
    const res = await fetch(API_BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user),
    });
    return res.json();
  },

  async update(id: string, updates: Partial<User>): Promise<ApiResponse<User>> {
    const res = await fetch(`${API_BASE}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    return res.json();
  },

  async delete(id: string): Promise<ApiResponse<void>> {
    const res = await fetch(`${API_BASE}/${id}`, {
      method: 'DELETE',
    });
    return res.json();
  },

  async bulkDelete(ids: string[]): Promise<ApiResponse<void>> {
    const res = await fetch(API_BASE, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids }),
    });
    return res.json();
  }
};

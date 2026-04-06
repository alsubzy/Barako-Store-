
import { ApiResponse, Product } from '@/types/product';

const API_BASE = '/api/products';

export const productsAPI = {
  async getAll(): Promise<ApiResponse<Product[]>> {
    const res = await fetch(API_BASE);
    return res.json();
  },

  async create(product: Omit<Product, 'id' | 'createdAt'>): Promise<ApiResponse<Product>> {
    const res = await fetch(API_BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product),
    });
    return res.json();
  },

  async update(id: string, updates: Partial<Product>): Promise<ApiResponse<Product>> {
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

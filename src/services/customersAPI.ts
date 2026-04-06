
import { Customer, CustomerOrder } from '@/types/customer';
import { ApiResponse } from '@/types/product';

const API_BASE = '/api/customers';

export const customersAPI = {
  async getAll(): Promise<ApiResponse<Customer[]>> {
    const res = await fetch(API_BASE);
    return res.json();
  },

  async getById(id: string): Promise<ApiResponse<Customer>> {
    const res = await fetch(`${API_BASE}/${id}`);
    return res.json();
  },

  async create(customer: Omit<Customer, 'id' | 'createdAt' | 'totalOrders' | 'totalSpent'>): Promise<ApiResponse<Customer>> {
    const res = await fetch(API_BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(customer),
    });
    return res.json();
  },

  async update(id: string, updates: Partial<Customer>): Promise<ApiResponse<Customer>> {
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
  },

  async getOrderHistory(id: string): Promise<ApiResponse<CustomerOrder[]>> {
    const res = await fetch(`${API_BASE}/${id}/orders`);
    return res.json();
  }
};

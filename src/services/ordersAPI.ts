
import { ApiResponse } from '@/types/product';
import { Order, CreateOrderInput, UpdateOrderInput } from '@/types/order';

const API_BASE = '/api/orders';

export const ordersAPI = {
  async getAll(): Promise<ApiResponse<Order[]>> {
    const res = await fetch(API_BASE);
    return res.json();
  },

  async create(order: CreateOrderInput): Promise<ApiResponse<Order>> {
    const res = await fetch(API_BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order),
    });
    return res.json();
  },

  async update(id: string, updates: UpdateOrderInput): Promise<ApiResponse<Order>> {
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


import { ApiResponse } from '@/types/product';
import { InventoryItem, StockHistory, InventoryUpdateInput } from '@/types/inventory';

const API_BASE = '/api/inventory';

export const inventoryAPI = {
  async getStatus(): Promise<ApiResponse<InventoryItem[]>> {
    const res = await fetch(API_BASE);
    return res.json();
  },

  async getHistory(): Promise<ApiResponse<StockHistory[]>> {
    const res = await fetch(`${API_BASE}/history`);
    return res.json();
  },

  async updateStock(data: InventoryUpdateInput): Promise<ApiResponse<any>> {
    const res = await fetch(`${API_BASE}/update`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  }
};

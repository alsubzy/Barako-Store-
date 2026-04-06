
import { ApiResponse } from '@/types/product';
import { SalesReportData, InventoryReportItem, CustomerReportItem, OrderReportItem, TimeRange } from '@/types/reports';

const API_BASE = '/api/reports';

export const reportsAPI = {
  async getSales(range: TimeRange = 'week'): Promise<ApiResponse<SalesReportData[]>> {
    const res = await fetch(`${API_BASE}/sales?range=${range}`);
    return res.json();
  },

  async getOrders(): Promise<ApiResponse<OrderReportItem[]>> {
    const res = await fetch(`${API_BASE}/orders`);
    return res.json();
  },

  async getInventory(): Promise<ApiResponse<InventoryReportItem[]>> {
    const res = await fetch(`${API_BASE}/inventory`);
    return res.json();
  },

  async getCustomers(): Promise<ApiResponse<CustomerReportItem[]>> {
    const res = await fetch(`${API_BASE}/customers`);
    return res.json();
  }
};

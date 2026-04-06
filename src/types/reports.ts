
export type TimeRange = 'day' | 'week' | 'month';

export interface SalesReportData {
  date: string;
  totalOrders: number;
  totalRevenue: number;
}

export interface InventoryReportItem {
  productId: string;
  name: string;
  category: string;
  stock: number;
  unit: string;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
}

export interface CustomerReportItem {
  id: string;
  name: string;
  email: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate?: string;
}

export interface OrderReportItem {
  id: string;
  customerName: string;
  totalAmount: number;
  status: string;
  createdAt: string;
}

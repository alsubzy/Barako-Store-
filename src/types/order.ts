
import { ApiResponse } from './product';

export type OrderStatus = 'Pending' | 'Processing' | 'Completed' | 'Cancelled';

export interface OrderItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
  unit: string;
}

export interface Order {
  id: string;
  customerName: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  orderDate: string;
  createdAt: string;
}

export interface CreateOrderInput {
  customerName: string;
  items: { productId: string; quantity: number }[];
}

export interface UpdateOrderInput {
  customerName?: string;
  items?: { productId: string; quantity: number }[];
  status?: OrderStatus;
}

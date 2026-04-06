
export type CustomerStatus = 'Active' | 'Inactive';

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  status: CustomerStatus;
  totalOrders: number;
  totalSpent: number;
  createdAt: string;
}

export interface CustomerOrder {
  id: string;
  date: string;
  total: number;
  status: 'Completed' | 'Processing' | 'Cancelled';
  itemsCount: number;
}

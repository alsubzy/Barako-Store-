
export type StockAction = 'add' | 'remove';

export interface InventoryItem {
  id: string;
  productId: string;
  productName: string;
  stockQuantity: number;
  unit: string;
  category: string;
  updatedAt: string;
}

export interface StockHistory {
  id: string;
  productId: string;
  productName: string;
  action: StockAction;
  quantity: number;
  previousStock: number;
  newStock: number;
  timestamp: string;
}

export interface InventoryUpdateInput {
  productId: string;
  action: StockAction;
  quantity: number;
}

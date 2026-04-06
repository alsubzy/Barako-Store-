
import { productsStore } from './products-store';
import { StockHistory, StockAction } from '@/types/inventory';

/**
 * Server-side store for Inventory History and Movements.
 * Integrates with ProductsStore for stock updates.
 */
class InventoryStore {
  private static instance: InventoryStore;
  private history: StockHistory[] = [];

  private constructor() {}

  public static getInstance(): InventoryStore {
    if (!InventoryStore.instance) {
      InventoryStore.instance = new InventoryStore();
    }
    return InventoryStore.instance;
  }

  public getHistory(): StockHistory[] {
    return [...this.history].sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }

  public updateStock(productId: string, action: StockAction, quantity: number): { success: boolean; message: string; data?: any } {
    const product = productsStore.getById(productId);
    if (!product) return { success: false, message: "Product not found" };

    const previousStock = product.stock;
    let newStock = previousStock;

    if (action === 'add') {
      newStock += quantity;
    } else {
      if (previousStock < quantity) {
        return { success: false, message: "Insufficient stock for removal" };
      }
      newStock -= quantity;
    }

    const updated = productsStore.update(productId, { stock: newStock });
    if (!updated) return { success: false, message: "Failed to update stock" };

    const historyEntry: StockHistory = {
      id: Math.random().toString(36).substring(2, 9),
      productId,
      productName: product.name,
      action,
      quantity,
      previousStock,
      newStock,
      timestamp: new Date().toISOString(),
    };

    this.history.push(historyEntry);

    return { 
      success: true, 
      message: `Stock ${action === 'add' ? 'increased' : 'decreased'} successfully`,
      data: updated
    };
  }
}

export const inventoryStore = InventoryStore.getInstance();

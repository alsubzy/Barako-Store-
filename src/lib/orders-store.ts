
import { Order, OrderStatus, OrderItem } from '@/types/order';
import { productsStore } from './products-store';

/**
 * In-memory data store for orders.
 * Integrates with ProductsStore to manage inventory levels.
 */
class OrdersStore {
  private static instance: OrdersStore;
  private orders: Order[] = [
    {
      id: 'ORD-A1B2C3',
      customerName: 'John Doe',
      items: [
        { productId: '1', name: 'Red Apples', quantity: 2, price: 2.5, unit: 'kg' }
      ],
      totalAmount: 5.0,
      status: 'Completed',
      orderDate: new Date(Date.now() - 86400000).toISOString(),
      createdAt: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: 'ORD-D4E5F6',
      customerName: 'Jane Smith',
      items: [
        { productId: '2', name: 'Fresh Milk', quantity: 1, price: 1.8, unit: 'liter' },
        { productId: '3', name: 'Sourdough Bread', quantity: 1, price: 3.2, unit: 'piece' }
      ],
      totalAmount: 5.0,
      status: 'Processing',
      orderDate: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    }
  ];

  private constructor() {}

  public static getInstance(): OrdersStore {
    if (!OrdersStore.instance) {
      OrdersStore.instance = new OrdersStore();
    }
    return OrdersStore.instance;
  }

  public getAll(): Order[] {
    return [...this.orders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public getById(id: string): Order | undefined {
    return this.orders.find(o => o.id === id);
  }

  public create(input: { customerName: string; items: { productId: string; quantity: number }[] }): Order | { error: string } {
    let totalAmount = 0;
    const orderItems: OrderItem[] = [];

    // Validate stock and calculate total
    for (const item of input.items) {
      const product = productsStore.getById(item.productId);
      if (!product) return { error: `Product ${item.productId} not found` };
      if (product.stock < item.quantity) return { error: `Insufficient stock for ${product.name}` };
      
      orderItems.push({
        productId: product.id,
        name: product.name,
        quantity: item.quantity,
        price: product.price,
        unit: product.unit
      });
      totalAmount += product.price * item.quantity;
    }

    // Deduct stock
    for (const item of input.items) {
      const product = productsStore.getById(item.productId)!;
      productsStore.update(product.id, { stock: product.stock - item.quantity });
    }

    const newOrder: Order = {
      id: `ORD-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      customerName: input.customerName,
      items: orderItems,
      totalAmount,
      status: 'Pending',
      orderDate: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };

    this.orders.push(newOrder);
    return newOrder;
  }

  public update(id: string, updates: Partial<Order>): Order | undefined {
    const index = this.orders.findIndex(o => o.id === id);
    if (index === -1) return undefined;

    // Handle stock reversion if order is cancelled
    if (updates.status === 'Cancelled' && this.orders[index].status !== 'Cancelled') {
      for (const item of this.orders[index].items) {
        const product = productsStore.getById(item.productId);
        if (product) {
          productsStore.update(product.id, { stock: product.stock + item.quantity });
        }
      }
    }

    this.orders[index] = { ...this.orders[index], ...updates };
    return this.orders[index];
  }

  public delete(id: string): boolean {
    const initialLength = this.orders.length;
    this.orders = this.orders.filter(o => o.id !== id);
    return this.orders.length < initialLength;
  }

  public bulkDelete(ids: string[]): number {
    const initialLength = this.orders.length;
    this.orders = this.orders.filter(o => !ids.includes(o.id));
    return initialLength - this.orders.length;
  }
}

export const ordersStore = OrdersStore.getInstance();

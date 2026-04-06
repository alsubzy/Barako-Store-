
import { Customer } from '@/types/customer';

/**
 * In-memory data store for customers.
 * Ready for easy replacement with Firestore.
 */
class CustomersStore {
  private static instance: CustomersStore;
  private customers: Customer[] = [
    {
      id: 'c1',
      name: 'John Doe',
      email: 'john@example.com',
      phone: '123-456-7890',
      address: '123 Maple St, Springfield',
      status: 'Active',
      totalOrders: 5,
      totalSpent: 250.50,
      createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
    },
    {
      id: 'c2',
      name: 'Jane Smith',
      email: 'jane@smith.com',
      phone: '098-765-4321',
      address: '456 Oak Rd, Riverdale',
      status: 'Active',
      totalOrders: 2,
      totalSpent: 85.20,
      createdAt: new Date(Date.now() - 15 * 86400000).toISOString(),
    },
    {
      id: 'c3',
      name: 'Robert Brown',
      email: 'robert@brown.com',
      phone: '555-0199',
      address: '789 Pine Ave, Hill Valley',
      status: 'Inactive',
      totalOrders: 0,
      totalSpent: 0,
      createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    }
  ];

  private constructor() {}

  public static getInstance(): CustomersStore {
    if (!CustomersStore.instance) {
      CustomersStore.instance = new CustomersStore();
    }
    return CustomersStore.instance;
  }

  public getAll(): Customer[] {
    return [...this.customers].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public getById(id: string): Customer | undefined {
    return this.customers.find(c => c.id === id);
  }

  public create(customer: Omit<Customer, 'id' | 'createdAt' | 'totalOrders' | 'totalSpent'>): Customer {
    const newCustomer: Customer = {
      ...customer,
      id: Math.random().toString(36).substring(2, 9),
      totalOrders: 0,
      totalSpent: 0,
      createdAt: new Date().toISOString(),
    };
    this.customers.push(newCustomer);
    return newCustomer;
  }

  public update(id: string, updates: Partial<Customer>): Customer | undefined {
    const index = this.customers.findIndex(c => c.id === id);
    if (index === -1) return undefined;
    this.customers[index] = { ...this.customers[index], ...updates };
    return this.customers[index];
  }

  public delete(id: string): boolean {
    const initialLength = this.customers.length;
    this.customers = this.customers.filter(c => c.id !== id);
    return this.customers.length < initialLength;
  }

  public bulkDelete(ids: string[]): number {
    const initialLength = this.customers.length;
    this.customers = this.customers.filter(c => !ids.includes(c.id));
    return initialLength - this.customers.length;
  }
}

export const customersStore = CustomersStore.getInstance();

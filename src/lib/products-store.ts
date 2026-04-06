
import { Product } from '@/types/product';

/**
 * In-memory data store for products.
 * In a real app, this would be replaced by a database like Firestore.
 */
class ProductsStore {
  private static instance: ProductsStore;
  private products: Product[] = [
    { id: '1', name: 'Red Apples', category: 'Fruits', price: 2.5, stock: 45, unit: 'kg', image: 'https://picsum.photos/seed/apple/600/400', createdAt: new Date().toISOString() },
    { id: '2', name: 'Fresh Milk', category: 'Dairy', price: 1.8, stock: 5, unit: 'liter', image: 'https://picsum.photos/seed/milk/600/400', createdAt: new Date().toISOString() },
    { id: '3', name: 'Sourdough Bread', category: 'Bakery', price: 3.2, stock: 12, unit: 'piece', image: 'https://picsum.photos/seed/bread/600/400', createdAt: new Date().toISOString() },
    { id: '4', name: 'Organic Eggs', category: 'Dairy', price: 4.5, stock: 20, unit: 'piece', image: 'https://picsum.photos/seed/eggs/600/400', createdAt: new Date().toISOString() },
    { id: '5', name: 'Fresh Spinach', category: 'Vegetables', price: 1.2, stock: 3, unit: 'kg', image: 'https://picsum.photos/seed/vegetables/600/400', createdAt: new Date().toISOString() },
  ];

  private constructor() {}

  public static getInstance(): ProductsStore {
    if (!ProductsStore.instance) {
      ProductsStore.instance = new ProductsStore();
    }
    return ProductsStore.instance;
  }

  public getAll(): Product[] {
    return [...this.products].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public getById(id: string): Product | undefined {
    return this.products.find(p => p.id === id);
  }

  public create(product: Omit<Product, 'id' | 'createdAt'>): Product {
    const newProduct: Product = {
      ...product,
      id: Math.random().toString(36).substring(2, 9),
      createdAt: new Date().toISOString(),
    };
    this.products.push(newProduct);
    return newProduct;
  }

  public update(id: string, updates: Partial<Product>): Product | undefined {
    const index = this.products.findIndex(p => p.id === id);
    if (index === -1) return undefined;
    this.products[index] = { ...this.products[index], ...updates };
    return this.products[index];
  }

  public delete(id: string): boolean {
    const initialLength = this.products.length;
    this.products = this.products.filter(p => p.id !== id);
    return this.products.length < initialLength;
  }

  public bulkDelete(ids: string[]): number {
    const initialLength = this.products.length;
    this.products = this.products.filter(p => !ids.includes(p.id));
    return initialLength - this.products.length;
  }
}

export const productsStore = ProductsStore.getInstance();

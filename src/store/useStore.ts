import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product, Order, Customer, User, CartItem, Role } from '@/types';

interface AppState {
  user: User | null;
  products: Product[];
  orders: Order[];
  customers: Customer[];
  cart: CartItem[];
  
  // Auth Actions
  login: (email: string, role: Role) => void;
  logout: () => void;

  // Product Actions
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;

  // POS Actions
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  checkout: (customerName: string) => void;

  // Order Actions
  updateOrderStatus: (orderId: string, status: Order['status']) => void;

  // Customer Actions
  addCustomer: (customer: Omit<Customer, 'id'>) => void;
}

const INITIAL_PRODUCTS: Product[] = [
  { id: '1', name: 'Red Apples', category: 'Fruits', price: 2.5, stockQuantity: 45, unit: 'kg', image: 'https://picsum.photos/seed/apple/600/400' },
  { id: '2', name: 'Fresh Milk', category: 'Dairy', price: 1.8, stockQuantity: 5, unit: 'liter', image: 'https://picsum.photos/seed/milk/600/400' },
  { id: '3', name: 'Sourdough Bread', category: 'Bakery', price: 3.2, stockQuantity: 12, unit: 'piece', image: 'https://picsum.photos/seed/bread/600/400' },
  { id: '4', name: 'Organic Eggs', category: 'Dairy', price: 4.5, stockQuantity: 20, unit: 'piece', image: 'https://picsum.photos/seed/eggs/600/400' },
  { id: '5', name: 'Fresh Spinach', category: 'Vegetables', price: 1.2, stockQuantity: 3, unit: 'kg', image: 'https://picsum.photos/seed/vegetables/600/400' },
];

const INITIAL_CUSTOMERS: Customer[] = [
  { id: 'c1', name: 'John Doe', email: 'john@example.com', phone: '123-456-7890', totalOrders: 5, totalSpent: 250 },
  { id: 'c2', name: 'Jane Smith', email: 'jane@example.com', phone: '098-765-4321', totalOrders: 2, totalSpent: 85 },
];

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: null,
      products: INITIAL_PRODUCTS,
      orders: [],
      customers: INITIAL_CUSTOMERS,
      cart: [],

      login: (email, role) => set({ 
        user: { id: 'u1', name: email.split('@')[0], email, role } 
      }),
      logout: () => set({ user: null, cart: [] }),

      addProduct: (product) => set((state) => ({
        products: [...state.products, { ...product, id: Math.random().toString(36).substr(2, 9) }]
      })),
      updateProduct: (id, updatedProduct) => set((state) => ({
        products: state.products.map((p) => (p.id === id ? { ...p, ...updatedProduct } : p))
      })),
      deleteProduct: (id) => set((state) => ({
        products: state.products.filter((p) => p.id !== id)
      })),

      addToCart: (product) => set((state) => {
        const existing = state.cart.find((item) => item.id === product.id);
        if (existing) {
          return {
            cart: state.cart.map((item) =>
              item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
            )
          };
        }
        return { cart: [...state.cart, { ...product, quantity: 1 }] };
      }),
      removeFromCart: (productId) => set((state) => ({
        cart: state.cart.filter((item) => item.id !== productId)
      })),
      updateCartQuantity: (productId, quantity) => set((state) => ({
        cart: state.cart.map((item) =>
          item.id === productId ? { ...item, quantity: Math.max(1, quantity) } : item
        )
      })),
      clearCart: () => set({ cart: [] }),
      checkout: (customerName) => {
        const { cart, products } = get();
        if (cart.length === 0) return;

        const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const newOrder: Order = {
          id: `ORD-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
          customerId: 'walk-in',
          customerName: customerName || 'Walk-in Customer',
          items: [...cart],
          total,
          status: 'completed',
          createdAt: new Date().toISOString(),
        };

        const updatedProducts = products.map((p) => {
          const cartItem = cart.find((item) => item.id === p.id);
          if (cartItem) {
            return { ...p, stockQuantity: Math.max(0, p.stockQuantity - cartItem.quantity) };
          }
          return p;
        });

        set((state) => ({
          orders: [newOrder, ...state.orders],
          products: updatedProducts,
          cart: [],
        }));
      },

      updateOrderStatus: (orderId, status) => set((state) => ({
        orders: state.orders.map((o) => (o.id === orderId ? { ...o, status } : o))
      })),

      addCustomer: (customer) => set((state) => ({
        customers: [...state.customers, { ...customer, id: `CUST-${Math.random().toString(36).substr(2, 4)}` }]
      })),
    }),
    {
      name: 'barako-store-storage',
    }
  )
);

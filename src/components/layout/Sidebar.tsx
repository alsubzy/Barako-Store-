"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useStore } from '@/store/useStore';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  History, 
  Users, 
  BarChart3, 
  LogOut,
  AlertTriangle,
  Boxes
} from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout, products } = useStore();
  
  const lowStockCount = products.filter(p => p.stockQuantity <= 10).length;

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, roles: ['admin', 'staff'] },
    { name: 'POS System', href: '/dashboard/pos', icon: ShoppingCart, roles: ['admin', 'staff'] },
    { name: 'Products', href: '/dashboard/products', icon: Package, roles: ['admin'] },
    { name: 'Inventory', href: '/dashboard/inventory', icon: Boxes, roles: ['admin'], badge: lowStockCount > 0 ? lowStockCount : null },
    { name: 'Orders', href: '/dashboard/orders', icon: History, roles: ['admin', 'staff'] },
    { name: 'Customers', href: '/dashboard/customers', icon: Users, roles: ['admin'] },
    { name: 'Reports', href: '/dashboard/reports', icon: BarChart3, roles: ['admin'] },
  ];

  const filteredNavItems = navItems.filter(item => item.roles.includes(user?.role || 'staff'));

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r bg-card shadow-sm">
      <div className="flex h-full flex-col px-3 py-4">
        <div className="mb-10 px-4">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg">
              <ShoppingCart className="h-6 w-6" />
            </div>
            <span className="text-xl font-bold tracking-tight text-primary">MarketFlow<span className="text-accent">Pro</span></span>
          </Link>
        </div>

        <nav className="flex-1 space-y-1">
          {filteredNavItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group flex items-center justify-between rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200",
                  isActive 
                    ? "bg-primary text-primary-foreground shadow-md" 
                    : "text-muted-foreground hover:bg-secondary hover:text-primary"
                )}
              >
                <div className="flex items-center gap-3">
                  <item.icon className={cn("h-5 w-5", isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-primary")} />
                  {item.name}
                </div>
                {item.badge && (
                  <span className={cn(
                    "flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold",
                    isActive ? "bg-white text-primary" : "bg-destructive text-destructive-foreground animate-pulse"
                  )}>
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto pt-4">
          <div className="mb-4 flex items-center gap-3 rounded-xl bg-secondary p-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
              {user?.name?.[0].toUpperCase() || 'U'}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="truncate text-sm font-bold text-primary">{user?.name || 'User'}</p>
              <p className="truncate text-xs text-muted-foreground capitalize">{user?.role || 'Staff'}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10"
          >
            <LogOut className="h-5 w-5" />
            Sign Out
          </button>
        </div>
      </div>
    </aside>
  );
}
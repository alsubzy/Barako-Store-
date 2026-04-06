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
  Boxes,
  ChevronRight
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
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r bg-white">
      <div className="flex h-full flex-col px-4 py-6">
        <div className="mb-10 px-2">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white shadow-lg">
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
                  "group flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200",
                  isActive 
                    ? "bg-primary text-white shadow-md shadow-primary/20" 
                    : "text-slate-500 hover:bg-slate-50 hover:text-primary"
                )}
              >
                <div className="flex items-center gap-3">
                  <item.icon className={cn("h-5 w-5 transition-colors", isActive ? "text-white" : "text-slate-400 group-hover:text-primary")} />
                  {item.name}
                </div>
                <div className="flex items-center gap-2">
                  {item.badge && (
                    <span className={cn(
                      "flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[10px] font-bold",
                      isActive ? "bg-accent text-primary" : "bg-accent text-primary animate-pulse"
                    )}>
                      {item.badge}
                    </span>
                  )}
                  {isActive && <ChevronRight className="h-4 w-4 opacity-70" />}
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto pt-6 space-y-4">
          <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3 border border-slate-100">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white font-bold ring-2 ring-white shadow-sm">
              {user?.name?.[0].toUpperCase() || 'U'}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="truncate text-sm font-bold text-slate-900">{user?.name || 'User'}</p>
              <p className="truncate text-[10px] text-slate-500 uppercase tracking-wider font-semibold">{user?.role || 'Staff'}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-destructive transition-all hover:bg-destructive/5"
          >
            <LogOut className="h-5 w-5" />
            Sign Out
          </button>
        </div>
      </div>
    </aside>
  );
}
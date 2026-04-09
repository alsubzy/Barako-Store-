"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useStore } from '@/store/useStore';
import { cn } from '@/lib/utils';
import { Logo } from '@/components/shared/Logo';
import { 
  LayoutDashboard, 
  Package, 
  History, 
  Users, 
  BarChart3, 
  LogOut,
  Boxes,
  ShieldCheck,
  CreditCard,
  Settings,
  X
} from 'lucide-react';

interface SidebarProps {
  onClose?: () => void;
}

export default function Sidebar({ onClose }: SidebarProps) {
  const pathname = usePathname();
  const { user, logout, products } = useStore();
  
  const lowStockCount = products.filter(p => p.stockQuantity <= 10).length;

  const navItems = [
    { name: 'Overview', href: '/dashboard', icon: LayoutDashboard, roles: ['admin', 'staff'] },
    { name: 'POS System', href: '/dashboard/pos', icon: CreditCard, roles: ['admin', 'staff'] },
    { name: 'Products', href: '/dashboard/products', icon: Package, roles: ['admin'] },
    { name: 'Inventory', href: '/dashboard/inventory', icon: Boxes, roles: ['admin'], badge: lowStockCount > 0 ? lowStockCount : null },
    { name: 'Orders', href: '/dashboard/orders', icon: History, roles: ['admin', 'staff'] },
    { name: 'Customers', href: '/dashboard/customers', icon: Users, roles: ['admin'] },
    { name: 'Users', href: '/dashboard/users', icon: ShieldCheck, roles: ['admin'] },
    { name: 'Reports', href: '/dashboard/reports', icon: BarChart3, roles: ['admin'] },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings, roles: ['admin'] },
  ];

  const filteredNavItems = navItems.filter(item => item.roles.includes(user?.role || 'staff'));

  return (
    <aside className="h-full w-64 border-r border-slate-100 dark:border-slate-800 bg-white dark:bg-card">
      <div className="flex h-full flex-col px-4 py-8">
        {/* BRANDING */}
        <div className="mb-10 px-3 flex items-center justify-between">
          <Logo size="lg" />
          <button 
            onClick={onClose}
            className="lg:hidden p-2 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* NAVIGATION */}
        <nav className="flex-1 space-y-1 px-1">
          {filteredNavItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group flex items-center justify-between rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200",
                  isActive 
                    ? "bg-slate-100/80 dark:bg-slate-800/80 text-[#3338A0] dark:text-white" 
                    : "text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800/30 hover:text-[#3338A0]"
                )}
              >
                <div className="flex items-center gap-3">
                  <item.icon className={cn(
                    "h-4 w-4 transition-colors", 
                    isActive ? "text-[#3338A0] dark:text-white" : "text-slate-400 group-hover:text-[#3338A0]"
                  )} />
                  <span className={cn(isActive && "font-bold")}>{item.name}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  {item.badge && (
                    <span className={cn(
                      "flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[9px] font-black",
                      isActive ? "bg-[#3338A0] text-white" : "bg-rose-100 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400"
                    )}>
                      {item.badge}
                    </span>
                  )}
                  {isActive && <div className="h-1 w-1 rounded-full bg-[#3338A0] dark:bg-white" />}
                </div>
              </Link>
            );
          })}
        </nav>

        {/* FOOTER SECTION */}
        <div className="mt-auto pt-6 px-1 space-y-4">
          <div className="flex items-center gap-3 rounded-2xl bg-slate-50 dark:bg-slate-900/50 p-3 border border-slate-100 dark:border-slate-800 transition-colors hover:border-slate-200 cursor-pointer group">
            <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 font-bold text-[#3338A0] dark:text-white shadow-sm overflow-hidden group-hover:scale-105 transition-transform">
               {user?.name?.[0].toUpperCase() || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="truncate text-sm font-bold text-slate-900 dark:text-white leading-none">{user?.name || 'Administrator'}</p>
              <p className="truncate text-[10px] text-slate-500 uppercase tracking-widest font-black mt-1">{user?.role || 'Admin'}</p>
            </div>
            <Settings className="h-3.5 w-3.5 text-slate-300 group-hover:rotate-90 transition-transform" />
          </div>
          
          <button
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-bold text-rose-500 transition-all hover:bg-rose-50 dark:hover:bg-rose-500/5 hover:text-rose-600"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </aside>
  );
}

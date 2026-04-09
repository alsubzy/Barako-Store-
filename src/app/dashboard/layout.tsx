"use client";

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useStore } from '@/store/useStore';
import Sidebar from '@/components/layout/Sidebar';
import { Logo } from '@/components/shared/Logo';
import { 
  Bell, 
  Moon, 
  Sun, 
  User, 
  Settings, 
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useStore();
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    setIsSidebarOpen(false); // Close sidebar on route change
  }, [pathname]);

  useEffect(() => {
    setMounted(true);
    if (!user) {
      router.push('/login');
    }
    const storedTheme = localStorage.getItem('theme') as 'light' | 'dark';
    if (storedTheme) {
      setTheme(storedTheme);
      document.documentElement.classList.toggle('dark', storedTheme === 'dark');
    }
  }, [user, router]);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  if (!mounted || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white dark:bg-background">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  const pageTitle = pathname.split('/').pop()?.replace(/-/g, ' ') || 'Overview';

  return (
    <div className="flex min-h-screen bg-[#FDFDFD] dark:bg-background transition-colors duration-300">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm transition-opacity lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar Wrapper */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-40 transition-transform duration-300 lg:static lg:translate-x-0",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <Sidebar onClose={() => setIsSidebarOpen(false)} />
      </div>

      <div className="flex-1 flex flex-col min-h-screen transition-all duration-300 overflow-x-hidden">
        <header className="sticky top-0 z-20 flex h-20 items-center justify-between border-b border-slate-100 dark:border-slate-800 bg-white/80 dark:bg-background/80 px-4 md:px-10 backdrop-blur-xl shrink-0">
          <div className="flex items-center gap-2 md:gap-10">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              <Menu className="h-6 w-6" />
            </Button>
            <div className="hidden lg:block">
              <Logo size="sm" clickable={false} showText={true} />
            </div>
            <div className="lg:hidden scale-75 origin-left">
              <Logo size="sm" clickable={false} showText={false} />
            </div>
            <h2 className="text-base md:text-lg font-black capitalize text-slate-900 dark:text-white tracking-tight truncate max-w-[120px] md:max-w-none">{pageTitle}</h2>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center bg-slate-100 dark:bg-background p-1 rounded-xl border border-slate-200/50 dark:border-slate-800">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={toggleTheme}
                className={cn(
                  "h-8 w-8 rounded-lg transition-all duration-300",
                  theme === 'light' ? "bg-white text-primary shadow-sm" : "text-slate-500 hover:text-white"
                )}
              >
                <Sun className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={toggleTheme}
                className={cn(
                  "h-8 w-8 rounded-lg transition-all duration-300",
                  theme === 'dark' ? "bg-slate-800 text-white shadow-sm" : "text-slate-500 hover:text-primary"
                )}
              >
                <Moon className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" className="relative rounded-xl text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 transition-all">
                <Bell className="h-4 w-4" />
                <span className="absolute top-3 right-3 h-1.5 w-1.5 rounded-full bg-accent ring-2 ring-white dark:ring-slate-950"></span>
              </Button>
              <Link href="/dashboard/settings">
                <Button variant="ghost" size="icon" className="rounded-xl text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 transition-all">
                  <Settings className="h-4 w-4" />
                </Button>
              </Link>
            </div>

            <div className="h-6 w-[1px] bg-slate-200 dark:bg-card mx-2"></div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-3 pl-2 group outline-none">
                  <Avatar className="h-9 w-9 ring-4 ring-primary/5 transition-all group-hover:scale-105 active:scale-95 shadow-sm">
                    <AvatarFallback className="bg-primary text-white text-[10px] font-black uppercase">
                      {user.name?.[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden sm:block text-left">
                    <p className="text-xs font-black leading-none dark:text-white group-hover:text-primary transition-colors">{user.name}</p>
                    <p className="text-[9px] text-slate-400 font-black uppercase mt-1 tracking-widest">{user.role}</p>
                  </div>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 p-2 rounded-2xl border-slate-100 dark:border-slate-800 shadow-2xl mt-2 animate-in fade-in zoom-in-95" align="end">
                <DropdownMenuLabel className="px-3 py-2">
                  <div className="flex flex-col space-y-1">
                    <p className="text-xs font-black leading-none">{user.name}</p>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-slate-50 dark:bg-slate-800 my-1" />
                <DropdownMenuItem className="flex items-center gap-2 p-3 text-xs font-bold rounded-xl cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900 focus:bg-slate-50 dark:focus:bg-slate-900 transition-colors">
                  <User className="h-3.5 w-3.5 text-slate-400" />
                  <span>Account Profile</span>
                </DropdownMenuItem>
                <Link href="/dashboard/settings">
                  <DropdownMenuItem className="flex items-center gap-2 p-3 text-xs font-bold rounded-xl cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900 focus:bg-slate-50 dark:focus:bg-slate-900 transition-colors">
                    <Settings className="h-3.5 w-3.5 text-slate-400" />
                    <span>System Settings</span>
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuSeparator className="bg-slate-50 dark:bg-slate-800 my-1" />
                <DropdownMenuItem 
                  onClick={handleLogout}
                  className="flex items-center gap-2 p-3 text-xs font-bold rounded-xl cursor-pointer text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 focus:bg-rose-50 dark:focus:bg-rose-500/10 transition-colors"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span>Secure Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        <main className="p-4 md:p-10 flex-1">
          <div className="mx-auto max-w-7xl animate-in fade-in slide-in-from-bottom-6 duration-1000">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

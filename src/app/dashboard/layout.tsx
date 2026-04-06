"use client";

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useStore } from '@/store/useStore';
import Sidebar from '@/components/layout/Sidebar';
import { Search, Bell, Moon, Sun, User } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useStore();
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    setMounted(true);
    if (!user) {
      router.push('/login');
    }
    // Check initial system preference or stored preference
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

  if (!mounted || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white dark:bg-slate-950">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  const pageTitle = pathname.split('/').pop()?.replace(/-/g, ' ') || 'Dashboard';

  return (
    <div className="flex min-h-screen bg-[#FDFDFD] dark:bg-slate-950">
      <Sidebar />
      <div className="flex-1 ml-64 transition-all duration-300">
        <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b bg-white/80 dark:bg-slate-950/80 px-8 backdrop-blur-xl">
          <div className="flex items-center gap-8">
            <h2 className="text-xl font-bold capitalize text-slate-900 dark:text-white tracking-tight">{pageTitle}</h2>
            <div className="hidden md:flex relative w-64 lg:w-96">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input 
                placeholder="Search resources..." 
                className="pl-10 h-10 bg-slate-100 dark:bg-slate-900 border-none rounded-xl focus-visible:ring-1 focus-visible:ring-primary/20" 
              />
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleTheme}
              className="rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
            >
              {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </Button>
            
            <Button variant="ghost" size="icon" className="relative rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors">
              <Bell className="h-5 w-5" />
              <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-accent ring-2 ring-white dark:ring-slate-950"></span>
            </Button>

            <div className="h-8 w-[1px] bg-slate-200 dark:bg-slate-800 mx-2"></div>
            
            <div className="flex items-center gap-3 pl-2">
               <Avatar className="h-10 w-10 ring-2 ring-primary/5 transition-all hover:scale-105">
                 <AvatarFallback className="bg-primary text-white text-xs font-black">
                   {user.name?.[0].toUpperCase()}
                 </AvatarFallback>
               </Avatar>
               <div className="hidden sm:block text-left">
                 <p className="text-sm font-bold leading-none dark:text-white">{user.name}</p>
                 <p className="text-[10px] text-slate-500 font-bold uppercase mt-1 tracking-wider">{user.role}</p>
               </div>
            </div>
          </div>
        </header>
        <main className="p-8">
          <div className="mx-auto max-w-7xl animate-in fade-in slide-in-from-bottom-3 duration-700">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
"use client";

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useStore } from '@/store/useStore';
import Sidebar from '@/components/layout/Sidebar';
import { Search, Bell, Moon, Sun, User, Settings } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

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
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  const pageTitle = pathname.split('/').pop()?.replace(/-/g, ' ') || 'Overview';

  return (
    <div className="flex min-h-screen bg-[#FDFDFD] dark:bg-slate-950 transition-colors duration-300">
      <Sidebar />
      <div className="flex-1 ml-64 transition-all duration-300 overflow-x-hidden">
        <header className="sticky top-0 z-40 flex h-20 items-center justify-between border-b border-slate-100 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 px-10 backdrop-blur-xl">
          <div className="flex items-center gap-12">
            <h2 className="text-lg font-black capitalize text-slate-900 dark:text-white tracking-tight">{pageTitle}</h2>
            <div className="hidden lg:flex relative w-80">
              <Search className="absolute left-4 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
              <Input 
                placeholder="Universal Search..." 
                className="pl-11 h-10 bg-slate-100/50 dark:bg-slate-900 border-none rounded-xl text-xs font-bold focus-visible:ring-1 focus-visible:ring-primary/20 transition-all placeholder:text-slate-400" 
              />
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center bg-slate-100 dark:bg-slate-900 p-1 rounded-xl border border-slate-200/50 dark:border-slate-800">
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
              <Button variant="ghost" size="icon" className="rounded-xl text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 transition-all">
                <Settings className="h-4 w-4" />
              </Button>
            </div>

            <div className="h-6 w-[1px] bg-slate-200 dark:bg-slate-800 mx-2"></div>
            
            <div className="flex items-center gap-3 pl-2">
               <Avatar className="h-9 w-9 ring-4 ring-primary/5 transition-all hover:scale-105 active:scale-95 shadow-sm">
                 <AvatarFallback className="bg-primary text-white text-[10px] font-black uppercase">
                   {user.name?.[0].toUpperCase()}
                 </AvatarFallback>
               </Avatar>
               <div className="hidden sm:block text-left">
                 <p className="text-xs font-black leading-none dark:text-white">{user.name}</p>
                 <p className="text-[9px] text-slate-400 font-black uppercase mt-1 tracking-widest">{user.role}</p>
               </div>
            </div>
          </div>
        </header>
        <main className="p-10">
          <div className="mx-auto max-w-7xl animate-in fade-in slide-in-from-bottom-6 duration-1000">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

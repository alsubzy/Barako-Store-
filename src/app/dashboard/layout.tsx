"use client";

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useStore } from '@/store/useStore';
import Sidebar from '@/components/layout/Sidebar';
import { Search, Bell, User } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  if (!mounted || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  const pageTitle = pathname.split('/').pop()?.replace(/-/g, ' ') || 'Dashboard';

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      <Sidebar />
      <div className="flex-1 ml-64 transition-all duration-300">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-white/80 px-8 backdrop-blur-md">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-bold capitalize text-slate-900">{pageTitle}</h2>
            <div className="hidden md:flex relative w-64 lg:w-96">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input 
                placeholder="Search..." 
                className="pl-10 h-9 bg-slate-50 border-none rounded-lg focus-visible:ring-1 focus-visible:ring-primary/20" 
              />
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="relative rounded-full p-2 text-slate-400 hover:bg-slate-50 hover:text-primary transition-colors">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-accent ring-2 ring-white"></span>
            </button>
            <div className="h-8 w-[1px] bg-slate-200 mx-2"></div>
            <div className="flex items-center gap-2">
               <Avatar className="h-8 w-8 ring-2 ring-primary/10">
                 <AvatarFallback className="bg-primary text-white text-[10px] font-bold">
                   {user.name?.[0].toUpperCase()}
                 </AvatarFallback>
               </Avatar>
               <div className="hidden sm:block text-left">
                 <p className="text-xs font-bold leading-none">{user.name}</p>
                 <p className="text-[10px] text-slate-500 font-medium capitalize mt-1">{user.role}</p>
               </div>
            </div>
          </div>
        </header>
        <main className="p-8">
          <div className="mx-auto max-w-7xl animate-in fade-in slide-in-from-bottom-2 duration-500">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
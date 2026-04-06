"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/store/useStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { ShoppingCart, Eye, EyeOff, ArrowUpRight } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

export default function LoginPage() {
  const [email, setEmail] = useState('admin@barakostore.com');
  const [password, setPassword] = useState('password');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useStore();
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      if (email.includes('admin')) {
        login(email, 'admin');
      } else {
        login(email, 'staff');
      }
      setLoading(false);
      toast({
        title: "Login Successful",
        description: `Welcome back to Barako Store!`,
      });
      router.push('/dashboard');
    }, 1000);
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-white p-6 font-body">
      <div className="w-full max-w-[440px] space-y-8">
        {/* Branded Logo/Title Section */}
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-white shadow-lg shadow-primary/20">
              <ShoppingCart className="h-7 w-7" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight">
            <span className="text-primary">Barako</span>
            <span className="ml-2 text-slate-900">Store</span>
          </h1>
          <p className="text-slate-500 font-medium">Management & POS System</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-[32px] p-8 md:p-10 border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.05)] transition-all">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Email Address</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="admin@barakostore.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
                className="h-12 border-slate-200 bg-slate-50/50 rounded-2xl text-slate-900 focus-visible:ring-primary focus-visible:ring-offset-0 px-4 transition-all"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between ml-1">
                <Label htmlFor="password" className="text-xs font-bold uppercase tracking-widest text-slate-500">Password</Label>
                <button type="button" className="text-xs font-bold text-primary hover:underline">Forgot?</button>
              </div>
              <div className="relative">
                <Input 
                  id="password" 
                  type={showPassword ? "text" : "password"} 
                  placeholder="••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                  className="h-12 border-slate-200 bg-slate-50/50 rounded-2xl text-slate-900 focus-visible:ring-primary focus-visible:ring-offset-0 pr-12 px-4 transition-all"
                />
                <button 
                  type="button" 
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-2 ml-1">
              <Checkbox id="remember" className="rounded-md border-slate-300 data-[state=checked]:bg-primary" />
              <Label htmlFor="remember" className="text-xs font-bold text-slate-600 cursor-pointer">Stay signed in for 30 days</Label>
            </div>

            <Button 
              type="submit" 
              className="h-14 w-full rounded-2xl bg-primary text-white font-bold text-lg shadow-xl shadow-primary/20 hover:scale-[1.01] active:scale-[0.98] transition-all" 
              disabled={loading}
            >
              {loading ? "Authenticating..." : "Sign In to Dashboard"}
            </Button>
          </form>

          <div className="mt-8 pt-8 border-t border-slate-50 text-center">
            <div className="space-y-4">
              <p className="text-xs font-black text-slate-300 uppercase tracking-[0.2em]">Demo Credentials</p>
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50/50 border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Admin</span>
                  <span className="text-xs font-bold text-slate-600">admin@barakostore.com</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50/50 border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Staff</span>
                  <span className="text-xs font-bold text-slate-600">staff@barakostore.com</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <p className="text-center text-sm font-medium text-slate-400">
          Need technical support? <button className="text-primary font-bold hover:underline">Contact help desk</button>
        </p>
      </div>
    </div>
  );
}

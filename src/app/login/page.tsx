"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/store/useStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Eye, EyeOff, ArrowUpRight } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

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
    <div className="flex min-h-screen flex-col items-center justify-center bg-white p-6 font-body text-slate-900">
      <div className="w-full max-w-[440px] space-y-12">
        {/* Logo Section */}
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-black tracking-tight flex items-center justify-center">
            <span className="text-primary">Barako</span>
            <span className="ml-2 text-accent">Store</span>
          </h1>
          <p className="text-slate-500 font-medium text-lg">Management & POS System</p>
        </div>

        {/* Form Section */}
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-bold text-slate-600">Email</Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="mail@example.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
              className="h-14 border-slate-200 bg-white rounded-2xl text-slate-900 focus-visible:ring-primary focus-visible:ring-offset-0 px-4 transition-all"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-bold text-slate-600">Password</Label>
            <div className="relative">
              <Input 
                id="password" 
                type={showPassword ? "text" : "password"} 
                placeholder="Min. 8 characters" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
                className="h-14 border-slate-200 bg-white rounded-2xl text-slate-900 focus-visible:ring-primary focus-visible:ring-offset-0 pr-12 px-4 transition-all"
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

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Checkbox id="remember" className="rounded-full border-slate-300 data-[state=checked]:bg-primary" />
              <Label htmlFor="remember" className="text-sm font-bold text-slate-500 cursor-pointer">Remember Me</Label>
            </div>
            <button type="button" className="text-sm font-bold text-primary hover:underline">Forgot Password?</button>
          </div>

          <Button 
            type="submit" 
            className="h-14 w-full rounded-2xl bg-primary text-white font-bold text-lg shadow-xl shadow-primary/20 hover:scale-[1.01] active:scale-[0.98] transition-all" 
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </Button>
        </form>

        {/* Footer Links */}
        <div className="text-center">
          <p className="text-sm font-bold text-slate-500">
            Not registered yet? <button className="text-primary font-bold hover:underline inline-flex items-center">Create an account <ArrowUpRight className="ml-1 h-3 w-3" /></button>
          </p>
        </div>
      </div>

      {/* Copyright Footer */}
      <div className="absolute bottom-8 w-full text-center">
        <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">
          © 2026 BARAKO STORE MANAGEMENT SYSTEM
        </p>
      </div>
    </div>
  );
}

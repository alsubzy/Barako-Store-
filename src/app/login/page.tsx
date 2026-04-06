
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
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-[#E6E8FF] p-4 font-body">
      {/* Main White Card Container */}
      <div className="w-full max-w-[1200px] rounded-[24px] bg-white shadow-2xl shadow-indigo-200/50 overflow-hidden flex flex-col min-h-[800px]">
        
        {/* Top Navigation / Logo Area */}
        <header className="flex h-24 items-center px-12 border-b border-slate-50">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#3338A0] text-white">
              <ShoppingCart className="h-5 w-5" />
            </div>
            <div className="text-xl font-black tracking-tight">
              <span className="text-[#3338A0]">Barako</span>
              <span className="ml-1 text-[#444]">Store</span>
            </div>
          </div>
        </header>

        {/* Center Login Content */}
        <main className="flex-1 flex flex-col items-center justify-center py-12 px-6">
          <div className="w-full max-w-[420px] space-y-8">
            <div className="text-center md:text-left mb-4">
              <h1 className="text-[40px] font-bold text-slate-900 leading-tight">Login</h1>
            </div>

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-semibold text-slate-700">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="mail@example.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                  className="h-12 border-slate-200 bg-white rounded-xl text-slate-900 focus-visible:ring-primary focus-visible:ring-offset-0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-semibold text-slate-700">Password</Label>
                <div className="relative">
                  <Input 
                    id="password" 
                    type={showPassword ? "text" : "password"} 
                    placeholder="Min. 8 characters" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required 
                    className="h-12 border-slate-200 bg-white rounded-xl text-slate-900 focus-visible:ring-primary focus-visible:ring-offset-0 pr-12"
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
                  <Checkbox id="remember" className="rounded-md border-slate-300 data-[state=checked]:bg-primary" />
                  <Label htmlFor="remember" className="text-sm font-medium text-slate-600 cursor-pointer">Remember Me</Label>
                </div>
                <button type="button" className="text-sm font-bold text-[#3338A0] hover:underline">Forgot Password?</button>
              </div>

              <Button 
                type="submit" 
                className="h-12 w-full rounded-xl bg-[#3338A0] text-white font-bold text-base shadow-xl shadow-indigo-100 hover:bg-[#2a2e85] active:scale-[0.98] transition-all" 
                disabled={loading}
              >
                {loading ? "Signing in..." : "Login"}
              </Button>
            </form>

            <div className="text-center pt-2">
              <p className="text-sm font-medium text-slate-500">
                Not registered yet? <button className="text-[#3338A0] font-bold hover:underline inline-flex items-center">Create an account <ArrowUpRight className="ml-1 h-3 w-3" /></button>
              </p>
            </div>
          </div>
        </main>

        <footer className="h-20 flex items-center justify-center border-t border-slate-50 text-[11px] text-slate-300 font-bold uppercase tracking-widest">
          &copy; {new Date().getFullYear()} Barako Store Management System
        </footer>
      </div>
    </div>
  );
}

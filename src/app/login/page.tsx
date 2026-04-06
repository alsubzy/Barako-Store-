
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
import Image from 'next/image';

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
            <div className="text-center md:text-left">
              <h1 className="text-[40px] font-bold text-slate-900 leading-tight">Login</h1>
              <p className="text-slate-500 font-medium mt-1">Hi, Welcome back 👋</p>
            </div>

            {/* Social Login */}
            <Button 
              variant="outline" 
              className="w-full h-12 rounded-xl border-slate-200 text-slate-700 font-semibold flex items-center justify-center gap-3 hover:bg-slate-50 transition-colors"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Login with Google
            </Button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-slate-100"></span>
              </div>
              <div className="relative flex justify-center text-[11px] font-bold uppercase tracking-widest text-slate-300">
                <span className="bg-white px-4">or Login with Email</span>
              </div>
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

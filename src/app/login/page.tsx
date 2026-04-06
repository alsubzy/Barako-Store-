"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/store/useStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { ShoppingCart, Eye, EyeOff } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import Image from 'next/image';

export default function LoginPage() {
  const [email, setEmail] = useState('admin@marketflow.com');
  const [password, setPassword] = useState('password');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useStore();
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
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
    <div className="flex min-h-screen w-full overflow-hidden bg-white font-body">
      {/* Left Section - Form Container */}
      <div className="relative flex w-full flex-col items-center justify-center bg-white lg:w-3/5">
        {/* Abstract background shapes similar to sample */}
        <div className="absolute left-0 top-0 h-32 w-32 bg-primary/5 rounded-br-full" />
        <div className="absolute bottom-0 left-0 h-48 w-48 bg-primary/5 rounded-tr-full" />
        
        <div className="z-10 w-full max-w-md px-8">
          <div className="mb-12 flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-white shadow-lg">
              <ShoppingCart className="h-6 w-6" />
            </div>
            <div className="text-2xl font-black">
              <span className="text-primary">Barako</span>
              <span className="ml-1 text-[#444]">Store</span>
            </div>
          </div>

          <h1 className="mb-8 text-2xl font-bold text-slate-900">Nice to see you again</h1>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs font-semibold text-slate-500">User ID or phone number</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="Email or phone number" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
                className="h-12 border-slate-100 bg-slate-50/50 rounded-lg text-slate-900 focus:ring-primary/20"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-xs font-semibold text-slate-500">Password</Label>
              <div className="relative">
                <Input 
                  id="password" 
                  type={showPassword ? "text" : "password"} 
                  placeholder="Enter password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                  className="h-12 border-slate-100 bg-slate-50/50 rounded-lg text-slate-900 focus:ring-primary/20 pr-10"
                />
                <button 
                  type="button" 
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Switch id="remember" />
                <Label htmlFor="remember" className="text-sm font-medium text-slate-600">Remember me</Label>
              </div>
              <button type="button" className="text-sm font-medium text-blue-500 hover:underline">Forgot password?</button>
            </div>

            <Button 
              type="submit" 
              className="h-12 w-full rounded-lg bg-blue-500 text-white font-bold text-base shadow-lg shadow-blue-500/20 hover:bg-blue-600 active:scale-[0.98] transition-all" 
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign in"}
            </Button>
          </form>

          <p className="mt-8 text-center text-sm font-medium text-slate-600">
            Dont have an account? <button className="text-blue-500 hover:underline">Sign up now</button>
          </p>
        </div>
      </div>

      {/* Right Section - Branded Image/Message Area */}
      <div className="relative hidden w-2/5 flex-col items-center justify-center bg-primary lg:flex">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0 opacity-40">
          <Image 
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop" 
            alt="City Backdrop" 
            fill 
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-primary/60 mix-blend-multiply" />
        </div>

        {/* Content */}
        <div className="relative z-10 px-12 text-center text-white">
          <div className="mb-12 flex justify-center opacity-40">
            <div className="flex items-center gap-2">
              <ShoppingCart className="h-8 w-8" />
              <div className="text-2xl font-black">Barako Store</div>
            </div>
          </div>
          
          <h2 className="mb-4 text-4xl font-bold leading-tight">
            Let's make every day <br /> Meaningful together.
          </h2>
          <p className="text-lg font-medium text-white/80">
            "Building meaningful experiences together."
          </p>
        </div>

        {/* Floating Logo Decoration similar to Sample */}
        <div className="absolute right-0 top-12 h-40 w-40 translate-x-1/2 opacity-10">
          <div className="h-full w-full rounded-full border-8 border-white" />
        </div>
      </div>
    </div>
  );
}

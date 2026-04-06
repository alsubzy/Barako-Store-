"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/store/useStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingCart, LogIn, Lock, Mail } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

export default function LoginPage() {
  const [email, setEmail] = useState('admin@marketflow.com');
  const [password, setPassword] = useState('password');
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
    <div className="flex min-h-screen items-center justify-center bg-[#F8FAFC] p-6">
      <div className="w-full max-w-lg space-y-12">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-primary text-white shadow-2xl shadow-primary/30 ring-8 ring-primary/10">
            <ShoppingCart className="h-10 w-10" />
          </div>
          <h1 className="text-4xl font-black tracking-tight text-primary">Barako <span className="text-accent">Store</span></h1>
          <p className="mt-4 text-slate-500 font-bold max-w-xs">Elevate your grocery business with professional management.</p>
        </div>

        <Card className="border-none shadow-[0_20px_50px_rgba(0,0,0,0.05)] rounded-[2.5rem] overflow-hidden bg-white">
          <CardHeader className="space-y-2 p-10 pb-2">
            <CardTitle className="text-3xl font-black text-slate-900 text-center">Sign in</CardTitle>
            <CardDescription className="text-slate-400 font-bold text-center">Enter your workspace credentials</CardDescription>
          </CardHeader>
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-6 p-10 pb-6">
              <div className="space-y-3">
                <Label htmlFor="email" className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300" />
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="admin@marketflow.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required 
                    className="h-14 pl-12 bg-slate-50 border-none rounded-2xl font-bold text-slate-900 focus:ring-2 focus:ring-primary/10 transition-all"
                  />
                </div>
              </div>
              <div className="space-y-3">
                <Label htmlFor="password" className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Secure Password</Label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300" />
                  <Input 
                    id="password" 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required 
                    className="h-14 pl-12 bg-slate-50 border-none rounded-2xl font-bold text-slate-900 focus:ring-2 focus:ring-primary/10 transition-all"
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-6 p-10 pt-4">
              <Button type="submit" className="w-full h-14 rounded-2xl bg-primary text-white font-black text-lg shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all" disabled={loading}>
                {loading ? "Authenticating..." : (
                  <>
                    <LogIn className="mr-2 h-5 w-5" /> Sign In to Workspace
                  </>
                )}
              </Button>
              <div className="text-center">
                <p className="text-xs font-black text-slate-300 uppercase tracking-widest mb-2">Demo Access</p>
                <div className="flex gap-2 justify-center">
                   <Badge variant="secondary" className="bg-slate-50 text-slate-400 border-none px-3 py-1 font-bold">admin@marketflow.com</Badge>
                   <Badge variant="secondary" className="bg-slate-50 text-slate-400 border-none px-3 py-1 font-bold">password</Badge>
                </div>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}


"use client";

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User, UserRole, UserStatus } from '@/types/user';
import { Loader2, User as UserIcon, Mail, Shield, CheckCircle2, X, Lock } from 'lucide-react';

interface UserFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<User, 'id' | 'createdAt' | 'lastLogin'>) => Promise<void>;
  initialData?: User | null;
}

export function UserFormModal({ isOpen, onClose, onSubmit, initialData }: UserFormModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Omit<User, 'id' | 'createdAt' | 'lastLogin'>>({
    name: '',
    email: '',
    password: '',
    role: 'Staff',
    status: 'Active',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        email: initialData.email,
        password: '',
        role: initialData.role,
        status: initialData.status,
      });
    } else {
      setFormData({
        name: '',
        email: '',
        password: '',
        role: 'Staff',
        status: 'Active',
      });
    }
  }, [initialData, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // If editing and password is empty, don't send it
      const submissionData = { ...formData };
      if (initialData && !formData.password) {
        delete submissionData.password;
      }
      await onSubmit(submissionData);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[540px] rounded-[2.5rem] overflow-hidden p-0 border-none shadow-2xl dark:bg-slate-900 bg-white animate-in zoom-in duration-300">
        <div className="bg-slate-50 dark:bg-slate-800/50 p-10 border-b border-slate-100 dark:border-slate-800 relative">
          <div className="flex items-center gap-4 mb-3">
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
               <Shield className="h-5 w-5" />
            </div>
            <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Identity Management</span>
          </div>
          <DialogHeader>
            <DialogTitle className="text-3xl font-black text-slate-900 dark:text-white">
              {initialData ? 'Update Account' : 'Provision User'}
            </DialogTitle>
            <p className="text-sm font-medium text-slate-500 mt-2">Grant specific access levels and manage platform identities across your locations.</p>
          </DialogHeader>
          <button onClick={onClose} className="absolute top-8 right-8 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors">
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-10 space-y-10 bg-white dark:bg-slate-900">
          <div className="space-y-8">
            <div className="space-y-3">
              <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Full Name</Label>
              <div className="relative group">
                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 group-focus-within:text-primary transition-colors" />
                <Input 
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="h-14 bg-slate-50/50 dark:bg-slate-800 border-none rounded-2xl font-bold pl-12 focus-visible:ring-primary/20 placeholder:text-slate-300 transition-all"
                  placeholder="e.g. Marcus Aurelius"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-3">
              <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Email Identifier</Label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 group-focus-within:text-primary transition-colors" />
                <Input 
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="h-14 bg-slate-50/50 dark:bg-slate-800 border-none rounded-2xl font-bold pl-12 focus-visible:ring-primary/20 placeholder:text-slate-300 transition-all"
                  placeholder="name@barakostore.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Access Credentials</Label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 group-focus-within:text-primary transition-colors" />
                <Input 
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="h-14 bg-slate-50/50 dark:bg-slate-800 border-none rounded-2xl font-bold pl-12 focus-visible:ring-primary/20 placeholder:text-slate-300 transition-all"
                  placeholder={initialData ? "Leave empty to keep current" : "Secure Password"}
                  required={!initialData}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Permission Tier</Label>
                <Select value={formData.role} onValueChange={(v) => setFormData({ ...formData, role: v as UserRole })}>
                  <SelectTrigger className="h-14 bg-slate-50/50 dark:bg-slate-800 border-none rounded-2xl font-bold focus:ring-primary/20 transition-all">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border-none shadow-2xl dark:bg-slate-800 bg-white p-2">
                    <SelectItem value="Admin" className="rounded-xl font-bold py-3 px-4 transition-colors focus:bg-primary/5 focus:text-primary cursor-pointer">Admin Access</SelectItem>
                    <SelectItem value="Manager" className="rounded-xl font-bold py-3 px-4 transition-colors focus:bg-primary/5 focus:text-primary cursor-pointer">Store Manager</SelectItem>
                    <SelectItem value="Staff" className="rounded-xl font-bold py-3 px-4 transition-colors focus:bg-primary/5 focus:text-primary cursor-pointer">Field Staff</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-3">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Activation State</Label>
                <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v as UserStatus })}>
                  <SelectTrigger className="h-14 bg-slate-50/50 dark:bg-slate-800 border-none rounded-2xl font-bold focus:ring-primary/20 transition-all">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border-none shadow-2xl dark:bg-slate-800 bg-white p-2">
                    <SelectItem value="Active" className="rounded-xl font-bold py-3 px-4 transition-colors focus:bg-primary/5 focus:text-primary cursor-pointer">Active System</SelectItem>
                    <SelectItem value="Inactive" className="rounded-xl font-bold py-3 px-4 transition-colors focus:bg-slate-100 cursor-pointer">Suspended</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          <DialogFooter className="pt-6 gap-4 flex-col sm:flex-row">
            <Button type="button" variant="ghost" onClick={onClose} className="h-14 flex-1 rounded-2xl font-bold text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">Discard Changes</Button>
            <Button type="submit" disabled={loading} className="h-14 flex-1 rounded-2xl bg-primary text-white shadow-2xl shadow-primary/30 font-black hover:scale-[1.02] active:scale-95 transition-all">
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : (
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5" />
                  {initialData ? 'Commit Updates' : 'Authorize User'}
                </span>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

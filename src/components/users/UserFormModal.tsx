"use client";

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User, UserRole, UserStatus } from '@/types/user';
import { Loader2, X, User as UserIcon, Mail, Key } from 'lucide-react';
import { cn } from '@/lib/utils';

interface UserFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  initialData?: User | null;
}

const ROLES: UserRole[] = ['Admin', 'Manager', 'Staff'];
const STATUSES: UserStatus[] = ['Active', 'Inactive'];

export function UserFormModal({ isOpen, onClose, onSubmit, initialData }: UserFormModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Staff' as UserRole,
    status: 'Active' as UserStatus,
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
      const submissionData = { ...formData };
      if (initialData && !formData.password) {
        delete (submissionData as any).password;
      }
      await onSubmit(submissionData);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[480px] p-8 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-card shadow-xl overflow-hidden [&>button]:hidden">
        
        {/* Header Section */}
        <div className="flex items-start justify-between mb-8">
          <div className="space-y-1">
            <DialogTitle className="text-xl font-bold text-slate-900 dark:text-white">
              {initialData ? 'Update User Account' : 'Create New User'}
            </DialogTitle>
            <DialogDescription className="text-sm text-slate-500 dark:text-slate-400">
              {initialData ? 'Modify access and permissions for this user.' : 'Enter user details to create a new account'}
            </DialogDescription>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-1"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-5">
            
            {/* Full Name */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-slate-700 dark:text-slate-200">Full Name</Label>
              <div className="relative group">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">
                  <UserIcon className="h-4 w-4" />
                </div>
                <Input 
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="h-11 w-full pl-10 bg-gray-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-lg focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary shadow-none transition-all text-slate-900 dark:text-white"
                  placeholder="e.g. Ahmed Ali"
                  required
                />
              </div>
            </div>
            
            {/* Email */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-slate-700 dark:text-slate-200">Email Address</Label>
              <div className="relative group">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">
                  <Mail className="h-4 w-4" />
                </div>
                <Input 
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="h-11 w-full pl-10 bg-gray-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-lg focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary shadow-none transition-all text-slate-900 dark:text-white"
                  placeholder="example@email.com"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-slate-700 dark:text-slate-200">
                {initialData ? 'New Password (Optional)' : 'Initial Password'}
              </Label>
              <div className="relative group">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">
                  <Key className="h-4 w-4" />
                </div>
                <Input 
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="h-11 w-full pl-10 bg-gray-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-lg focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary shadow-none transition-all text-slate-900 dark:text-white"
                  placeholder="••••••••"
                  required={!initialData}
                />
              </div>
            </div>

            {/* Role & Status */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-700 dark:text-slate-200">System Role</Label>
                <Select value={formData.role} onValueChange={(v) => setFormData({ ...formData, role: v as UserRole })}>
                  <SelectTrigger className="h-11 w-full bg-gray-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary shadow-none transition-all text-slate-900 dark:text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-lg border border-slate-200 dark:border-slate-800 shadow-xl bg-white dark:bg-card">
                    {ROLES.map(r => <SelectItem key={r} value={r} className="text-sm font-medium">{r}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-700 dark:text-slate-200">Account Status</Label>
                <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v as UserStatus })}>
                  <SelectTrigger className="h-11 w-full bg-gray-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary shadow-none transition-all text-slate-900 dark:text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-lg border border-slate-200 dark:border-slate-800 shadow-xl bg-white dark:bg-card">
                    {STATUSES.map(s => <SelectItem key={s} value={s} className="text-sm font-medium">{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>

          </div>
          
          <Button 
            type="submit" 
            disabled={loading} 
            className="h-12 w-full rounded-lg bg-[#3338A0] hover:bg-[#282D85] text-white font-bold shadow-lg shadow-primary/10 transition-all mt-4"
          >
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : initialData ? 'Save Changes' : 'Create Account'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

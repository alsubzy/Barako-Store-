"use client";

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User, UserRole, UserStatus } from '@/types/user';
import { Loader2, X, User as UserIcon, Mail, Key, Shield, Activity, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Logo } from '@/components/shared/Logo';

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
      <DialogContent className="w-[95vw] sm:max-w-[480px] p-8 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-card shadow-xl overflow-hidden [&>button]:hidden">
        
        {/* Brand/Logo Section */}
        <div className="flex flex-col items-center mb-6">
          <Logo size="md" clickable={false} />
        </div>

        {/* Header Section */}
        <div className="flex items-start justify-between mb-8">
          <div className="space-y-1">
            <DialogTitle className="text-xl font-bold text-slate-900 dark:text-white text-center sm:text-left">
              {initialData ? 'Update User Account' : 'Create New User'}
            </DialogTitle>
            <DialogDescription className="text-sm text-slate-500 dark:text-slate-400 text-center sm:text-left">
              {initialData ? 'Modify access and permissions for this user.' : 'Enter user details to create a new account'}
            </DialogDescription>
          </div>
          <Button 
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-slate-400 p-1 h-8 w-8"
            icon={X}
          />
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-5">
            
            {/* Full Name */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-slate-700 dark:text-slate-200">Full Name</Label>
              <Input 
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                icon={UserIcon}
                placeholder="Ahmed Ali"
                required
                className="h-11"
              />
            </div>
            
            {/* Email */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-slate-700 dark:text-slate-200">Email Address</Label>
              <Input 
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                icon={Mail}
                placeholder="example@email.com"
                required
                className="h-11"
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-slate-700 dark:text-slate-200">
                {initialData ? 'New Password (Optional)' : 'Initial Password'}
              </Label>
              <Input 
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                icon={Key}
                placeholder="••••••••"
                required={!initialData}
                className="h-11"
              />
            </div>

            {/* Role & Status */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-700 dark:text-slate-200">System Role</Label>
                <Select value={formData.role} onValueChange={(v) => setFormData({ ...formData, role: v as UserRole })}>
                  <SelectTrigger icon={Shield} className="h-11">
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
                  <SelectTrigger icon={Activity} className="h-11">
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
            className="w-full"
            icon={loading ? Loader2 : (initialData ? Shield : Plus)}
          >
            {loading ? 'Processing...' : (initialData ? 'Save Changes' : 'Create Account')}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

"use client";

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Customer, CustomerStatus } from '@/types/customer';
import { Loader2, X, User, Mail, Phone, MapPin, Activity, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Logo } from '@/components/shared/Logo';

interface CustomerFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Customer, 'id' | 'createdAt' | 'totalOrders' | 'totalSpent'>) => Promise<void>;
  initialData?: Customer | null;
}

export function CustomerFormModal({ isOpen, onClose, onSubmit, initialData }: CustomerFormModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Omit<Customer, 'id' | 'createdAt' | 'totalOrders' | 'totalSpent'>>({
    name: '',
    email: '',
    phone: '',
    address: '',
    status: 'Active',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        email: initialData.email,
        phone: initialData.phone || '',
        address: initialData.address || '',
        status: initialData.status,
      });
    } else {
      setFormData({
        name: '',
        email: '',
        phone: '',
        address: '',
        status: 'Active',
      });
    }
  }, [initialData, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(formData);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-[95vw] sm:max-w-lg p-0 rounded-lg border-none bg-white dark:bg-card shadow-xl overflow-hidden [&>button]:hidden">
        
        {/* Brand Section */}
        <div className="pt-8 px-6 flex justify-center border-b border-slate-50 dark:border-slate-800 pb-4">
          <Logo size="md" clickable={false} />
        </div>

        {/* Header Section */}
        <div className="flex items-start justify-between px-6 pt-6 pb-4">
          <DialogHeader className="space-y-1.5 text-left">
            <DialogTitle className="text-xl font-bold text-slate-900 dark:text-white">
              {initialData ? 'Edit Customer' : 'Add New Customer'}
            </DialogTitle>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Enter the details of the customer
            </p>
          </DialogHeader>
          <Button 
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-slate-400 p-1 h-8 w-8"
            icon={X}
          />
        </div>
        
        {/* Form Body */}
        <form onSubmit={handleSubmit}>
          <div className="px-6 pb-6 space-y-5">
            
            <div className="space-y-1.5">
              <Label className="text-sm font-bold text-slate-700 dark:text-slate-200">Name</Label>
              <Input 
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                icon={User}
                placeholder="Ahmed Ali"
                required
                className="h-11"
              />
            </div>
            
            <div className="space-y-1.5">
              <Label className="text-sm font-bold text-slate-700 dark:text-slate-200">Email</Label>
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <Label className="text-sm font-bold text-slate-700 dark:text-slate-200">Phone</Label>
                <Input 
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  icon={Phone}
                  placeholder="+252..."
                  className="h-11"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-sm font-bold text-slate-700 dark:text-slate-200">Status</Label>
                <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v as CustomerStatus })}>
                  <SelectTrigger icon={Activity} className="h-11">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-md border border-slate-200 dark:border-slate-800 shadow-lg bg-white dark:bg-card">
                    <SelectItem value="Active" className="text-sm">Active</SelectItem>
                    <SelectItem value="Inactive" className="text-sm">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm font-bold text-slate-700 dark:text-slate-200">Address</Label>
              <Input 
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                icon={MapPin}
                placeholder="Customer address..."
                className="h-11"
              />
            </div>

          </div>
          
          {/* Footer Section */}
          <div className="px-6 py-4 bg-white dark:bg-card border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3 flex-col sm:flex-row">
            <Button 
              type="button" 
              variant="secondary" 
              onClick={onClose} 
              icon={X}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={loading} 
              icon={loading ? Loader2 : (initialData ? User : Plus)}
              className="w-full sm:w-auto"
            >
              {loading ? 'Processing...' : (initialData ? 'Save Changes' : 'Add Customer')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

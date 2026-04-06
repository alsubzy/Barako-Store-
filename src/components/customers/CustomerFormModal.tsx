
"use client";

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Customer, CustomerStatus } from '@/types/customer';
import { Loader2, User } from 'lucide-react';

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
      <DialogContent className="sm:max-w-[500px] rounded-3xl overflow-hidden p-0 border-none shadow-2xl">
        <div className="bg-primary p-8 text-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black text-white flex items-center gap-2">
              <User className="h-6 w-6" />
              {initialData ? 'Edit Customer' : 'Add New Customer'}
            </DialogTitle>
            <p className="text-white/70 font-medium">Manage Barako Store customer profiles.</p>
          </DialogHeader>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-6 bg-white">
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Full Name</Label>
              <Input 
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="h-12 bg-slate-50 border-none rounded-xl font-bold"
                placeholder="e.g. John Doe"
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Email Address</Label>
                <Input 
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="h-12 bg-slate-50 border-none rounded-xl font-bold"
                  placeholder="john@example.com"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Phone Number</Label>
                <Input 
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="h-12 bg-slate-50 border-none rounded-xl font-bold"
                  placeholder="555-0123"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Mailing Address</Label>
              <Input 
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="h-12 bg-slate-50 border-none rounded-xl font-bold"
                placeholder="123 Street, City"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Account Status</Label>
              <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v as CustomerStatus })}>
                <SelectTrigger className="h-12 bg-slate-50 border-none rounded-xl font-bold">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-none shadow-xl">
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter className="pt-4 gap-3">
            <Button type="button" variant="ghost" onClick={onClose} className="h-12 flex-1 rounded-xl font-bold text-slate-500">Cancel</Button>
            <Button type="submit" disabled={loading} className="h-12 flex-1 rounded-xl bg-primary shadow-lg shadow-primary/20 font-bold">
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : initialData ? 'Update Profile' : 'Create Customer'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

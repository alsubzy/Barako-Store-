"use client";

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Customer, CustomerStatus } from '@/types/customer';
import { Loader2, User, Mail, Phone, MapPin, CheckCircle2, X } from 'lucide-react';

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
      <DialogContent className="sm:max-w-[540px] rounded-[2.5rem] overflow-hidden p-0 border-none shadow-2xl dark:bg-slate-900 bg-white animate-in zoom-in duration-300">
        <div className="bg-slate-50 dark:bg-slate-800/50 p-10 border-b border-slate-100 dark:border-slate-800 relative">
          <div className="flex items-center gap-4 mb-3">
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
               <User className="h-5 w-5" />
            </div>
            <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Customer Registration</span>
          </div>
          <DialogHeader>
            <DialogTitle className="text-3xl font-black text-slate-900 dark:text-white">
              {initialData ? 'Update Profile' : 'Register Customer'}
            </DialogTitle>
            <p className="text-sm font-medium text-slate-500 mt-2">Maintain accurate customer records to drive engagement and monitor lifetime value.</p>
          </DialogHeader>
          <button onClick={onClose} className="absolute top-8 right-8 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors">
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-10 space-y-10 bg-white dark:bg-slate-900">
          <div className="space-y-8">
            <div className="space-y-3">
              <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Customer Full Name</Label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 group-focus-within:text-primary transition-colors" />
                <Input 
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="h-14 bg-slate-50/50 dark:bg-slate-800 border-none rounded-2xl font-bold pl-12 focus-visible:ring-primary/20 placeholder:text-slate-300 transition-all"
                  placeholder="e.g. Sebastian Varela"
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Work Email</Label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 group-focus-within:text-primary transition-colors" />
                  <Input 
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="h-14 bg-slate-50/50 dark:bg-slate-800 border-none rounded-2xl font-bold pl-12 focus-visible:ring-primary/20 placeholder:text-slate-300 transition-all"
                    placeholder="name@email.com"
                    required
                  />
                </div>
              </div>
              <div className="space-y-3">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Phone Line</Label>
                <div className="relative group">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 group-focus-within:text-primary transition-colors" />
                  <Input 
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="h-14 bg-slate-50/50 dark:bg-slate-800 border-none rounded-2xl font-bold pl-12 focus-visible:ring-primary/20 placeholder:text-slate-300 transition-all"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Mailing Address</Label>
              <div className="relative group">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 group-focus-within:text-primary transition-colors" />
                <Input 
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="h-14 bg-slate-50/50 dark:bg-slate-800 border-none rounded-2xl font-bold pl-12 focus-visible:ring-primary/20 placeholder:text-slate-300 transition-all"
                  placeholder="Street, City, Country"
                />
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Account Status</Label>
              <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v as CustomerStatus })}>
                <SelectTrigger className="h-14 bg-slate-50/50 dark:bg-slate-800 border-none rounded-2xl font-bold focus:ring-primary/20 transition-all">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-2xl border-none shadow-2xl dark:bg-slate-800 bg-white p-2">
                  <SelectItem value="Active" className="rounded-xl font-bold py-3 px-4 transition-colors focus:bg-primary/5 focus:text-primary cursor-pointer">Active Relationship</SelectItem>
                  <SelectItem value="Inactive" className="rounded-xl font-bold py-3 px-4 transition-colors focus:bg-slate-100 cursor-pointer">On-Hold / Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter className="pt-6 gap-4 flex-col sm:flex-row">
            <Button type="button" variant="ghost" onClick={onClose} className="h-14 flex-1 rounded-2xl font-bold text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">Discard Changes</Button>
            <Button type="submit" disabled={loading} className="h-14 flex-1 rounded-2xl bg-primary text-white shadow-2xl shadow-primary/30 font-black hover:scale-[1.02] active:scale-95 transition-all">
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : (
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5" />
                  {initialData ? 'Save Changes' : 'Complete Registration'}
                </span>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

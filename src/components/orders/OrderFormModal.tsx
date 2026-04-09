"use client";

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Order, OrderStatus } from '@/types/order';
import { Product } from '@/types/product';
import { productsAPI } from '@/services/productsAPI';
import { Loader2, Plus, Trash2, X, ShoppingBag, User, Activity, Package, Layers } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Logo } from '@/components/shared/Logo';

interface OrderFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  initialData?: Order | null;
}

const STATUSES: OrderStatus[] = ['Pending', 'Processing', 'Completed', 'Cancelled'];

export function OrderFormModal({ isOpen, onClose, onSubmit, initialData }: OrderFormModalProps) {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [formData, setFormData] = useState({
    customerName: '',
    status: 'Pending' as OrderStatus,
    items: [] as { productId: string; quantity: number }[]
  });

  useEffect(() => {
    const fetchProducts = async () => {
      const res = await productsAPI.getAll();
      if (res.success) setProducts(res.data || []);
    };
    if (isOpen) fetchProducts();
  }, [isOpen]);

  useEffect(() => {
    if (initialData) {
      setFormData({
        customerName: initialData.customerName,
        status: initialData.status,
        items: initialData.items.map(i => ({ productId: i.productId, quantity: i.quantity }))
      });
    } else {
      setFormData({ customerName: '', status: 'Pending', items: [{ productId: '', quantity: 1 }] });
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

  const addItem = () => {
    setFormData({ ...formData, items: [...formData.items, { productId: '', quantity: 1 }] });
  };

  const removeItem = (index: number) => {
    setFormData({ ...formData, items: formData.items.filter((_, i) => i !== index) });
  };

  const updateItem = (index: number, field: string, value: any) => {
    const newItems = [...formData.items];
    newItems[index] = { ...newItems[index], [field]: value };
    setFormData({ ...formData, items: newItems });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-[95vw] sm:max-w-xl p-0 rounded-lg border-none bg-white dark:bg-card shadow-xl overflow-hidden [&>button]:hidden">
        
        {/* Brand Section */}
        <div className="pt-8 px-6 flex justify-center border-b border-slate-50 dark:border-slate-800 pb-4">
          <Logo size="md" clickable={false} />
        </div>

        {/* Header Section */}
        <div className="flex items-start justify-between px-6 pt-6 pb-4">
          <DialogHeader className="space-y-1.5 text-left">
            <DialogTitle className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 text-primary" />
              {initialData ? 'Update Order' : 'Create New Order'}
            </DialogTitle>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Enter the details of the order transaction.
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
        
        <form onSubmit={handleSubmit}>
          <div className="px-6 pb-6 space-y-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <Label className="text-sm font-bold text-slate-700 dark:text-slate-200">Customer Name</Label>
                <Input 
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  icon={User}
                  placeholder="Ahmed Ali"
                  required
                  className="h-11"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-sm font-bold text-slate-700 dark:text-slate-200">Status</Label>
                <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v as OrderStatus })}>
                  <SelectTrigger icon={Activity} className="h-11">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border border-slate-200 dark:border-slate-800 shadow-lg bg-white dark:bg-card">
                    {STATUSES.map(s => <SelectItem key={s} value={s} className="text-sm">{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-bold text-slate-700 dark:text-slate-200">Order Items</Label>
                <Button type="button" variant="outline" size="sm" icon={Plus} onClick={addItem} className="h-9">
                  Add Product
                </Button>
              </div>

              <div className="space-y-3">
                {formData.items.map((item, index) => (
                  <div key={index} className="flex gap-3 items-end p-4 bg-slate-50/50 dark:bg-background/50 border border-slate-100 dark:border-slate-800 rounded-lg relative group transition-all hover:border-primary/30">
                    <div className="flex-1 space-y-1.5">
                      <Label className="text-[11px] font-bold text-slate-500 uppercase">Product</Label>
                      <Select 
                        value={item.productId} 
                        onValueChange={(v) => updateItem(index, 'productId', v)}
                      >
                        <SelectTrigger icon={Package} className="h-10">
                          <SelectValue placeholder="Select product" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border border-slate-200 dark:border-slate-800 shadow-lg bg-white dark:bg-card">
                          {products.map(p => (
                            <SelectItem key={p.id} value={p.id} disabled={p.stock <= 0} className="text-sm">
                              <span className="font-medium">{p.name}</span>
                              <span className="ml-2 text-xs text-slate-400">(${p.price}) • {p.stock} left</span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="w-20 sm:w-24 space-y-1.5">
                      <Label className="text-[11px] font-bold text-slate-500 uppercase">Qty</Label>
                      <Input 
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 0)}
                        icon={Layers}
                        className="h-10 text-center font-medium"
                      />
                    </div>

                    {formData.items.length > 1 && (
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="icon" 
                        icon={Trash2}
                        onClick={() => removeItem(index)}
                        className="h-10 w-10 text-slate-400 hover:text-destructive hover:bg-destructive/5"
                      />
                    )}
                  </div>
                ))}
              </div>
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
              icon={loading ? Loader2 : ShoppingBag}
              className="w-full sm:w-auto"
            >
              {loading ? 'Processing...' : (initialData ? 'Update Order' : 'Place Order')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

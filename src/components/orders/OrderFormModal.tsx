
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
import { Loader2, Plus, Trash2, ShoppingBag } from 'lucide-react';

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
      <DialogContent className="sm:max-w-[600px] rounded-3xl overflow-hidden p-0 border-none shadow-2xl">
        <div className="bg-primary p-8 text-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black text-white flex items-center gap-2">
              <ShoppingBag className="h-6 w-6" />
              {initialData ? 'Update Order' : 'Create New Order'}
            </DialogTitle>
            <p className="text-white/70 font-medium">Process customer transactions and manage status.</p>
          </DialogHeader>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-6 bg-white max-h-[70vh] overflow-y-auto">
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Customer Name</Label>
                <Input 
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  className="h-12 bg-slate-50 border-none rounded-xl font-bold"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Order Status</Label>
                <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v as OrderStatus })}>
                  <SelectTrigger className="h-12 bg-slate-50 border-none rounded-xl font-bold">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-none shadow-xl">
                    {STATUSES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Order Items</Label>
                <Button type="button" variant="outline" size="sm" onClick={addItem} className="h-8 rounded-lg border-primary text-primary hover:bg-primary/5 font-bold">
                  <Plus className="h-3 w-3 mr-1" /> Add Product
                </Button>
              </div>

              {formData.items.map((item, index) => (
                <div key={index} className="flex gap-3 items-end p-4 bg-slate-50 rounded-2xl relative group">
                  <div className="flex-1 space-y-1">
                    <Label className="text-[10px] font-bold text-slate-400">Product</Label>
                    <Select 
                      value={item.productId} 
                      onValueChange={(v) => updateItem(index, 'productId', v)}
                    >
                      <SelectTrigger className="h-10 bg-white border-slate-100 rounded-lg font-bold">
                        <SelectValue placeholder="Select product" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl border-none shadow-xl">
                        {products.map(p => (
                          <SelectItem key={p.id} value={p.id} disabled={p.stock <= 0}>
                            {p.name} (${p.price}) - {p.stock} {p.unit} left
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="w-24 space-y-1">
                    <Label className="text-[10px] font-bold text-slate-400">Qty</Label>
                    <Input 
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 0)}
                      className="h-10 bg-white border-slate-100 rounded-lg font-bold"
                    />
                  </div>
                  {formData.items.length > 1 && (
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => removeItem(index)}
                      className="h-10 w-10 text-destructive hover:bg-destructive/5"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          <DialogFooter className="pt-4 gap-3">
            <Button type="button" variant="ghost" onClick={onClose} className="h-12 flex-1 rounded-xl font-bold text-slate-500">Cancel</Button>
            <Button type="submit" disabled={loading} className="h-12 flex-1 rounded-xl bg-primary shadow-lg shadow-primary/20 font-bold">
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : initialData ? 'Update Order' : 'Place Order'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

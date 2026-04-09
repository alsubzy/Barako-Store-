"use client";

import { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Product } from '@/types/product';
import { 
  Loader2, 
  Package, 
  Tag, 
  DollarSign, 
  Layers, 
  Image as ImageIcon,
  CheckCircle2,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Logo } from '@/components/shared/Logo';

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Product, 'id' | 'createdAt'>) => Promise<void>;
  initialData?: Product | null;
}

const CATEGORIES = ['Fruits', 'Vegetables', 'Dairy', 'Bakery', 'Meat', 'General'];
const UNITS = ['kg', 'liter', 'piece', 'box'];

export function ProductFormModal({ isOpen, onClose, onSubmit, initialData }: ProductFormModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Omit<Product, 'id' | 'createdAt'>>({
    name: '',
    category: 'General',
    price: 0,
    stock: 0,
    unit: 'piece',
    image: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        category: initialData.category,
        price: initialData.price,
        stock: initialData.stock,
        unit: initialData.unit,
        image: initialData.image || '',
      });
    } else {
      setFormData({
        name: '',
        category: 'General',
        price: 0,
        stock: 0,
        unit: 'piece',
        image: '',
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
      <DialogContent className="w-[95vw] sm:max-w-[480px] p-0 border-none shadow-2xl overflow-hidden bg-white dark:bg-card rounded-2xl">
        {/* Brand Section */}
        <div className="pt-8 px-8 flex justify-center border-b border-slate-50 dark:border-slate-800 pb-4">
          <Logo size="md" clickable={false} />
        </div>

        {/* PREMIUM MINIMALIST HEADER */}
        <div className="px-8 pt-6 pb-4">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <div className="h-10 w-10 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-center text-primary dark:text-white">
                <Package className="h-5 w-5" />
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={onClose}
                className="h-8 w-8 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <DialogTitle className="text-xl font-bold text-slate-900 dark:text-white mt-4">
              {initialData ? 'Update Product' : 'Create New Product'}
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500 font-medium">
              Specify the details for your inventory item.
            </DialogDescription>
          </DialogHeader>
        </div>
        
        <form onSubmit={handleSubmit} className="px-8 pb-8 space-y-6">
          <div className="space-y-4">
            {/* PRODUCT NAME */}
            <div className="space-y-1.5">
              <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 ml-1">Product Name</Label>
              <Input 
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                icon={Tag}
                className="h-11 font-medium text-sm"
                placeholder="Fresh Bananas"
                required
              />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* CATEGORY */}
              <div className="space-y-1.5">
                <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 ml-1">Category</Label>
                <Select value={formData.category} onValueChange={(v) => setFormData({ ...formData, category: v })}>
                  <SelectTrigger icon={Layers} className="h-11 font-medium text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-slate-100 dark:border-slate-800 shadow-xl bg-white dark:bg-card">
                    {CATEGORIES.map(c => <SelectItem key={c} value={c} className="rounded-lg">{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              {/* UNIT */}
              <div className="space-y-1.5">
                <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 ml-1">Stock Unit</Label>
                <Select value={formData.unit} onValueChange={(v) => setFormData({ ...formData, unit: v })}>
                  <SelectTrigger icon={Package} className="h-11 font-medium text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-slate-100 dark:border-slate-800 shadow-xl bg-white dark:bg-card">
                    {UNITS.map(u => <SelectItem key={u} value={u} className="rounded-lg capitalize">{u}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* PRICE */}
              <div className="space-y-1.5">
                <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 ml-1">Price ($)</Label>
                <Input 
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                  icon={DollarSign}
                  className="h-11 font-semibold text-sm"
                  required
                />
              </div>

              {/* STOCK */}
              <div className="space-y-1.5">
                <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 ml-1">Current Stock</Label>
                <Input 
                  type="number"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
                  icon={Layers}
                  className="h-11 font-semibold text-sm"
                  required
                />
              </div>
            </div>

            {/* IMAGE URL */}
            <div className="space-y-1.5">
              <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 ml-1">Product Media URL (Optional)</Label>
              <Input 
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                icon={ImageIcon}
                className="h-11 font-medium text-sm"
                placeholder="https://images.unsplash.com/..."
              />
            </div>
          </div>
          
          <DialogFooter className="pt-4 gap-3 md:gap-0 flex-col sm:flex-row">
            <Button 
              type="button" 
              variant="secondary" 
              onClick={onClose} 
              className="flex-1 mr-3"
              icon={X}
            >
              Discard
            </Button>
            <Button 
              type="submit" 
              disabled={loading} 
              className="flex-1"
              icon={loading ? Loader2 : CheckCircle2}
            >
              {loading ? 'Processing...' : (initialData ? 'Update Item' : 'Create Item')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

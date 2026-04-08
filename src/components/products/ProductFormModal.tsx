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
      <DialogContent className="sm:max-w-[480px] p-0 border-none shadow-2xl overflow-hidden bg-white dark:bg-card rounded-2xl">
        {/* PREMIUM MINIMALIST HEADER */}
        <div className="px-8 pt-8 pb-4">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <div className="h-12 w-12 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-center text-primary dark:text-white mb-4">
                <Package className="h-6 w-6" />
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
            <DialogTitle className="text-xl font-bold text-slate-900 dark:text-white">
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
              <div className="relative group">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">
                  <Tag className="h-4 w-4" />
                </div>
                <Input 
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="h-11 pl-10 bg-slate-50/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 rounded-xl focus:ring-1 focus:ring-primary/20 font-medium text-sm"
                  placeholder="e.g. Fresh Bananas"
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {/* CATEGORY */}
              <div className="space-y-1.5">
                <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 ml-1">Category</Label>
                <Select value={formData.category} onValueChange={(v) => setFormData({ ...formData, category: v })}>
                  <SelectTrigger className="h-11 bg-slate-50/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 rounded-xl font-medium text-sm">
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
                  <SelectTrigger className="h-11 bg-slate-50/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 rounded-xl font-medium text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-slate-100 dark:border-slate-800 shadow-xl bg-white dark:bg-card">
                    {UNITS.map(u => <SelectItem key={u} value={u} className="rounded-lg capitalize">{u}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* PRICE */}
              <div className="space-y-1.5">
                <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 ml-1">Price ($)</Label>
                <div className="relative group">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">
                    <DollarSign className="h-4 w-4" />
                  </div>
                  <Input 
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                    className="h-11 pl-10 bg-slate-50/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 rounded-xl focus:ring-1 focus:ring-primary/20 font-semibold text-sm"
                    required
                  />
                </div>
              </div>

              {/* STOCK */}
              <div className="space-y-1.5">
                <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 ml-1">Current Stock</Label>
                <div className="relative group">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">
                    <Layers className="h-4 w-4" />
                  </div>
                  <Input 
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
                    className="h-11 pl-10 bg-slate-50/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 rounded-xl focus:ring-1 focus:ring-primary/20 font-semibold text-sm"
                    required
                  />
                </div>
              </div>
            </div>

            {/* IMAGE URL */}
            <div className="space-y-1.5">
              <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 ml-1">Product Media URL (Optional)</Label>
              <div className="relative group">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">
                  <ImageIcon className="h-4 w-4" />
                </div>
                <Input 
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="h-11 pl-10 bg-slate-50/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 rounded-xl focus:ring-1 focus:ring-primary/20 font-medium text-sm"
                  placeholder="https://images.unsplash.com/..."
                />
              </div>
            </div>
          </div>
          
          <DialogFooter className="pt-4 gap-3 md:gap-0 flex-row">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose} 
              className="flex-1 h-11 rounded-xl font-bold border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 shadow-none outline-none mr-3"
            >
              Discard
            </Button>
            <Button 
              type="submit" 
              disabled={loading} 
              className="flex-1 h-11 rounded-xl bg-primary text-white shadow-xl shadow-primary/20 font-bold hover:bg-primary/90 transition-all"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <div className="flex items-center gap-2">
                   <CheckCircle2 className="h-4 w-4" />
                   {initialData ? 'Update Item' : 'Create Item'}
                </div>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

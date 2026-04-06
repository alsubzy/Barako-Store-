
"use client";

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { InventoryItem, StockAction } from '@/types/inventory';
import { Loader2, Plus, Minus } from 'lucide-react';

interface StockUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (productId: string, action: StockAction, quantity: number) => Promise<void>;
  item: InventoryItem | null;
}

export function StockUpdateModal({ isOpen, onClose, onSubmit, item }: StockUpdateModalProps) {
  const [loading, setLoading] = useState(false);
  const [action, setAction] = useState<StockAction>('add');
  const [quantity, setQuantity] = useState<number>(0);

  if (!item) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (quantity <= 0) return;
    setLoading(true);
    try {
      await onSubmit(item.productId, action, quantity);
      setQuantity(0);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[450px] rounded-3xl overflow-hidden p-0 border-none shadow-2xl">
        <div className="bg-primary p-8 text-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black text-white">Adjust Stock</DialogTitle>
            <p className="text-white/70 font-medium">Update inventory for {item.productName}</p>
          </DialogHeader>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-6 bg-white">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100">
               <div>
                 <p className="text-xs font-black uppercase text-slate-400">Current Balance</p>
                 <p className="text-lg font-black text-slate-900">{item.stockQuantity} {item.unit}</p>
               </div>
               <div className="text-right">
                 <p className="text-xs font-black uppercase text-slate-400">Category</p>
                 <p className="text-sm font-bold text-primary">{item.category}</p>
               </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Action Type</Label>
                <div className="flex p-1 bg-slate-100 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setAction('add')}
                    className={`flex-1 flex items-center justify-center gap-2 h-10 rounded-lg text-sm font-black transition-all ${action === 'add' ? 'bg-white shadow-sm text-primary' : 'text-slate-400 hover:text-slate-600'}`}
                  >
                    <Plus className="h-4 w-4" /> Add
                  </button>
                  <button
                    type="button"
                    onClick={() => setAction('remove')}
                    className={`flex-1 flex items-center justify-center gap-2 h-10 rounded-lg text-sm font-black transition-all ${action === 'remove' ? 'bg-white shadow-sm text-destructive' : 'text-slate-400 hover:text-slate-600'}`}
                  >
                    <Minus className="h-4 w-4" /> Remove
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Quantity ({item.unit})</Label>
                <Input 
                  type="number"
                  min="1"
                  value={quantity || ''}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
                  className="h-12 bg-slate-50 border-none rounded-xl font-black"
                  required
                />
              </div>
            </div>

            {action === 'remove' && quantity > item.stockQuantity && (
              <div className="p-3 rounded-xl bg-destructive/10 text-destructive text-xs font-bold border border-destructive/20">
                Warning: Insufficient stock level for this removal.
              </div>
            )}
          </div>
          
          <DialogFooter className="pt-4 gap-3">
            <Button type="button" variant="ghost" onClick={onClose} className="h-12 flex-1 rounded-xl font-black text-slate-400">Cancel</Button>
            <Button 
              type="submit" 
              disabled={loading || (action === 'remove' && quantity > item.stockQuantity)} 
              className={`h-12 flex-1 rounded-xl font-black shadow-lg transition-all ${action === 'add' ? 'bg-primary shadow-primary/20' : 'bg-destructive shadow-destructive/20'}`}
            >
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Apply Adjustment'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

"use client";

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { InventoryItem, StockAction } from '@/types/inventory';
import { Loader2, Plus, Minus, X, Layers, CheckCircle2 } from 'lucide-react';
import { Logo } from '@/components/shared/Logo';

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
      <DialogContent className="w-[95vw] sm:max-w-[425px] [&>button]:hidden">
        {/* Brand Section */}
        <div className="pt-8 px-6 flex justify-center border-b border-slate-50 dark:border-slate-800 pb-4">
          <Logo size="md" clickable={false} />
        </div>

        <div className="flex items-start justify-between px-6 pt-6 pb-4">
          <DialogHeader>
            <DialogTitle>Adjust Stock Inventory</DialogTitle>
            <DialogDescription>
              Update stock levels for <strong>{item.productName}</strong>.
            </DialogDescription>
          </DialogHeader>
          <Button 
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-slate-400 p-1 h-8 w-8"
            icon={X}
          />
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="grid gap-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 border">
               <div className="text-sm">
                 <p className="text-muted-foreground">Current Stock</p>
                 <p className="font-bold text-lg">{item.stockQuantity} {item.unit}</p>
               </div>
               <div className="text-right text-sm">
                 <p className="text-muted-foreground">Category</p>
                 <p className="font-medium">{item.category}</p>
               </div>
            </div>

            <div className="space-y-3">
              <Label>Action Type</Label>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  type="button"
                  variant={action === 'add' ? 'default' : 'outline'}
                  icon={Plus}
                  onClick={() => setAction('add')}
                  className="w-full"
                >
                  Add Stock
                </Button>
                <Button
                  type="button"
                  variant={action === 'remove' ? 'destructive' : 'outline'}
                  icon={Minus}
                  onClick={() => setAction('remove')}
                  className="w-full"
                >
                  Remove Stock
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity ({item.unit})</Label>
              <Input 
                id="quantity"
                type="number"
                min="1"
                value={quantity || ''}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
                icon={Layers}
                required
                className="h-11"
              />
            </div>

            {action === 'remove' && quantity > item.stockQuantity && (
              <p className="text-xs font-medium text-destructive">
                Warning: You are attempting to remove more stock than available.
              </p>
            )}
          </div>
          
          <DialogFooter className="flex-col sm:flex-row gap-3">
            <Button type="button" variant="secondary" onClick={onClose} disabled={loading} icon={X}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={loading || (action === 'remove' && quantity > item.stockQuantity)}
              icon={loading ? Loader2 : CheckCircle2}
            >
              {loading ? 'Updating...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

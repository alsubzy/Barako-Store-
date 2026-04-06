"use client";

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Adjust Stock Inventory</DialogTitle>
          <DialogDescription>
            Update stock levels for <strong>{item.productName}</strong>.
          </DialogDescription>
        </DialogHeader>
        
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
                  onClick={() => setAction('add')}
                  className="w-full gap-2"
                >
                  <Plus className="h-4 w-4" /> Add Stock
                </Button>
                <Button
                  type="button"
                  variant={action === 'remove' ? 'destructive' : 'outline'}
                  onClick={() => setAction('remove')}
                  className="w-full gap-2"
                >
                  <Minus className="h-4 w-4" /> Remove Stock
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
                required
              />
            </div>

            {action === 'remove' && quantity > item.stockQuantity && (
              <p className="text-xs font-medium text-destructive">
                Warning: You are attempting to remove more stock than available.
              </p>
            )}
          </div>
          
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading || (action === 'remove' && quantity > item.stockQuantity)}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

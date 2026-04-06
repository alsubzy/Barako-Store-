"use client";

import { useStore } from '@/store/useStore';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RefreshCw, Package, AlertTriangle, TrendingDown } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';

export default function InventoryPage() {
  const { products, updateProduct } = useStore();
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [adjustment, setAdjustment] = useState<number>(0);

  const lowStockCount = products.filter(p => p.stockQuantity <= 10).length;
  const criticalStockCount = products.filter(p => p.stockQuantity <= 5).length;

  const handleAdjustStock = () => {
    if (!selectedProduct) return;
    const newQuantity = Math.max(0, selectedProduct.stockQuantity + adjustment);
    updateProduct(selectedProduct.id, { stockQuantity: newQuantity });
    toast({ title: "Stock Adjusted", description: `${selectedProduct.name} stock is now ${newQuantity}.` });
    setSelectedProduct(null);
    setAdjustment(0);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-primary">Inventory Control</h1>
        <p className="text-muted-foreground">Monitor stock levels and manage inventory health.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="border-0 shadow-sm bg-primary text-primary-foreground">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Package className="h-4 w-4" /> Total SKUs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{products.length}</div>
            <p className="text-xs text-primary-foreground/70 mt-1">Unique products in catalog</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm bg-orange-500 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" /> Low Stock Items
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{lowStockCount}</div>
            <p className="text-xs text-white/70 mt-1">Items below threshold (10 units)</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm bg-destructive text-destructive-foreground">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingDown className="h-4 w-4" /> Out of Stock
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{products.filter(p => p.stockQuantity === 0).length}</div>
            <p className="text-xs text-destructive-foreground/70 mt-1">Action required immediately</p>
          </CardContent>
        </Card>
      </div>

      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-secondary/50">
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Stock Level</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => {
              const stockPercent = Math.min(100, (product.stockQuantity / 100) * 100);
              let statusColor = "default";
              let statusLabel = "Healthy";
              
              if (product.stockQuantity === 0) {
                statusColor = "destructive";
                statusLabel = "Out of Stock";
              } else if (product.stockQuantity <= 10) {
                statusColor = "secondary";
                statusLabel = "Low Stock";
              }

              return (
                <TableRow key={product.id} className="hover:bg-secondary/20 transition-colors">
                  <TableCell className="font-bold text-primary">{product.name}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell className="w-[200px]">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center justify-between text-xs">
                        <span>{product.stockQuantity} {product.unit}</span>
                        <span>{stockPercent.toFixed(0)}%</span>
                      </div>
                      <Progress value={stockPercent} className={product.stockQuantity <= 10 ? "bg-orange-200" : "bg-emerald-100"} />
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusColor as any} className={product.stockQuantity <= 10 ? "bg-orange-500 hover:bg-orange-600 text-white" : ""}>
                      {statusLabel}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="gap-2 h-8 border-primary text-primary hover:bg-primary hover:text-white"
                      onClick={() => {
                        setSelectedProduct(product);
                        setAdjustment(0);
                      }}
                    >
                      <RefreshCw className="h-3 w-3" /> Quick Update
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!selectedProduct} onOpenChange={() => setSelectedProduct(null)}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Adjust Stock Level</DialogTitle>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="text-center">
              <h4 className="text-lg font-bold text-primary">{selectedProduct?.name}</h4>
              <p className="text-sm text-muted-foreground">Current Stock: {selectedProduct?.stockQuantity} {selectedProduct?.unit}</p>
            </div>
            
            <div className="flex flex-col gap-4">
              <div className="space-y-2">
                <Label htmlFor="adjustment">Adjustment Amount (+/-)</Label>
                <Input 
                  id="adjustment" 
                  type="number" 
                  value={adjustment}
                  onChange={(e) => setAdjustment(parseInt(e.target.value) || 0)}
                  placeholder="e.g. 50 or -10"
                  className="bg-secondary/30"
                />
              </div>
              
              <div className="flex items-center justify-between p-3 rounded-lg bg-primary/5 border border-primary/20">
                 <span className="text-sm font-medium">New Stock Result</span>
                 <span className="text-lg font-bold text-primary">
                    {Math.max(0, (selectedProduct?.stockQuantity || 0) + adjustment)} {selectedProduct?.unit}
                 </span>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedProduct(null)}>Cancel</Button>
            <Button onClick={handleAdjustStock}>Confirm Update</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
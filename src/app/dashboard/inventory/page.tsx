"use client";

import { useState, useEffect, useMemo } from 'react';
import { inventoryAPI } from '@/services/inventoryAPI';
import { InventoryItem, StockHistory, StockAction } from '@/types/inventory';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Package, AlertTriangle, Boxes, Search, RefreshCw, 
  History, TrendingUp, TrendingDown, ArrowRight, Loader2,
  CheckCircle2, AlertCircle
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { StockUpdateModal } from '@/components/inventory/StockUpdateModal';

export default function InventoryPage() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [history, setHistory] = useState<StockHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [invRes, histRes] = await Promise.all([
        inventoryAPI.getStatus(),
        inventoryAPI.getHistory()
      ]);
      if (invRes.success) setInventory(invRes.data || []);
      if (histRes.success) setHistory(histRes.data || []);
    } catch (err) {
      toast({ title: "Error", description: "Failed to load inventory data", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStock = async (productId: string, action: StockAction, quantity: number) => {
    try {
      const res = await inventoryAPI.updateStock({ productId, action, quantity });
      if (res.success) {
        toast({ title: "Success", description: res.message });
        fetchData(); 
      } else {
        toast({ title: "Failed", description: res.message, variant: "destructive" });
      }
    } catch (err) {
      toast({ title: "Error", description: "Stock update failed", variant: "destructive" });
    }
  };

  const filteredInventory = inventory.filter(p => 
    p.productName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = useMemo(() => {
    const lowStock = inventory.filter(p => p.stockQuantity > 0 && p.stockQuantity < 10).length;
    const outOfStock = inventory.filter(p => p.stockQuantity === 0).length;
    return { lowStock, outOfStock, total: inventory.length };
  }, [inventory]);

  const getStatusBadge = (stock: number) => {
    if (stock === 0) return { label: 'Out of Stock', variant: 'destructive' as const, icon: AlertCircle };
    if (stock < 10) return { label: 'Low Stock', variant: 'secondary' as const, icon: AlertTriangle };
    return { label: 'In Stock', variant: 'default' as const, icon: CheckCircle2 };
  };

  if (loading && inventory.length === 0) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary">Inventory Management</h1>
          <p className="text-muted-foreground">Monitor stock levels and movement across your store.</p>
        </div>
        <Button onClick={fetchData} variant="outline" icon={RefreshCw} className="order-first sm:order-last">
          Refresh Data
        </Button>
      </div>

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Boxes className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">Monitored in inventory</p>
          </CardContent>
        </Card>
        <Card className="border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.lowStock}</div>
            <p className="text-xs text-muted-foreground">Action required soon</p>
          </CardContent>
        </Card>
        <Card className="border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
            <AlertCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.outOfStock}</div>
            <p className="text-xs text-muted-foreground">Critical restocking needed</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="status" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-[400px]">
          <TabsTrigger value="status">Current Status</TabsTrigger>
          <TabsTrigger value="history">Movement History</TabsTrigger>
        </TabsList>

        <TabsContent value="status" className="space-y-4 pt-4">
          <div className="flex items-center gap-4 rounded-xl bg-card p-4 shadow-sm border">
            <div className="flex-1 min-w-[300px]">
              <Input 
                placeholder="Search inventory items..." 
                icon={Search}
                className="h-11 rounded-xl"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
            <Table>
              <TableHeader className="bg-secondary/50">
                <TableRow>
                  <TableHead>Product Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Stock Level</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInventory.map((item) => {
                  const status = getStatusBadge(item.stockQuantity);
                  const StatusIcon = status.icon;
                  return (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.productName}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{item.category}</Badge>
                      </TableCell>
                      <TableCell>
                        <span className="font-bold">{item.stockQuantity}</span> {item.unit}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <StatusIcon className={`h-4 w-4 ${status.variant === 'destructive' ? 'text-destructive' : status.variant === 'secondary' ? 'text-accent' : 'text-primary'}`} />
                          <Badge variant={status.variant}>{status.label}</Badge>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          icon={RefreshCw}
                          onClick={() => { setSelectedItem(item); setIsUpdateOpen(true); }}
                          className="hover:bg-primary/10 text-primary"
                        >
                          Adjust
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {filteredInventory.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                      No inventory items found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="history" className="pt-4">
          <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
            <Table>
              <TableHeader className="bg-secondary/50">
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead className="text-right">New Balance</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {history.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="text-xs text-muted-foreground">
                      {new Date(log.timestamp).toLocaleString()}
                    </TableCell>
                    <TableCell className="font-medium">{log.productName}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {log.action === 'add' ? (
                          <TrendingUp className="h-4 w-4 text-primary" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-destructive" />
                        )}
                        <span className="capitalize">{log.action}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-bold">
                      {log.action === 'add' ? '+' : '-'}{log.quantity}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {log.newStock}
                    </TableCell>
                  </TableRow>
                ))}
                {history.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                      No history recorded.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>

      <StockUpdateModal 
        isOpen={isUpdateOpen} 
        onClose={() => { setIsUpdateOpen(false); setSelectedItem(null); }} 
        onSubmit={handleUpdateStock}
        item={selectedItem}
      />
    </div>
  );
}


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
        fetchData(); // Refresh both lists
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
    if (stock === 0) return { label: 'Out of Stock', color: 'bg-destructive/10 text-destructive border-destructive/20', icon: AlertCircle };
    if (stock < 10) return { label: 'Low Stock', color: 'bg-accent/10 text-primary border-accent/20', icon: AlertTriangle };
    return { label: 'Healthy', color: 'bg-emerald-50 text-emerald-600 border-emerald-100', icon: CheckCircle2 };
  };

  if (loading && inventory.length === 0) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-primary">Inventory Control</h1>
          <p className="text-slate-500 font-medium">Real-time stock monitoring and replenishment.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={fetchData} className="h-12 px-6 rounded-xl border-slate-200 font-bold hover:bg-slate-50">
            <RefreshCw className="mr-2 h-4 w-4" /> Refresh
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="border-none shadow-sm bg-white overflow-hidden rounded-[24px]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="bg-primary/10 p-3 rounded-2xl">
                <Boxes className="h-6 w-6 text-primary" />
              </div>
              <Badge variant="secondary" className="bg-slate-100 text-slate-500 border-none font-bold">Total SKUs</Badge>
            </div>
            <div className="mt-4">
              <h3 className="text-4xl font-black text-slate-900">{stats.total}</h3>
              <p className="text-sm font-medium text-slate-400 mt-1">Products monitored</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-white overflow-hidden rounded-[24px]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="bg-accent/20 p-3 rounded-2xl">
                <AlertTriangle className="h-6 w-6 text-primary" />
              </div>
              {stats.lowStock > 0 && <Badge className="bg-accent text-primary border-none font-black animate-pulse">ACTION REQ</Badge>}
            </div>
            <div className="mt-4">
              <h3 className="text-4xl font-black text-slate-900">{stats.lowStock}</h3>
              <p className="text-sm font-medium text-slate-400 mt-1">Low stock items</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-white overflow-hidden rounded-[24px]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="bg-destructive/10 p-3 rounded-2xl">
                <TrendingDown className="h-6 w-6 text-destructive" />
              </div>
              {stats.outOfStock > 0 && <Badge className="bg-destructive text-white border-none font-black">CRITICAL</Badge>}
            </div>
            <div className="mt-4">
              <h3 className="text-4xl font-black text-slate-900">{stats.outOfStock}</h3>
              <p className="text-sm font-medium text-slate-400 mt-1">Out of stock items</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="status" className="w-full">
        <TabsList className="bg-white border p-1 rounded-2xl h-14 mb-6 shadow-sm">
          <TabsTrigger value="status" className="rounded-xl h-full px-8 data-[state=active]:bg-primary data-[state=active]:text-white font-bold">
            <Package className="h-4 w-4 mr-2" /> Current Status
          </TabsTrigger>
          <TabsTrigger value="history" className="rounded-xl h-full px-8 data-[state=active]:bg-primary data-[state=active]:text-white font-bold">
            <History className="h-4 w-4 mr-2" /> Movement History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="status" className="space-y-6">
          <Card className="flex items-center px-4 h-14 border-none shadow-sm rounded-2xl overflow-hidden bg-white">
            <Search className="h-5 w-5 text-slate-400 mr-3" />
            <Input 
              placeholder="Filter inventory by product name..." 
              className="border-none bg-transparent focus-visible:ring-0 font-medium text-slate-900"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Card>

          <Card className="border-none shadow-sm rounded-[32px] overflow-hidden bg-white">
            <Table>
              <TableHeader className="bg-slate-50/80">
                <TableRow className="border-none hover:bg-transparent">
                  <TableHead className="font-bold text-slate-500 py-6 px-8">Product</TableHead>
                  <TableHead className="font-bold text-slate-500">Category</TableHead>
                  <TableHead className="font-bold text-slate-500">Stock Balance</TableHead>
                  <TableHead className="font-bold text-slate-500">Status</TableHead>
                  <TableHead className="font-bold text-slate-500 text-right px-8">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInventory.map((item) => {
                  const status = getStatusBadge(item.stockQuantity);
                  const StatusIcon = status.icon;
                  return (
                    <TableRow key={item.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                      <TableCell className="px-8 font-black text-slate-900">{item.productName}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="bg-slate-100 text-slate-500 border-none font-bold rounded-lg">
                          {item.category}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1.5">
                          <p className="text-sm font-black text-slate-700">{item.stockQuantity} <span className="text-[10px] text-slate-400 uppercase">{item.unit}</span></p>
                          <div className="h-1.5 w-24 bg-slate-100 rounded-full overflow-hidden">
                            <div 
                              className={`h-full transition-all ${item.stockQuantity < 10 ? 'bg-accent' : 'bg-primary'}`} 
                              style={{ width: `${Math.min(100, (item.stockQuantity / 50) * 100)}%` }}
                            />
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${status.color}`}>
                          <StatusIcon className="h-3 w-3" />
                          {status.label}
                        </div>
                      </TableCell>
                      <TableCell className="text-right px-8">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => { setSelectedItem(item); setIsUpdateOpen(true); }}
                          className="h-9 px-4 rounded-xl font-bold text-primary hover:bg-primary/5 hover:text-primary"
                        >
                          <RefreshCw className="h-3.5 w-3.5 mr-2" /> Adjust
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {filteredInventory.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="h-64 text-center">
                      <div className="flex flex-col items-center justify-center opacity-40">
                        <Boxes className="h-16 w-16 mb-4 text-slate-300" />
                        <p className="text-xl font-black text-slate-900">No inventory records</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card className="border-none shadow-sm rounded-[32px] overflow-hidden bg-white">
            <Table>
              <TableHeader className="bg-slate-50/80">
                <TableRow className="border-none hover:bg-transparent">
                  <TableHead className="font-bold text-slate-500 py-6 px-8">Date & Time</TableHead>
                  <TableHead className="font-bold text-slate-500">Product</TableHead>
                  <TableHead className="font-bold text-slate-500">Movement</TableHead>
                  <TableHead className="font-bold text-slate-500 text-right px-8">Stock Change</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {history.map((log) => (
                  <TableRow key={log.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <TableCell className="px-8 font-medium text-slate-500">
                      {new Date(log.timestamp).toLocaleString()}
                    </TableCell>
                    <TableCell className="font-bold text-slate-900">{log.productName}</TableCell>
                    <TableCell>
                      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl font-black text-[10px] uppercase ${log.action === 'add' ? 'bg-emerald-50 text-emerald-600' : 'bg-destructive/5 text-destructive'}`}>
                        {log.action === 'add' ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                        {log.action}
                      </div>
                    </TableCell>
                    <TableCell className="text-right px-8">
                      <div className="flex items-center justify-end gap-3">
                         <span className="text-xs font-bold text-slate-400">{log.previousStock}</span>
                         <ArrowRight className="h-3 w-3 text-slate-300" />
                         <span className={`font-black ${log.action === 'add' ? 'text-emerald-600' : 'text-destructive'}`}>{log.newStock}</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {history.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="h-64 text-center">
                      <div className="flex flex-col items-center justify-center opacity-40">
                        <History className="h-16 w-16 mb-4 text-slate-300" />
                        <p className="text-xl font-black text-slate-900">No stock history recorded</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Card>
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

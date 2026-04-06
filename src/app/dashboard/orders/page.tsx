"use client";

import { useStore } from '@/store/useStore';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Eye, Filter } from 'lucide-react';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export default function OrdersPage() {
  const { orders } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  const filteredOrders = orders.filter(o => 
    o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.customerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-primary">Order Management</h1>
        <p className="text-muted-foreground">View and track all customer transactions.</p>
      </div>

      <div className="flex items-center gap-4 rounded-xl bg-card p-4 shadow-sm border">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input 
            placeholder="Search by order ID or customer name..." 
            className="pl-10 bg-secondary/30" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" className="gap-2">
          <Filter className="h-4 w-4" /> Filter
        </Button>
      </div>

      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-secondary/50">
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.map((order) => (
              <TableRow key={order.id} className="hover:bg-secondary/20 transition-colors">
                <TableCell className="font-mono text-xs font-bold text-primary">{order.id}</TableCell>
                <TableCell className="text-xs text-muted-foreground">
                  {new Date(order.createdAt).toLocaleString()}
                </TableCell>
                <TableCell className="font-medium">{order.customerName}</TableCell>
                <TableCell className="font-bold text-primary">${order.total.toFixed(2)}</TableCell>
                <TableCell>{order.items.reduce((sum, i) => sum + i.quantity, 0)} items</TableCell>
                <TableCell>
                  <Badge variant={order.status === 'completed' ? 'default' : 'secondary'} className="capitalize">
                    {order.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" className="hover:bg-primary/10 text-primary" onClick={() => setSelectedOrder(order)}>
                    <Eye className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {filteredOrders.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                  No orders found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Order Details - {selectedOrder?.id}</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-6">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Customer</p>
                <p className="font-bold">{selectedOrder?.customerName}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Date</p>
                <p className="font-bold">{selectedOrder ? new Date(selectedOrder.createdAt).toLocaleString() : ''}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Status</p>
                <Badge className="mt-1">{selectedOrder?.status}</Badge>
              </div>
              <div>
                <p className="text-muted-foreground">Payment Method</p>
                <p className="font-bold">Cash / Mock Payment</p>
              </div>
            </div>

            <div className="rounded-xl border overflow-hidden">
               <Table>
                 <TableHeader className="bg-secondary/30">
                   <TableRow>
                     <TableHead className="h-8 text-[10px] uppercase">Item</TableHead>
                     <TableHead className="h-8 text-[10px] uppercase text-right">Qty</TableHead>
                     <TableHead className="h-8 text-[10px] uppercase text-right">Price</TableHead>
                   </TableRow>
                 </TableHeader>
                 <TableBody>
                   {selectedOrder?.items.map((item: any) => (
                     <TableRow key={item.id}>
                       <TableCell className="py-2 text-xs font-medium">{item.name}</TableCell>
                       <TableCell className="py-2 text-xs text-right">{item.quantity} {item.unit}</TableCell>
                       <TableCell className="py-2 text-xs text-right">${(item.price * item.quantity).toFixed(2)}</TableCell>
                     </TableRow>
                   ))}
                 </TableBody>
               </Table>
            </div>

            <div className="flex justify-between items-center p-4 rounded-xl bg-primary text-primary-foreground shadow-inner">
               <span className="font-bold">Total Amount Paid</span>
               <span className="text-2xl font-bold">${selectedOrder?.total.toFixed(2)}</span>
            </div>
          </div>
          <div className="flex justify-end">
            <Button onClick={() => setSelectedOrder(null)}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}